import { getAuthMethod } from "./utils/auth.ts";
import { router } from "./utils/router.ts";
import { getConfig } from "./utils/config.ts";
import chalk from "chalk";

const authorize = await getAuthMethod();

export const server = async () => {
  const config = await getConfig();

  const instance = Bun.serve({
    port: config.port,
    hostname: config.host,
    async fetch(req, server) {
      const authResult = await authorize(req);

      if (authResult) {
        server.upgrade(req, { data: authResult });
      } else {
        return new Response("Auth failed", { status: 500 });
      }
    },
    websocket: {
      message: (ws, message) => {
        router(instance, ws, message)
      },
      open(ws) {}, // a socket is opened
      close(ws, code, message) {
        console.log("closed");
      }, // a socket is closed
      drain(ws) {
        console.log("drain?");
      },
    }, // handlers
  });

  console.log(chalk.green(`Started on ${config.host}:${config.port}`))
};
