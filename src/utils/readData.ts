import { getBasePath } from "./getSrcPath";

export const separator = "@@##@@##";

export async function readStore() {
  const store = Bun.file(`${getBasePath()}/.db/store`);

  const storeExists = await store.exists();
  if (storeExists) {
    const encData = await store.text();
    return encData;
  } else {
    await Bun.write(
      `${getBasePath()}/.db/store`,
      "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    );
    return "";
  }
}
export async function checkPwdExist(label: string) {
  const storeData = await readStore();
  const lines = storeData.split("\n");
  const lookup = lines.map((line) => {
    return label === line.split(separator)[0];
  });
  return { exist: lookup.includes(true), index: lookup.indexOf(true) };
}
