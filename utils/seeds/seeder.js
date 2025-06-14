import fs from 'fs';
import colors from 'colors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../../models/user.model.js';
import databaseConnection from '../../config/DBconction.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تحميل ملف البيئة
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// الاتصال بقاعدة البيانات
dbConnection();

// قراءة البيانات من JSON
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf-8'));

// إدخال البيانات
const insertData = async () => {
  try {
    await Product.create(products);
    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// حذف البيانات
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// تشغيل السكريبت بناءً على الوسيط
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}
