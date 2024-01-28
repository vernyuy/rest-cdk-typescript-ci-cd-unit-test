import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { PipelineStage } from "./pipeline-stage";

import {
  CodePipeline,
  ShellStep,
  CodePipelineSource,
} from "aws-cdk-lib/pipelines";

export class RestCdkTypescriptStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "Pipeline", {
      synth: new ShellStep("synth", {
        input: CodePipelineSource.gitHub(
          "vernyuy/rest-cdk-typescript-ci-cd-unit-test",
          "master"
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    // const deployStage = pipeline.addStage();

    // deployStage.addPost(
    //   new CodeBuildStep('TestViewerEndpoint', {
    //       projectName: 'TestViewerEndpoint',
    //       // envFromCfnOutputs: {
    //       //     ENDPOINT_URL: 'WE'
    //       // },
    //       commands: [
    //           'curl -Ssf $ENDPOINT_URL'
    //       ]
    //   }),

    // new CodeBuildStep("TestAPIGatewayEndpoint", {
    //   projectName: "TestAPIGatewayEndpoint",
    //   // envFromCfnOutputs: {
    //   //     ENDPOINT_URL: //TBD
    //   // },
    //   commands: [
    //     "curl -Ssf $ENDPOINT_URL",
    //     "curl -Ssf $ENDPOINT_URL/hello",
    //     "curl -Ssf $ENDPOINT_URL/test",
    //   ],
    // });
    // )

    const table: dynamodb.Table = new dynamodb.Table(
      this,
      "CdkTypescriptWeatherTable",
      {
        tableName: "weatherApiTable",
        partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );
    cdk.Tags.of(table).add("RestCdkTypescript", "Dev");

    // Api gateway resource
    const weatherApi: apigw.RestApi = new apigw.RestApi(
      this,
      "weather_rest_api",
      {
        restApiName: "Weather Rest Api",
        description: "This service serves weather data.",
      } as apigw.RestApiProps
    );

    const testStage = pipeline.addStage(
      new PipelineStage(this, "PipelineTestStage", {
        table: table,
        weatherApi: weatherApi,
      })
    );
  }
}
