#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RestCdkTypescriptStack } from '../lib/rest_cdk_typescript-stack';

const app = new cdk.App();

new RestCdkTypescriptStack(app, 'RestCdkTypescriptStack', {
  env: { account: '132260253285', region: 'us-east-2' },

});