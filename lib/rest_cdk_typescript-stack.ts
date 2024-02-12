import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { PipelineStage } from "./pipeline-stage";
import {
  CodePipeline,
  ShellStep,
  CodePipelineSource,
  CodeBuildStep,
  ManualApprovalStep,
} from "aws-cdk-lib/pipelines";

export class RestCdkTypescriptStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /***********************************************************************
     *    Create codepipeline for the project using github as code source.
     ***********************************************************************/
    new CodePipeline(this, "Pipeline", {
      synth: new ShellStep("synth", {
        input: CodePipelineSource.gitHub(
          "vernyuy/rest-cdk-typescript-ci-cd-unit-test",
          "master"
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    // /*********************************
    //  *    Add test stage
    //  *********************************/
    // const devStage = pipeline.addStage(
    //   new PipelineStage(this, "PipelineDevStage", {
    //     stageName: "dev",
    //   })
    // );

    // const prodStage = pipeline.addStage(
    //   new PipelineStage(this, "PipelineProdStage", {
    //     stageName: "prod",
    //   })
    // );

    // /*****************************************************
    //  *    Authomate unit test within the stage
    //  *****************************************************/
    // devStage.addPre(
    //   new CodeBuildStep("unit test", {
    //     commands: ["npm ci", "npm run test"],
    //   })
    // );

    // devStage.addPost(
    //   new ManualApprovalStep("Manual aproval before production")
    // );
  }
}
