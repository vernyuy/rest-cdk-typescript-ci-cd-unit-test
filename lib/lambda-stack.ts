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

    /**********************************
     * Define Dynamodb table resource
     **********************************/
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

    /*******************************
     * Define API Gateway Resource
     *******************************/
    const weatherApi: apigw.RestApi = new apigw.RestApi(
      this,
      `weather_rest_api`,
      {
        restApiName: `${props.stageName} Weather Rest Api`,
        description: "This service serves weather data.",
      } as apigw.RestApiProps
    );

    /*********************************************************
     * Define lambda function to perform the CREATE Operation
     *********************************************************/
    const createWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "CreateWeatherLambdaFunction",
      {
        functionName: `${props.stageName}-cdk-typescript-create`,
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "createWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props.stageName,
        },
      }
    );

    /*******************************************************************
     * Give the lambda function permisions to write to the defined table.
     ********************************************************************/
    table.grantWriteData(createWeatherLambda);

    /*********************************************************
     * Define lambda function to perform the READ Operation
     *********************************************************/
    const getWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "getWeatherLambdaFunction",
      {
        functionName: `${props.stageName}-cdk-typescript-get`,
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "getWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props.stageName,
        },
      }
    );

    /*******************************************************************
     * Give the lambda function permisions to read from the defined table.
     ********************************************************************/
    table.grantReadData(getWeatherLambda);

    /*********************************************************
     * Define lambda function to perform the LIST Operation
     *********************************************************/
    const listWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "listWeatherLambdaFunction",
      {
        functionName: `${props.stageName}-cdk-typescript-list`,
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "listWeathers.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props.stageName,
        },
      }
    );

    /*******************************************************************
     * Give the lambda function permisions to read from the defined table.
     ********************************************************************/
    table.grantReadData(listWeatherLambda);

    /*********************************************************
     * Define lambda function to perform the DELETE Operation
     *********************************************************/
    const deleteWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "deleteWeatherLambdaFunction",
      {
        functionName: `${props.stageName}-cdk-typescript-delete`,
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "deleteWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props.stageName,
        },
      }
    );

    /**************************************************************************
     * Give the lambda function permisions to read/write from the defined table.
     **************************************************************************/
    table.grantReadWriteData(deleteWeatherLambda);

    /*********************************************************
     * Define lambda function to perform the UPDATE Operation
     *********************************************************/
    const updateWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "updateWeatherLambdaFunction",
      {
        functionName: `${props.stageName}-cdk-typescript-update`,
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "updateWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props.stageName,
        },
      }
    );

    /**************************************************************************
     * Give the lambda function permisions to read/write from the defined table.
     **************************************************************************/
    table.grantReadWriteData(updateWeatherLambda);

    /**************************************************************************
     * Define endpoint routes and http methods
     **************************************************************************/
    weatherApi.root
      .addResource("create-weather")
      .addMethod("POST", new apigw.LambdaIntegration(createWeatherLambda));

    const weathers: apigw.Resource = weatherApi.root.addResource("weather");

    const weather: apigw.Resource = weathers.addResource("{id}");

    weathers.addMethod("GET", new apigw.LambdaIntegration(listWeatherLambda));

    weather.addMethod("GET", new apigw.LambdaIntegration(getWeatherLambda));

    weather.addMethod(
      "DELETE",
      new apigw.LambdaIntegration(deleteWeatherLambda)
    );

    weather.addMethod("PUT", new apigw.LambdaIntegration(updateWeatherLambda));
  }
}
