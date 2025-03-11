// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const path = require('path');

// const app = express();
// app.use(cors()); // Allow frontend requests
// app.use(express.json());

// // Serve uploaded files
// app.use('/upload', express.static(path.join(__dirname, 'upload')));

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'upload/'); // Save files in 'upload' directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
// // File type validation (Only JPG & JPEG)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/jpg"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true); // Accept file
//   } else {
//     cb(new Error("Invalid file type. Only JPG and JPEG are allowed."), false);
//   }
// };

// // Multer instance
// const upload = multer({ storage, fileFilter });
// app.get('/', (req, res) => {
//   res.send('Hi');
// });

// // File upload route
// app.post('/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }
//   res.json({ 
//     message: 'File uploaded successfully',
//     fileUrl: `http://localhost:5000/upload/${req.file.filename}` // Return file URL
//   });
// });

// app.listen(5000, () => console.log('Server running on port 5000'));
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/'); // Save files in 'upload' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File type validation (Only JPG & JPEG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG and JPEG are allowed."), false);
  }
};

// Multer instance
const upload = multer({ storage, fileFilter });

// File upload route (Multiple files)
app.post('/upload', upload.array('files', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const fileUrls = req.files.map(file => `http://localhost:5000/upload/${file.filename}`);

  res.json({
    message: 'Files uploaded successfully',
    fileUrls
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
