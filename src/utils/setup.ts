import { getBasePath } from "./getSrcPath";
import { welcome } from "./welcome";

/**
 * check if `.db/.acc` exists
 * if missing, automatically create .db/.acc and exists the program
 * if existing and empty, exit the program*/
export async function setup() {
  const acc = Bun.file(getBasePath() + "/.db/cred");

  const accExists = await acc.exists();
  if (!accExists) {
    welcome();
    return false;
  }
  return true;
}
