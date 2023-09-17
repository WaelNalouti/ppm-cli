import { type CommandLineOptions } from "command-line-args";

export function list(options: CommandLineOptions) {
  if (options.list === null) {
    // list all pwds
  }
  // list specific pwd
  console.log("list", options);
}
