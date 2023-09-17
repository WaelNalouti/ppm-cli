import { type CommandLineOptions } from "command-line-args";
import inquirer from "inquirer";
import { hash, validateKey } from "../utils/encryption";
import { checkPwdExist, savePwd } from "../utils/saveData";

export function add(options: CommandLineOptions, hMkey: string) {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter a unique password label:",
        name: "label",
        validate: async (value: string) => {
          const check = await checkPwdExist(value);
          return check.exist
            ? `A password already exists for the label '${value}'`
            : true;
        },
      },
      {
        type: "password",
        message: "Enter the password:",
        name: "pwd",
      },
      {
        type: "password",
        message: "Enter your vault key:",
        name: "vKey",
        validate: async (value: string) => {
          const isValid = await validateKey("vault", value);
          return isValid;
        },
      },
    ])
    .then(async (res) => {
      const vaultKey = await hash(`${hMkey}${res.vkey}`);
      savePwd(res.label, res.pwd, vaultKey);
    });
}
