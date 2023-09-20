import { type CommandLineOptions } from "command-line-args";
import inquirer from "inquirer";
import { validateKey } from "../utils/encryption";
import { savePwd } from "../utils/saveData";
import { checkPwdExist } from "../utils/readData";

export function add(options: CommandLineOptions) {
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
      savePwd(res.label, res.pwd);
    });
}
