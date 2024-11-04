import { sep as DirectorySeparator } from "node:path";
import { access } from "node:fs/promises";
import chalk from "chalk";

type BasePotniqConfig = {
  port: number;
  host: `${number}.${number}.${number}.${number}`;
};

export type PotniqConfig = Partial<BasePotniqConfig>;

const defaultConfig: BasePotniqConfig = {
  port: 3000,
  host: "0.0.0.0",
};

export const getConfig = async () => {
  const path = process.cwd() + DirectorySeparator + "potniq.config.ts";

  try {
    await access(path);
    const configModule = (await import(path)).default as PotniqConfig;

    if (!configModule) {
      return defaultConfig;
    }
    return { ...defaultConfig, ...configModule };
  } catch (e) {
    console.log(
      chalk.yellow("⚠️ Couldn't load ") +
        chalk.underline.bold.yellow("potniq.config.ts"),
    );
    return defaultConfig;
  }
};
