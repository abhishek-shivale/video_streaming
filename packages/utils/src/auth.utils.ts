import CryptoJS from "crypto-js";
import jsonwebtoken from "jsonwebtoken";

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

export const generateAccessToken = (payload: any) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
  if (!accessTokenSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  return jsonwebtoken.sign(payload, accessTokenSecret, {
    expiresIn: "7d",
  });
};

export const generateRefreshToken = (payload: any) => {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
  if (!refreshTokenSecret) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }
  return jsonwebtoken.sign(payload, refreshTokenSecret, {
    expiresIn: "1y",
  });
};
