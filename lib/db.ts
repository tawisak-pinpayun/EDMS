import mongoose, { Mongoose } from 'mongoose';

/**
 * โครงสร้างสำหรับเก็บ connection ของ Mongoose
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * ดึง cache จาก globalThis ถ้ายังไม่มีจะสร้างใหม่
 * ใช้เพื่อไม่ให้ Next.js hot reload สร้าง connection ซ้ำ
 * @returns อ็อบเจ็กต์ cache
 */
function getCache(): MongooseCache {
  const casted = globalThis as unknown as { mongooseCache?: MongooseCache };
  if (!casted.mongooseCache) {
    casted.mongooseCache = { conn: null, promise: null };
  }
  return casted.mongooseCache;
}

const cached = getCache();

/**
 * ฟังก์ชั่นเชื่อมต่อ MongoDB ด้วย Mongoose
 * @returns อินสแตนซ์ของ Mongoose
 */
async function dbConnect(): Promise<Mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('กรุณากำหนดค่า MONGODB_URI ในไฟล์ .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance: Mongoose) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
