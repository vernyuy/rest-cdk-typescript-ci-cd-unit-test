import * as RestCdkTypescript from "../lib/rest_cdk_typescript-stack";
import * as cdk from "aws-cdk-lib";
import { Template, Capture } from "aws-cdk-lib/assertions";
import { lambdaHandler } from "../src/listWeathers";
import * as LambdaStack from "../lib/lambda-stack"

test("DynamoDB Table Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LambdaStack.LambdaStack(
    app,
    "MyTestStack",
    {
      stageName: "Test"
    }
  );
  // THEN
  const template = Template.fromStack(stack);
  // template.resourceCountIs("AWS::DynamoDB::Table", 1);
  template.hasResource("AWS::DynamoDB::Table", {
    Properties: {
      TableName: "TestweatherApiTable",
    },
  });
});

test("ApiGatway RestApi Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LambdaStack.LambdaStack(
    app,
    "MyTestStack",
    {
      stageName: "Test"
    }
  );
  // THEN
  const template = Template.fromStack(stack);
  template.hasResource("AWS::ApiGateway::RestApi", {
    Properties: {
      Name: "Test Weather Rest Api",
    },
  });
});

test("5 Lambda Functions Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LambdaStack.LambdaStack(
    app,
    "MyTestStack",
    {
      stageName: "Test"
    }
  );
  // THEN
  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::Lambda::Function", 5);
});

// test("Api Gateway Created", () => {
//   const app = new cdk.App();
//   // WHEN
//   const stack = new LambdaStack.LambdaStack(
//     app,
//     "MyTestStack",
//     {
//       stageName: "Test"
//     }
//   );
//   // THEN
//   const template = Template.fromStack(stack);
//   template.hasResource("AWS::ApiGateway::RestApi", {
//     Properties: {
//       Name: "Weather Rest Api",
//     },
//   });
// });

test("Lambda Has Environment Variables", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LambdaStack.LambdaStack(
    app,
    "MyTestStack",
    {
      stageName: "Test"
    }
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
        Ref: "TestCdkTypescriptWeatherTableA8BF8E32",
      },
      STAGE_NAME: "Test"
    },
  });
});

// test("Lambda Function typescript created", () => {
//   const app = new cdk.App();
//   const stack = new LambdaStack.LambdaStack(
//     app,
//     "MyTestStack",
//     {
//       stageName: "Test"
//     }
//   );
//   const template = Template.fromStack(stack);
//   template.hasResource("AWS::Lambda::Function", {
//     Properties: {
//       FunctionName: "cdk-typescript-create",
//     },
//   });
// });

// test("Lambda Function typescript delete", () => {
//   const app = new cdk.App();
//   const stack = new LambdaStack.LambdaStack(
//     app,
//     "MyTestStack",
//     {
//       stageName: "Test"
//     }
//   );
//   const template = Template.fromStack(stack);
//   template.hasResource("AWS::Lambda::Function", {
//     Properties: {
//       FunctionName: "cdk-typescript-delete",
//     },
//   });
// });


// test("Lambda status", async ()=>{
//   const result = await lambdaHandler();
//   expect(result.statusCode).toBe(200)
// })