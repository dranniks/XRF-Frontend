import { resolve } from "node:path";
import { generateApi } from "swagger-typescript-api";

await generateApi({
  url: "http://localhost:8080/swagger/openapi.json",
  output: resolve(process.cwd(), "src/api/generated"),
  name: "XrfApi.ts",
  httpClientType: "axios",
  generateClient: true,
  generateRouteTypes: true,
  generateResponses: true
});
