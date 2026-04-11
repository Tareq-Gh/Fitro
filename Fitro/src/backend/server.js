const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// الاتصال بقاعدة البيانات (تأكد من وضع رابط الـ Mongo الخاص بك)
mongoose.connect('mongodb://localhost:27017/fitro_db')
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...", err));

// تعريف "موديل" القياسات
const userSchema = new mongoose.Schema({
  name: String,
  height: Number,
  weight: Number,
  shoulder: Number,
  chest: Number,
  waist: Number,
  shoeSize: Number,
  skinTone: String,
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// --- Endpoints ---

// 1. حفظ قياسات المستخدم
app.post('/api/user/info', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "Data saved successfully!", user });
  } catch (error) {
    res.status(400).send(error);
  }
});

// 2. جلب القياسات للأدمن
app.get('/api/admin/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

// داخل server.js
app.post('/api/users/add', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "تم حفظ المقاسات بنجاح!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});