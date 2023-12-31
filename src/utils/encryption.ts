import { Buffer } from "node:buffer";
import { getBasePath } from "./getSrcPath";
const { scryptSync, createCipheriv, createDecipheriv } = await import(
  "node:crypto"
);

const encSalt = process.env.ENC_SALT || "DeF4uLT_3NC_S4lT";
const encAlgo = process.env.ENC_ALGORITHM || "aes-192-cbc";

export async function hash(input: string) {
  const hashed = await Bun.password.hash(input);
  return hashed;
}

/**
 * Validate credentials keys against their hash*/
export async function validateKey(kind: "master" | "vault", key: string) {
  // try to read the cred file
  const file = Bun.file(`${getBasePath()}/.db/cred`);

  const credFile = await file.text();

  const credHaveContent = credFile.replaceAll(" ", "").length > 0;

  if (credHaveContent) {
    const keys = credFile.split("\n");
    if (kind === "master") {
      // verify master key
      const mkey = keys[0];
      const isValid = await Bun.password.verify(key, mkey);
      return isValid;
    } else if (kind === "vault") {
      // verify vault key
      const vkey = keys[1];
      const isValid = await Bun.password.verify(key, vkey);
      return isValid;
    }
    return false;
  } else {
    console.error("Error: Empty credentials data!");
    return false;
  }
}

export async function encrypt(input: string) {
  try {
    // generate a rand init vect
    const iv = Buffer.alloc(16, 0);
    const credfile = Bun.file(`${getBasePath()}/.db/cred`);
    const credH = await credfile.text();
    const key = scryptSync(credH, encSalt, 24);
    // create the cipher using the key and the init vect
    const cipher = createCipheriv(encAlgo, key, iv);
    let encInput = cipher.update(input, "utf-8", "hex");
    encInput += cipher.final("hex");
    return encInput;
  } catch (error) {
    console.error("Error: Unable to encrypt data!");
    console.error(error);
  }
}

export async function decrypt(input: string) {
  try {
    // generate a rand init vect
    const iv = Buffer.alloc(16, 0);
    const credfile = Bun.file(`${getBasePath()}/.db/cred`);
    const credH = await credfile.text();
    const key = scryptSync(credH, encSalt, 24);
    // create the decipher using the key and the init vect
    const decipher = createDecipheriv(encAlgo, key, iv);
    let decInput = decipher.update(input, "hex", "utf-8");
    decInput += decipher.final("utf-8");
    return decInput;
  } catch (error) {
    console.error("Error: Unable to decrypte data!");
    console.error(error);
  }
}
