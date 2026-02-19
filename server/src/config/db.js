import mongoose from 'mongoose';

export const connectDb = async (mongoUri) => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || 'cetro_cms',
  });
};
