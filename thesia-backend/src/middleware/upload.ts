import multer from 'multer';
import path from 'path';
import fs from 'fs';

const chatUploadsDir = path.join(process.cwd(), 'uploads', 'chat');
if (!fs.existsSync(chatUploadsDir)) {
	fs.mkdirSync(chatUploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, chatUploadsDir);
	},
	filename: (_req, file, cb) => {
		const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
		const ts = Date.now();
		cb(null, `${ts}-${safeName}`);
	}
});

export const chatUpload = multer({ storage });

