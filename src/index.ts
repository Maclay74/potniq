import chalk from "chalk";
import { server } from "./server.ts";

const args = process.argv.slice(2);

if (args[0] === "start") {
  server();
  console.log(chalk.green("Started!"));
}

export type { PotniqConfig } from "./utils/getConfig.ts";
