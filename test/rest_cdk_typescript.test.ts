import * as RestCdkTypescript from "../lib/rest_cdk_typescript-stack";
import * as cdk from "aws-cdk-lib";
import { Template, Capture } from "aws-cdk-lib/assertions";

test("DynamoDB Table Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new RestCdkTypescript.RestCdkTypescriptStack(
    app,
    "MyTestStack"
  );
  // THEN
  const template = Template.fromStack(stack);
  // template.resourceCountIs("AWS::DynamoDB::Table", 1);
  template.hasResource("AWS::DynamoDB::Table", {
    Properties: {
      TableName: "weatherApiTable",
    },
  });
});

test("ApiGatway RestApi Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new RestCdkTypescript.RestCdkTypescriptStack(
    app,
    "MyTestStack"
  );
  // THEN
  const template = Template.fromStack(stack);
  template.hasResource("AWS::ApiGateway::RestApi", {
    Properties: {
      Name: "Weather Rest Api",
    },
  });
});

test("5 Lambda Functions Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new RestCdkTypescript.RestCdkTypescriptStack(
    app,
    "MyTestStack"
  );
  // THEN
  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::Lambda::Function", 5);
});

test("Api Gateway Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new RestCdkTypescript.RestCdkTypescriptStack(
    app,
    "MyTestStack"
  );
  // THEN
  const template = Template.fromStack(stack);
  template.hasResource("AWS::ApiGateway::RestApi", {
    Properties: {
      Name: "Weather Rest Api",
    },
  });
});

test("Lambda Has Environment Variables", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new RestCdkTypescript.RestCdkTypescriptStack(
    app,
    "MyTestStack"
  );
  // THEN
  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });

  expect(envCapture.asObject()).toEqual({
    Variables: {
      TABLE_NAME: {
        Ref: "CdkTypescriptWeatherTable193DDE34",
      },
    },
  });
});

test("Lambda Function typescript created", () => {
  const app = new cdk.App();
  const stack = new RestCdkTypescript.RestCdkTypescriptStack(
    app,
    "LambdaFunction"
  );
  const template = Template.fromStack(stack);
  template.hasResource("AWS::Lambda::Function", {
    Properties: {
      FunctionName: "cdk-typescript-create",
    },
  });
});

test("Lambda Function typescript delete", () => {
  const app = new cdk.App();
  const stack = new RestCdkTypescript.RestCdkTypescriptStack(
    app,
    "LambdaFunction"
  );
  const template = Template.fromStack(stack);
  template.hasResource("AWS::Lambda::Function", {
    Properties: {
      FunctionName: "cdk-typescript-delete",
    },
  });
});
