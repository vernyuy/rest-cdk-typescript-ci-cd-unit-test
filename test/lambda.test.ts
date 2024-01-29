import { lambdaHandler as createWeather } from "../src/createWeather";
import { lambdaHandler as getWeather } from "../src/getWeather";
import {lambdaHandler as deleteWeather} from "../src/deleteWeather";
import { lambdaHandler as updateWeather } from "../src/updateWeather";
import {lambdaHandler as listWeathers} from "../src/listWeathers";

test("create weather", async () => {
    const result = await createWeather({
      body: JSON.stringify({
        weather: "hot",
        town: "Douala"
      }),
    });
    expect(result);
  });

  test("get weather", async () => {
    const result = await getWeather({
      body: JSON.stringify({
        weather: "hot",
        town: "Douala"
      }),
      pathParameters: {
        id: 1
      }
    });
    expect(result);
  });


  test("delete weather", async () => {
    const result = await deleteWeather({
      body: JSON.stringify({
        weather: "hot",
        town: "Douala"
      }),
      pathParameters: {
        id: 1
      }
    });
    expect(result);
  });


  test("update weather", async () => {
    const result = await updateWeather({
      body: JSON.stringify({
        weather: "hot",
        town: "Douala"
      }),
      pathParameters: {
        id: 1
      }
    });
    expect(result);
  });

  
  test("list weathers", async () => {
    const result = await listWeathers({
      body: JSON.stringify({
        weather: "hot",
        town: "Douala"
      })
    });
    expect(result);
  });