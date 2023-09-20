import commandLineArgs, { OptionDefinition } from "command-line-args";
import { init } from "../commands/init";
import { list } from "../commands/list";
import { add } from "../commands/add";
import { remove } from "../commands/remove";
import { generate } from "../commands/generate";
import { setup } from "./setup";
import inquirer from "inquirer";
import { hash, validateKey } from "./encryption";

const optionsDef: OptionDefinition[] = [
  { name: "init", alias: "i", type: String },
  { name: "list", alias: "l", type: String },
  { name: "add", alias: "a", type: String },
  { name: "remove", alias: "r", type: String },
  { name: "generate", alias: "g", type: String },
  { name: "hide", alias: "h", type: Boolean },
  { name: "copy", alias: "c", type: Boolean },
];

const cmds = {
  init,
  list,
  add,
  remove,
  generate,
};

export async function cli() {
  try {
    const options = commandLineArgs(optionsDef);

    const ok = await setup();

    const cliCmd = Object.keys(options) as (keyof typeof cmds)[];
    if (cliCmd[0] === "init") {
      if (ok) {
        console.log("Credentials exists! No need to run init again");
      } else {
        init();
      }
    } else if (ok) {
      inquirer
        .prompt([
          {
            type: "password",
            message: "Enter your master key: ",
            name: "mKey",
            validate: async (value: string) => {
              const isValid = await validateKey("master", value);
              return !isValid ? "Wrong master key!" : true;
            },
          },
        ])
        .then(async (res) => {
          // FIXME: if we remove the hashing from here the following functions don't get called
          await hash(res.mKey);
          cmds[cliCmd[0]](options);
        });
    } else {
      console.log("Missing credentials! Try runnig --init (-i) first!");
    }
  } catch (err: any) {
    console.error(err.message);
  }
}
