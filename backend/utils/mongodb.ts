import mongoose from "mongoose";

export async function connectDB() {
  try {
    mongoose.connection.on("connected", () =>
      console.log("MongoDB Connected!")
    );
    await mongoose.connect(`${process.env.MONGODB_URL}/udemy-clone`);
  } catch (error: any) {
    console.error(error);
  }
}
