import { sep as DirectorySeparator } from "node:path";
import { access } from "node:fs/promises";
import chalk from 'chalk';

export type PotniqConfig = {
  port: number;
};

const defaultConfig: PotniqConfig = {
  port: 3000,
};

type ConfigModule = { default: PotniqConfig };

export const getConfig = async () => {
  const path = process.cwd() + DirectorySeparator + "potniq.config.ts";

  try {
    await access(path);
    const configModule = (await import(path)).default as PotniqConfig;

    if (!configModule) {
      return defaultConfig;
    }
    return configModule;
  } catch (e) {
    console.log(chalk.yellow("⚠️ Couldn't load ") + chalk.underline.bold.yellow("potniq.config.ts"));
    return defaultConfig;
  }

};
