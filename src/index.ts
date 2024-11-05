
import { server } from "./server.ts";

const args = process.argv.slice(2);

if (args[0] === "start") {
  await server();
}


export type { PotniqConfig } from "./utils/config.ts";
