import jwt from "jsonwebtoken";

export const generateAccessToken = (
  payload: any,
  accessTokenSecret: string,
) => {
  // const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
  if (!accessTokenSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: "7d",
  });
};

export const generateRefreshToken = (
  payload: any,
  refreshTokenSecret: string,
) => {
  // const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
  if (!refreshTokenSecret) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }
  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: "1y",
  });
};

export const decodeAccessToken = (token: string) => {
  // const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
  if (!token) {
    throw new Error("token is not defined");
  }
  return jwt.decode(token);
};
