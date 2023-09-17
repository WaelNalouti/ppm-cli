import commandLineArgs, { OptionDefinition } from "command-line-args";
import { init } from "../commands/init";
import { list } from "../commands/list";
import { add } from "../commands/add";
import { remove } from "../commands/remove";
import { generate } from "../commands/generate";
import { setup } from "./setup";

const optionsDef: OptionDefinition[] = [
  { name: "init", alias: "i", type: String },
  { name: "list", alias: "l", type: String },
  { name: "add", alias: "a", type: String },
  { name: "remove", alias: "r", type: String },
  { name: "generate", alias: "g", type: String },
  { name: "hide", alias: "h", type: Boolean },
  { name: "copy", alias: "c", type: Boolean },
];

export async function cli() {
  try {
    const options = commandLineArgs(optionsDef);

    const ok = await setup();

    if (Object.keys(options).includes("init")) {
      if (ok) {
        console.log("Credentials exists! No need to run init again");
      } else {
        init();
      }
    } else if (ok) {
      if (options.list || Object.keys(options).includes("list")) {
        list(options);
      } else if (options.add) {
        add();
      } else if (options.remove) {
        remove();
      } else if (options.generate) {
        generate();
      }
    } else {
      console.log("Missing credentials! Try runnig --init (-i) first!");
    }
  } catch (err: any) {
    console.error(err.message);
  }
}
