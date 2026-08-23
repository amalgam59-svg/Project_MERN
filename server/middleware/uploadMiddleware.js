import multer from 'multer'

const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, callback) => {
		if (imageTypes.includes(file.mimetype)) return callback(null, true)
		return callback(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed'))
	},
})

export default upload