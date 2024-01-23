import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import path = require("path");
import { CodePipeline, ShellStep, CodePipelineSource } from "aws-cdk-lib/pipelines";


export class RestCdkTypescriptStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, "Pipeline", {
      synth: new ShellStep("synth", {
        input: CodePipelineSource.gitHub(
          "vernyuy/unit-test-with-cdk-typescript",
          "master"
        ),
        commands: ["npm ci", "npm run build","npm run test", "npx cdk synth"],
      }),
    });

    const table = new dynamodb.Table(this, "CdkTypescriptWeatherTable", {
      tableName: "weatherApiTable",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda resource to create weather item in dynamodb
    const createWeatherLambda = new lambda.Function(
      this,
      "CreateWeatherLambdaFunction",
      {
        functionName: "cdk-typescript-create",
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "createWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
        },
      }
    );

    // Api gateway resource
    const weather_api = new apigw.RestApi(this, "weather_rest_api", {
      restApiName: "Weather Rest Api",
      description: "This service serves weather data.",
    } as apigw.RestApiProps);

    // Grant createWeatherLambda the permission to write to dynamodb table
    table.grantReadWriteData(createWeatherLambda);

    // Defining an api route to create a weather item
    weather_api.root
      .addResource("create-weather")
      .addMethod("POST", new apigw.LambdaIntegration(createWeatherLambda));

    // Defining a lambda resource to read data from dynamodb table
    const getWeatherLambda = new lambda.Function(
      this,
      "getWeatherLambdaFunction",
      {
        functionName: "cdk-typescript-get",
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "getWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
        },
      }
    );

    // Grant getWeatherLambda the permission to read data from dynamodb table
    table.grantReadData(getWeatherLambda);

    // Defining an api route to read a weather item
    const weathers = weather_api.root.addResource("weather");
    const weather = weathers.addResource("{id}");
    weather.addMethod("GET", new apigw.LambdaIntegration(getWeatherLambda));

    // Defining a lambda resource to list all data from dynamodb table
    const listWeatherLambda = new lambda.Function(
      this,
      "listWeatherLambdaFunction",
      {
        functionName: "cdk-typescript-list",
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "listWeathers.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
        },
      }
    );

    // Grant listWeatherLambda the permission to read data from dynamodb table
    table.grantReadData(listWeatherLambda);

    // Defining an api route to list all weather items
    weathers.addMethod("GET", new apigw.LambdaIntegration(listWeatherLambda));

    // Defining a lambda resource to delete data from dynamodb table
    const deleteWeatherLambda = new lambda.Function(
      this,
      "deleteWeatherLambdaFunction",
      {
        functionName: "cdk-typescript-delete",
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "deleteWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
        },
      }
    );

    // Grant deleteWeatherLambda the permission to delete data from dynamodb table
    table.grantReadWriteData(deleteWeatherLambda);

    // Defining an api route to delete a weather items
    weather.addMethod(
      "DELETE",
      new apigw.LambdaIntegration(deleteWeatherLambda)
    );

    // Defining a lambda resource to update data in dynamodb table
    const updateWeatherLambda = new lambda.Function(
      this,
      "updateWeatherLambdaFunction",
      {
        functionName: "cdk-typescript-update",
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "updateWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
        },
      }
    );

    // Grant updateWeatherLambda the permission to update data in dynamodb table
    table.grantReadWriteData(updateWeatherLambda);

    // Defining an api route to update a weather item
    weather.addMethod("PUT", new apigw.LambdaIntegration(updateWeatherLambda));
  }
}
