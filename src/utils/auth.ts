import { sep as DirectorySeparator } from "node:path";
import { access } from "node:fs/promises";

type AuthModule = {
  authorize: (req: Request) => Promise<boolean | object>;
};

const defaultAuthMethod: AuthModule["authorize"] = () => Promise.resolve(true);

export const getAuthMethod = async () => {
  const path = process.cwd() + DirectorySeparator + "auth.ts";

  try {
    await access(path);
    const { authorize = null } = (await import(path)) as AuthModule;

    if (authorize === null) {
      return defaultAuthMethod;
    }
    return authorize;
  } catch (e) {
    console.warn("Couldn't load auth!")
    return defaultAuthMethod;
  }
};
