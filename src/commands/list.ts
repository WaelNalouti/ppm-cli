import { type CommandLineOptions } from "command-line-args";
import { checkPwdExist, readStore, separator } from "../utils/readData";
import { decrypt, hash, validateKey } from "../utils/encryption";
import inquirer from "inquirer";
import { welcome } from "../utils/welcome";

const usage = `

    ppm list <label> [options...]

`;

export async function list(options: CommandLineOptions) {
  const label: string = options.list;
  if (label === null) {
    const allLabels = await listLabels();
    welcome();
    console.log(allLabels);
    return;
  }
  const labelExist = await checkPwdExist(label);
  if (!labelExist.exist) {
    console.error(`Label ${label} not found!`);
    return;
  }

  inquirer
    .prompt([
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
    .then(async () => {
      const data = await getPwd(label);
      if (data) {
        console.log(data.pwd);
      }
    });
}

async function getPwd(label: string) {
  const encStoreData = await readStore();

  const lines = encStoreData.split("\n");

  let pwdData: { label: string; pwd: string; createdAt: string } | null = null;
  let rawPwdData: string[] | null = null;
  for (let i = 0; i < lines.length; i++) {
    const indexData = lines[i].split(separator);
    if (indexData[0] === label) {
      rawPwdData = indexData;
      break;
    }
  }
  if (rawPwdData) {
    const decPwd = await decrypt(rawPwdData[1]);
    if (!decPwd) {
      console.error("Cannot decrypt data");
      return;
    }
    pwdData = {
      pwd: decPwd,
      label: rawPwdData[0],
      createdAt: rawPwdData[2],
    };
  }
  return pwdData;
}

async function listLabels(): Promise<string> {
  const encStoreData = await readStore();

  const lines = encStoreData.split("\n");

  if (!lines.length) {
    return "No passwords stored yet!";
  }

  const listSeparator = "\n-------------------------------------------------\n";

  const labelsList: string[] = [];

  for (let i = 0; i < lines.length - 1; i++) {
    const currLine = lines[i].split(separator);
    labelsList.push(
      `\tlabel: ${currLine[0]}\n\tcreated_at: ${new Date(
        Number(currLine[2])
      ).toLocaleString()}`
    );
  }
  return listSeparator + labelsList.join(listSeparator) + listSeparator;
}
