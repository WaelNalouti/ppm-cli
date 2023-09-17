import type { CommandLineOptions } from "command-line-args";

export function init(options: CommandLineOptions) {
  console.log("init");
  console.log(options);
}
