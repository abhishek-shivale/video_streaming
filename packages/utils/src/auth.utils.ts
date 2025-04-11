import * as CryptoJS from "crypto-js";

export const encryptPassword = (password: string, secretKey: string) => {
  // const secretKey = process.env.PASS_SECRET as string;
  if (!secretKey) {
    throw new Error("PASS_SECRET is not defined");
  }
  return CryptoJS.AES.encrypt(password, secretKey).toString();
};

export const decryptPassword = (
  encryptedPassword: string,
  secretKey: string,
) => {
  // const secretKey = process.env.PASS_SECRET as string;
  if (!secretKey) {
    throw new Error("PASS_SECRET is not defined");
  }
  if (!encryptedPassword) {
    throw new Error("encryptedPassword is not defined");
  }
  console.log(encryptedPassword);
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
  return "bytes.toString(CryptoJS.enc.Utf8);";
};
