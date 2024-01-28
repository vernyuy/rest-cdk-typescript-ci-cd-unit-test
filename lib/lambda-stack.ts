import { Stack, StackProps } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigw from "aws-cdk-lib/aws-apigateway";

interface LambdaStackProps extends StackProps {
  stageName: string;
}

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);
    
    const table: dynamodb.Table = new dynamodb.Table(
      this,
      `${props.stageName}CdkTypescriptWeatherTable`,
      {
        tableName: `${props.stageName}weatherApiTable`,
        partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );
    cdk.Tags.of(table).add("RestCdkTypescript", "Test");

    // Api gateway resource
    const weatherApi: apigw.RestApi = new apigw.RestApi(
      this,
      "weather_rest_api",
      {
        restApiName: "Weather Rest Api",
        description: "This service serves weather data.",
      } as apigw.RestApiProps
    );


    // Lambda resource to create weather item in dynamodb
    const createWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "CreateWeatherLambdaFunction",
      {
        functionName: "cdk-typescript-create",
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "createWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props.stageName,
        },
      }
    );
    // Grant createWeatherLambda the permission to write to dynamodb table
    table.grantReadWriteData(createWeatherLambda);

    // Defining a lambda resource to read data from dynamodb table
    const getWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "getWeatherLambdaFunction",
      {
        functionName: "cdk-typescript-get",
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "getWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props.stageName,
        },
      }
    );

    // Grant getWeatherLambda the permission to read data from dynamodb table
    table.grantReadData(getWeatherLambda);

    // Defining a lambda resource to list all data from dynamodb table
    const listWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "listWeatherLambdaFunction",
      {
        functionName: "cdk-typescript-list",
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "listWeathers.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props.stageName,
        },
      }
    );

    // Grant listWeatherLambda the permission to read data from dynamodb table
    table.grantReadData(listWeatherLambda);

    // Defining a lambda resource to delete data from dynamodb table
    const deleteWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "deleteWeatherLambdaFunction",
      {
        functionName: "cdk-typescript-delete",
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "deleteWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props.stageName,
        },
      }
    );

    // Grant deleteWeatherLambda the permission to delete data from dynamodb table
    table.grantReadWriteData(deleteWeatherLambda);

    // Defining a lambda resource to update data in dynamodb table
    const updateWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "updateWeatherLambdaFunction",
      {
        functionName: "cdk-typescript-update",
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "updateWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props.stageName,
        },
      }
    );

    // Grant updateWeatherLambda the permission to update data in dynamodb table
    table.grantReadWriteData(updateWeatherLambda);

    // Defining an api route to create a weather item
    weatherApi.root
      .addResource("create-weather")
      .addMethod("POST", new apigw.LambdaIntegration(createWeatherLambda));

    // Defining an api route to read a weather item
    const weathers: apigw.Resource = weatherApi.root.addResource("weather");
    const weather: apigw.Resource = weathers.addResource("{id}");
    // Defining an api route to list all weather items
    weathers.addMethod("GET", new apigw.LambdaIntegration(listWeatherLambda));
    weather.addMethod("GET", new apigw.LambdaIntegration(getWeatherLambda));
    // Defining an api route to delete a weather items
    weather.addMethod(
      "DELETE",
      new apigw.LambdaIntegration(deleteWeatherLambda)
    );

    // Defining an api route to update a weather item
    weather.addMethod("PUT", new apigw.LambdaIntegration(updateWeatherLambda));
  }
}
