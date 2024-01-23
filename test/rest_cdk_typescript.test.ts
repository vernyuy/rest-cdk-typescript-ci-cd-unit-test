import * as RestCdkTypescript from "../lib/rest_cdk_typescript-stack";
import * as cdk from "aws-cdk-lib";
import { Template, Capture } from "aws-cdk-lib/assertions";
import * as lambda from "aws-cdk-lib/aws-lambda";

test("DynamoDB Table Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new RestCdkTypescript.RestCdkTypescriptStack(
    app,
    "MyTestStack"
  );
  // THEN
  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::DynamoDB::Table", 1);
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
    template.resourceCountIs("AWS::ApiGateway::RestApi", 1);
  });
  

test("Lambda Functions Created", () => {
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
  
test('Lambda Has Environment Variables', () => {
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

    expect(envCapture.asObject()).toEqual(
      {
        Variables: {
          TABLE_NAME: {
            Ref: "CdkTypescriptWeatherTable193DDE34",
          },
        },
      }
    );
  });

  // test('Lambda Function created', ()=>{
  //   const app = new cdk.App();

  //   const stack = new RestCdkTypescript.RestCdkTypescriptStack(
  //     app,
  //     "LambdaFunction"
  //   )
  // })

//   // test('DynamoDB Table Created With Encryption', () => {
//   //   const stack = new cdk.Stack();
//   //   // WHEN
//   //   new HitCounter(stack, 'MyTestConstruct', {
//   //     downstream:  new lambda.Function(stack, 'TestFunction', {
//   //       runtime: lambda.Runtime.NODEJS_14_X,
//   //       handler: 'hello.handler',
//   //       code: lambda.Code.fromAsset('lib/lambda')
//   //     }),
//   //     readCapacity: 2
//   //   });
//   //   // THEN
//   //   const template = Template.fromStack(stack);
//   //   template.hasResourceProperties('AWS::DynamoDB::Table', {
//   //     SSESpecification: {
//   //       SSEEnabled: true
//   //     }
//   //   });
//   // });

//   test('read capacity can be configured', () => {
//     const stack = new cdk.Stack();

//     expect(() => {
//       new HitCounter(stack, 'MyTestConstruct', {
//         downstream:  new lambda.Function(stack, 'TestFunction', {
//           runtime: lambda.Runtime.NODEJS_14_X,
//           handler: 'hello.handler',
//           code: lambda.Code.fromAsset('lib/lambda')
//         }),
//         readCapacity: 0
//       });
//     }).toThrowError(/readCapacity must be greater than 5 and less than 20/);
//   });
