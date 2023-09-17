import inquirer from "inquirer";
import { hash } from "../utils/encryption";
import { saveCred } from "../utils/saveData";

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
      const masterKey = await hash(res.m_key);
      const vaultKey = await hash(res.v_key);

      // save hashed keys
      await saveCred(masterKey, vaultKey);
    });
}
