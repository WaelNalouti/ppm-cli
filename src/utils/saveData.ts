import { mkdirSync } from "node:fs";
import { encrypt } from "./encryption";
import { getBasePath } from "./getSrcPath";

const separator = "@@##@@##";

export async function saveCred(mKey: string, vKey: string) {
  try {
    mkdirSync(`${getBasePath()}/.db/`);
    const creds = `${mKey}\n${vKey}`;
    await Bun.write(`${getBasePath()}/.db/cred`, creds);
    console.log("Saved credentials successfully!");
  } catch (err) {
    console.error("Error: Unable to save credentials!");
    console.error(err);
  }
}

export async function savePwd(label: string, pwd: string, vKey: string) {
  try {
    const encData = await encrypt(pwd, vKey);
    const newEntry = `${label}${separator}${encData}${separator}${new Date().getTime()}`;
    if (encData) {
      const storeData = await readStore();
      await Bun.write(
        `${getBasePath()}/.db/store`,
        `${newEntry}\n${storeData}`
      );
      console.log(`Saved password for '${label}'`);
    } else {
      throw new Error("Data not encrypted... aborting now");
    }
  } catch (err) {
    console.error("Error: Unable to save credentials!");
    console.error(err);
  }
}

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
