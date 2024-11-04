import chalk from "chalk";
import { server } from "./server.ts";
import { getConfig } from "./utils/config.ts";

const args = process.argv.slice(2);

if (args[0] === "start") {
  server();

  console.log(chalk.green("Started!"));

  await getConfig();
}


export type { PotniqConfig } from "./utils/config.ts";
