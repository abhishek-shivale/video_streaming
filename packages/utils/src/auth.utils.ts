import CryptoJS from "crypto-js";

export const encryptPassword = (password: string) => {
  const secretKey = process.env.PASS_SECRET as string;
  if (!secretKey) {
    throw new Error("PASS_SECRET is not defined");
  }
  return CryptoJS.AES.encrypt(password, secretKey).toString();
};

export const decryptPassword = (encryptedPassword: string) => {
  const secretKey = process.env.PASS_SECRET as string;
  if (!secretKey) {
    throw new Error("PASS_SECRET is not defined");
  }
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
