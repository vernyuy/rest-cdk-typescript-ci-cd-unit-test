import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";

const region = process.env.Region;
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME as string;

export const lambdaHandler = async (): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;
  try {
    const res = await docClient.scan({ TableName: tableName }).promise();
    response = {
      statusCode: 200,
      body: JSON.stringify(res.Items),
    };
  } catch (err: unknown) {
    console.log(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: err instanceof Error ? err.message : "some error happened",
      }),
    };
  }
  return response;
};
