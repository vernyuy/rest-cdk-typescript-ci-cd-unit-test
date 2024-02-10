import * as RestCdkTypescript from "../lib/rest_cdk_typescript-stack";
import * as cdk from "aws-cdk-lib";
import { Template, Capture } from "aws-cdk-lib/assertions";
import * as LambdaStack from "../lib/lambda-stack";

/***********************************
 * Test for dynamodb table resource
 ************************************/
test("DynamoDB Table Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LambdaStack.LambdaStack(app, "MyTestStack", {
    stageName: "Dev",
  });
  // THEN
  const template = Template.fromStack(stack);
  // template.resourceCountIs("AWS::DynamoDB::Table", 1);
  template.hasResource("AWS::DynamoDB::Table", {
    Properties: {
      TableName: "DevweatherApiTable",
    },
  });
});

/***********************************
 * Test for Api Gateway resource
 ************************************/
test("ApiGatway RestApi Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LambdaStack.LambdaStack(app, "MyTestStack", {
    stageName: "Dev",
  });
  // THEN
  const template = Template.fromStack(stack);
  template.hasResource("AWS::ApiGateway::RestApi", {
    Properties: {
      Name: "Dev Weather Rest Api",
    },
  });
});

/************************************************
 * Test if the stack contains 5 lambda functions
 *************************************************/
test("5 Lambda Functions Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LambdaStack.LambdaStack(app, "MyTestStack", {
    stageName: "Dev",
  });
  // THEN
  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::Lambda::Function", 5);
});


/**********************************************************
 * Test if lambda functions contains environment variablle
 **********************************************************/
test("Lambda Has Environment Variables", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LambdaStack.LambdaStack(app, "MyTestStack", {
    stageName: "Dev",
  });
  // THEN
  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });

  expect(envCapture.asObject()).toEqual({
    Variables: {
      TABLE_NAME: {
        Ref: "DevCdkTypescriptWeatherTableA8D40B83",
      },
      STAGE_NAME: "Dev",
    },
  });
});


/************************************************
 * Test if create lambda function exists with the 
 * required function name and environment variables
 *************************************************/
test("Create Lambda Function typescript Exist", () => {
  const app = new cdk.App();
  const stack = new LambdaStack.LambdaStack(app, "MyTestStack", {
    stageName: "Dev",
  });
  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResource("AWS::Lambda::Function", {
    Properties: {
      FunctionName: "Dev-cdk-typescript-create",
    },
  });
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });

  expect(envCapture.asObject()).toEqual({
    Variables: {
      TABLE_NAME: {
        Ref: "DevCdkTypescriptWeatherTableA8D40B83",
      },
      STAGE_NAME: "Dev",
    },
  });
});



/************************************************
 * Test if delete lambda function exists with the 
 * required function name and environment variables
 *************************************************/
test("Delete Lambda Function typescript Exist", () => {
  const app = new cdk.App();
  const stack = new LambdaStack.LambdaStack(app, "MyTestStack", {
    stageName: "Dev",
  });
  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResource("AWS::Lambda::Function", {
    Properties: {
      FunctionName: "Dev-cdk-typescript-delete",
    },
  });
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });

  expect(envCapture.asObject()).toEqual({
    Variables: {
      TABLE_NAME: {
        Ref: "DevCdkTypescriptWeatherTableA8D40B83",
      },
      STAGE_NAME: "Dev",
    },
  });
});

/************************************************
 * Test if list lambda function exists with the 
 * required function name and environment variables
 *************************************************/
test("List Lambda Function typescript Exist", () => {
  const app = new cdk.App();
  const stack = new LambdaStack.LambdaStack(app, "MyTestStack", {
    stageName: "Dev",
  });
  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResource("AWS::Lambda::Function", {
    Properties: {
      FunctionName: "Dev-cdk-typescript-list",
    },
  });
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });

  expect(envCapture.asObject()).toEqual({
    Variables: {
      TABLE_NAME: {
        Ref: "DevCdkTypescriptWeatherTableA8D40B83",
      },
      STAGE_NAME: "Dev",
    },
  });
});

/************************************************
 * Test if Get lambda function exists with the 
 * required function name and environment variables
 *************************************************/
test("Get Lambda Function typescript Exist", () => {
  const app = new cdk.App();
  const stack = new LambdaStack.LambdaStack(app, "MyTestStack", {
    stageName: "Dev",
  });
  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResource("AWS::Lambda::Function", {
    Properties: {
      FunctionName: "Dev-cdk-typescript-get",
    },
  });
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });

  expect(envCapture.asObject()).toEqual({
    Variables: {
      TABLE_NAME: {
        Ref: "DevCdkTypescriptWeatherTableA8D40B83",
      },
      STAGE_NAME: "Dev",
    },
  });
});

/************************************************
 * Test if update lambda function exists with the 
 * required function name and environment variables
 *************************************************/
test("Update Lambda Function typescript Exist", () => {
  const app = new cdk.App();
  const stack = new LambdaStack.LambdaStack(app, "MyTestStack", {
    stageName: "Dev",
  });
  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResource("AWS::Lambda::Function", {
    Properties: {
      FunctionName: "Dev-cdk-typescript-update",
    },
  });
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });

  expect(envCapture.asObject()).toEqual({
    Variables: {
      TABLE_NAME: {
        Ref: "DevCdkTypescriptWeatherTableA8D40B83",
      },
      STAGE_NAME: "Dev",
    },
  });
});