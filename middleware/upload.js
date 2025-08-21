// middleware/upload.js
import multer from 'multer';

const storage = multer.memoryStorage(); // File ko memory me rakhta hai
const upload = multer({ storage });

export default upload;
