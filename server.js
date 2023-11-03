import { app } from "./app.js";
import { server } from "./app.js";
import connectToMongo from "./Data/data.js";
import cloudinary from "cloudinary";
import Razorpay from "razorpay";

const port = process.env.PORT;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

connectToMongo();

server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
