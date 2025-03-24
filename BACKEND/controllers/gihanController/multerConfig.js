const multer = require("multer");
const path = require("path");

// Set up Multer to store files in memory as Buffers
const storage = multer.memoryStorage(); // Store files in memory as Buffers

// Initialize Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only image files (jpeg, jpg, png, gif) are allowed!");
    }
  },
});

module.exports = upload;