#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RestCdkTypescriptStack } from '../lib/rest_cdk_typescript-stack';
import { AwsSolutionsChecks } from "cdk-nag";
import { Aspects } from "aws-cdk-lib";

const app = new cdk.App();
// Add the cdk-nag AwsSolutions Pack with extra verbose logging enabled.
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
new RestCdkTypescriptStack(app, 'RestCdkTypescriptStack', {
  env: { account: '132260253285', region: 'us-east-2' },

});