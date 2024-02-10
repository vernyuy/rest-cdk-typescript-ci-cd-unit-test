import { lambdaHandler as createWeather } from "../src/createWeather";
import { lambdaHandler as getWeather } from "../src/getWeather";
import { lambdaHandler as deleteWeather } from "../src/deleteWeather";
import { lambdaHandler as updateWeather } from "../src/updateWeather";
import { lambdaHandler as listWeathers } from "../src/listWeathers";

test("create weather", async () => {
  const result = await createWeather({
    body: JSON.stringify({
      weather: "hot",
      town: "Douala",
    }),
  });
  expect(result).toMatchObject({
    body: expect.any(String),
    statusCode: expect.any(Number),
  });
});

test("get weather", async () => {
  const result = await getWeather({
    pathParameters: {
      id: 1,
    },
  });
  expect(result).toMatchObject({
    body: expect.any(String),
    statusCode: expect.any(Number),
  });
});

test("delete weather", async () => {
  const result = await deleteWeather({
    pathParameters: {
      id: 1,
    },
  });
  expect(result).toMatchObject({
    body: expect.any(String),
    statusCode: expect.any(Number),
  });
});

test("update weather", async () => {
  const result = await updateWeather({
    body: JSON.stringify({
      weather: "hot",
      town: "Douala",
    }),
    pathParameters: {
      id: 1,
    },
  });
  expect(result).toMatchObject({
    body: expect.any(String),
    statusCode: expect.any(Number),
  });
});

test("list weathers", async () => {
  const result = await listWeathers();
  expect(result).toMatchObject({
    body: expect.any(String),
    statusCode: expect.any(Number),
  });
});
