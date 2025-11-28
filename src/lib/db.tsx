import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable in .env.local");
}

// After this check, TypeScript knows MONGO_URI is defined
const MONGO_URI_STR: string = MONGO_URI;

// Global is used to maintain a cached connection across hot reloads in development
let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } =
  (global as any).mongoose || { conn: null, promise: null };

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI_STR)
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        cached.promise = null; // reset on error
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
