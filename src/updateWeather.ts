import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";

const tableName = process.env.TABLE_NAME as string;
const region = process.env.Region;
const client = new AWS.DynamoDB.DocumentClient();

export const lambdaHandler = async (
  event: any
): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;
  const weather_id = event.pathParameters.id;
  const body = JSON.parse(event.body);
  const weather = body.weather;
  const town = body.town as string;
  const params = {
    Key: {
      id: weather_id as string,
    },
    UpdateExpression: "set weather = :weather, town = :town",
    ExpressionAttributeValues: {
      ":weather": {
        S: weather as string,
      },
      ":town": {
        S: town as string,
      },
    },
    returnValues: "UPDATED_NEW",
    TableName: tableName,
  };
  try {
    const res = await client.update(params).promise();
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "Weather Successfully updated",
      }),
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
