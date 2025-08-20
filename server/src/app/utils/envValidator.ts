type EnvValue = string | EnvRecord;
export interface EnvRecord {
  [key: string]: EnvValue;
}

export const envValidator = <T extends Record<string, string | EnvRecord>>(
  obj: T,
  options?: { parentKey?: string }
): void => {
  const keys = Object.keys(obj) as (keyof T)[];
  keys.forEach((key) => {
    const value = obj[key];

    const isObject = typeof value === "object" && value !== null;

    if (isObject) {
      envValidator(value, {
        parentKey: `${options?.parentKey || ""}${String(key)}.`,
      });
    } else if (!process.env[String(key)]) {
      throw new Error(
        `❌ ${
          options?.parentKey ? options.parentKey + String(key) : String(key)
        } is not defined in environment variables`
      );
    }
  });
};
