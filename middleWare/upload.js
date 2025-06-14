import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinaryConfig from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryConfig,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "JPEG", "png", "PNG"],
  },
});

const upload = multer({ storage });

export default upload;
