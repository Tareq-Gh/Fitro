import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  shoulder: Number,
  chest: Number,
  waist: Number,
  shoeSize: Number,
  skinTone: String,
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User ?? mongoose.model("User", schema);
