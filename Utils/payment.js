import { instance } from "../server.js";

export const checkout = async (price) => {
  const options = {
    amount: Number(price * 100),
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  return order;
};
