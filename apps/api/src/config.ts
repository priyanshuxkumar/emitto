import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL,
  jwtSecret: process.env.JWT_SECRET || "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
}

export const corsOptions = {
  origin: config.frontendUrl,
  method: ['GET','POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

const cookieOptions = {
  httpOnly : true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24,
  sameSite: 'strict' as 'strict',
  path: '/'
}

export { cookieOptions, config };
