import mongoose from "mongoose";

const schema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  name: { type: String, required: true, trim: true },
  gender: { type: String, enum: ["male", "female"] },
  height: { type: Number },
  weight: { type: Number },
  chest: Number,
  waist: Number,
  hips: Number,
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User ?? mongoose.model("User", schema);
