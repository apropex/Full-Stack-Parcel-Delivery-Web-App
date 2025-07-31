import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "./cloudinary.config";
import { sanitizeFilename } from "../../app/utils/sanitizeFilename";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    public_id: (req, file) => sanitizeFilename(file.originalname),
  },
});

export const uploadImage = multer({ storage });
