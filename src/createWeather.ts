// 'use strict';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME as string;
// const region = process.env.Region;

export const lambdaHandler = async (
  event: any
): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;
  const id = Math.floor(Math.random() * 1000).toString();
  const body = JSON.parse(event.body);
  const weatherItem = {
    id: id,
    weather: body.weather as string,
    town: body.town as string,
  };
  try {
    const test = await docClient
      .put({
        TableName: tableName,
        ReturnConsumedCapacity: "TOTAL",
        Item: weatherItem,
      })
      .promise();
      console.log(test);
      response = {
        statusCode: 200,
        body: JSON.stringify({
          message: "Weather item created Successfully",
        }),
      };
  } catch (err: unknown) {
    console.log(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message:
          err instanceof Error
            ? err.message
            : "An error occured while creating weather.",
      }),
    };
  }
  return response;
};
