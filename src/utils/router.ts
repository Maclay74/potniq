import { sep as DirectorySeparator, join } from "node:path";
import { Path } from "path-parser";
import type { ServerWebSocket } from "bun";
import { readdir } from "node:fs/promises";
import * as url from "node:url";

type TestResponse = false | { handler: string; params: object };

interface UserMessage {
  path: string;
  action: "subscribe" | "unsubscribe" | "message";
  data: object;
}

interface TopicModule {
  onMessage: (client: object, data: object, params: object) => void;
  onSubscribe: (client: object, data: object, params: object) => void;
  onUnsubscribe: (client: object, data: object, params: object) => void;
}

const topics = new Bun.Glob("**/topic.ts");

const routes = new Map<Path, string>();

const templates: Record<string, string> = {
  "\\[(.*?)\\]": ":$1", // [param] => :param
};

export const router = async (
  ws: ServerWebSocket,
  message: string | Buffer,
): Promise<void> => {
  // Non-authorized can't send messages
  if (!ws.data) return;

  // Format the response, find handler
  const { path, data, action } = JSON.parse(message as string) as UserMessage;
  const handler = getHandlerForPath(path);
  if (handler === false) {
    ws.sendText("Route not found");
    return;
  }

  // Import handler and call desired method
  const module = (await import(handler.handler)) as TopicModule;

  switch (action) {
    case "subscribe":
      module.onSubscribe(ws.data, data, handler.params);
      break;
    case "unsubscribe":
      module.onUnsubscribe(ws.data, data, handler.params);
      break;
    case "message":
      module.onMessage(ws.data, data, handler.params);
      break;
  }
};

const getHandlerForPath = (pathToTest: string): TestResponse => {
  for (const [url, handler] of routes.entries()) {
    const params = url.test(pathToTest);
    if (params) {
      return {
        handler,
        params,
      };
    }
  }

  return false;
};

const pathToPattern = (folders: string) => {
  const tokens = folders
    .split(DirectorySeparator)
    .filter(Boolean)
    .map((token) => {
      for (const [regex, replacement] of Object.entries(templates)) {
        token = token.replace(new RegExp(regex, "g"), replacement);
      }
      return token;
    });

  return new Path(tokens.join("/"));
};

try {
  for await (const topicPath of topics.scan("./app")) {
    const topicFolder = topicPath.replace(/\/topic.ts$/, "");
    const urlPath = pathToPattern(topicFolder);

    routes.set(urlPath, join(process.cwd(), DirectorySeparator, "app", DirectorySeparator, topicPath));
  }
} catch (e) {
  console.warn("\x1b[33m%s\x1b[0m", "⚠️ Can't parse application's routes");
}

