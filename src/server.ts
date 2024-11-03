import { getAuthMethod } from "./utils/auth.ts";
import { router } from "./utils/router.ts";

const authorize = await getAuthMethod();

export const server = () => {

  Bun.serve({
    async fetch(req, server) {
      const authResult = await authorize(req);

      if (authResult) {
        server.upgrade(req, { data: authResult });
      } else {
        return new Response("Auth failed", { status: 500 });
      }
    },
    websocket: {
      message: router,

      open(ws) {}, // a socket is opened
      close(ws, code, message) {
        console.log("closed");
      }, // a socket is closed
      drain(ws) {
        console.log("drain?");
      },
    }, // handlers
  });
};
