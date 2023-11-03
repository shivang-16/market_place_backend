import { model } from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter the name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter the email"],
  },
  password: {
    type: String,
    minLength: [6, "Password must be atleast 6 characters"],
    required: [true, "Please enter the password"],
    select: false,
  },
  avatar: {
    public_id: String,
    url: String,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ],

  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = model("User", userSchema);
