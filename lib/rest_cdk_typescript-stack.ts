import * as cdk from "aws-cdk-lib";
// import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
// import * as apigw from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { PipelineStage } from "./pipeline-stage";

import {
  CodePipeline,
  ShellStep,
  CodePipelineSource,
  CodeBuildStep,
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

    
    const testStage = pipeline.addStage(
      new PipelineStage(this, "PipelineTestStage", {
        stageName: "test"
      })
    );

    testStage.addPre(new CodeBuildStep("unit test", {
      commands:[
        'npm ci',
        'npm run test'
      ]
    }))
  }
}
