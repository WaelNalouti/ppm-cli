import { mkdirSync } from "node:fs";
import { encrypt } from "./encryption";
import { getBasePath } from "./getSrcPath";
import { readStore, separator } from "./readData";

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

export async function savePwd(label: string, pwd: string) {
  try {
    const encData = await encrypt(pwd);
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
