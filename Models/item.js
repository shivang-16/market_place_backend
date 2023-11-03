import { model } from "mongoose";
import { Schema } from "mongoose";

const itemSchema = new Schema({
  item_name: {
    type: String,
    required: [true, "Please enter the title of the course"],
  },
  description: {
    overview: String,
    price: {
      type: Number,
      required: true,
    },
  },
  image: {
    public_id: String,
    url: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Item = model("Item", itemSchema);
