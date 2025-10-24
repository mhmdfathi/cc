import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// يخلي السيرفر يشوف ملفات الواجهة (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// 🧩 قاعدة البيانات
const db = await open({
  filename: './users.db',
  driver: sqlite3.Database
});

await db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    password TEXT,
    role TEXT,
    phone TEXT
  )
`);

let codes = {}; // لتخزين أكواد التحقق المؤقتة

// إرسال كود التحقق
app.post("/send-code", async (req, res) => {
  const { email } = req.body;

  const existing = await db.get("SELECT * FROM users WHERE email = ?", email);
  if (existing) {
    return res.json({ success: false, message: "هذا البريد مسجل بالفعل" });
  }

  const randomCode = Math.floor(10000 + Math.random() * 90000);
  codes[email] = randomCode;

 const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


  const mailOptions = {
    from: "fathy.01095739893@gmail.com",
    to: email,
    subject: "كود التحقق الخاص بك",
    text: `كود التحقق الخاص بك هو: ${randomCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.json({ success: false, message: "حدث خطأ أثناء إرسال البريد" });
  }
});

// التحقق من الكود
app.post("/verify-code", (req, res) => {
  const { email, code } = req.body;
  if (codes[email] && codes[email].toString() === code) {
    delete codes[email];
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

// تسجيل المستخدم
app.post("/register", async (req, res) => {
  const { email, name, password, role, phone } = req.body;

  try {
    const existing = await db.get("SELECT * FROM users WHERE email = ?", email);
    if (existing) {
      return res.json({ success: false, message: "هذا البريد مسجل بالفعل" });
    }

    await db.run(
      "INSERT INTO users (email, name, password, role, phone) VALUES (?,?,?,?,?)",
      email, name, password, role, phone
    );

    res.json({ success: true, message: `تم إنشاء الحساب بنجاح، مرحباً ${name}!` });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "حدث خطأ أثناء التسجيل" });
  }
});

// تسجيل الدخول
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "من فضلك أكمل كل الحقول" });
  }

  try {
    const user = await db.get("SELECT * FROM users WHERE email = ? AND password = ?", email, password);
    if (user) {
      res.json({ success: true, message: `مرحبا ${user.name}!`, user });
    } else {
      res.json({ success: false, message: "البريد أو كلمة المرور غير صحيحة" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "حدث خطأ أثناء تسجيل الدخول" });
  }
});

// ✅ دي أهم جزء — عرض الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

app.get("/test-email", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "fathy.01095739893@gmail.com",
      subject: "اختبار إرسال من Railway",
      text: "الرسالة دي اختبار من السيرفر",
    });

    res.send("✅ تم إرسال الإيميل بنجاح!");
  } catch (err) {
    console.error("Test email error:", err);
    res.send("❌ فشل في الإرسال: " + err.message);
  }
});
