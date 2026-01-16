import multer from "multer";
import path from "path";
import BaseError from "../common/base_classes/base-error.js";

const mimeTypes = /jpeg|jpg|png/;

const fileFilter = (req, file, cb) => {
  const mimeType = file.mimetype;
  if (mimeTypes.test(mimeType)) {
    cb(null, true);
  } else {
    cb(
      BaseError.unprocessable(
        `Invalid file type. Only JPEG, JPG, and PNG image files are allowed.`
      ),
      false
    );
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "public", "images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });
export default upload;
