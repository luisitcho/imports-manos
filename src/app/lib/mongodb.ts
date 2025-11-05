// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI não configurado no .env.local");
}

declare global {
  // Para evitar múltiplas conexões em dev (HMR)
  // eslint-disable-next-line no-var
  var mongooseConn: Promise<typeof mongoose> | undefined;
}

export default async function dbConnect() {
  if (!global.mongooseConn) {
    global.mongooseConn = mongoose.connect(MONGODB_URI);
  }
  return global.mongooseConn;
}
