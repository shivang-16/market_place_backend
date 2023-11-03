import express from "express";
import {
  createItem,
  payment,
  getAllItem,
  editItem,
  deleteItem,
  addToCart,
  paymentVerification,
} from "../Controllers/itemController.js";
import { isAuthenticated } from "../Middleware/auth.js";
import singleUpload from "../Middleware/multer.js";

const router = express.Router();

router.post("/create", isAuthenticated, singleUpload, createItem);
router.get("/all", getAllItem);
router
  .route("/:id")
  .get(isAuthenticated, addToCart)
  .patch(isAuthenticated, editItem)
  .delete(isAuthenticated, deleteItem);
router.get("/payment/:id", isAuthenticated, payment);
router.post("/paymentVerification", paymentVerification);

export default router;
