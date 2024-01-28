import * as cdk from "aws-cdk-lib";
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

    /***********************************************************************
     *    Create codepipeline for the project using github as code source.
     ***********************************************************************/
    const pipeline = new CodePipeline(this, "Pipeline", {
      synth: new ShellStep("synth", {
        input: CodePipelineSource.gitHub(
          "vernyuy/rest-cdk-typescript-ci-cd-unit-test",
          "master"
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    /***********************************************************************
     *    Add test stage
     ***********************************************************************/
    const testStage = pipeline.addStage(
      new PipelineStage(this, "PipelineTestStage", {
        stageName: "test",
      })
    );

    const prodStage = pipeline.addStage(
      new PipelineStage(this, "PipelineProdStage", {
        stageName: "prod",
      })
    );

    /***********************************************************************
     *    Authomate unit test within the stage
     ***********************************************************************/
    testStage.addPre(
      new CodeBuildStep("unit test", {
        commands: ["npm ci", "npm run test"],
      })
    );
  }
}
