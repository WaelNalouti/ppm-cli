import inquirer from "inquirer";
import { mkdir } from "node:fs";

export function init() {
  inquirer
    .prompt([
      {
        type: "password",
        message:
          "Enter a master key (This key will be used to grant access to your vault):",
        name: "m_key",
        validate: (value: string) =>
          value.length > 7 ? true : "Keys must be at least 8 characters",
      },
      {
        type: "password",
        message:
          "Enter a vault key (This password will be used to encrypt/decrypt your vault):",
        name: "v_key",
        validate: (value: string) =>
          value.length > 7 ? true : "Keys must be at least 8 characters",
      },
    ])
    .then(async (res) => {
      // Hash keys
      const masterKey = await Bun.password.hash(res.m_key);
      const vaultKey = await Bun.password.hash(`${masterKey}${res.v_key}`);

      // save hashed keys
      mkdir(`${import.meta.dir}/../.db/`, null, async (err) => {
        if (err) {
          console.error("Error: Unable to save credentials!");
          console.error(err);
        } else {
          const data = `${masterKey}\n${vaultKey}`;
          await Bun.write(`${import.meta.dir}/../.db/cred`, data);
          console.log("Saved credentials successfully!");
        }
      });
    });
}
