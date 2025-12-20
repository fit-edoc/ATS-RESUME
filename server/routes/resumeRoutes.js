const express = require('express');
const router = express.Router();
const { uploadResume, analyzeResume, matchJobDescription, getResumes, getAnalysisReport } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx|txt/;
        const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'text/plain';
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        console.log('File rejected:', file.originalname, file.mimetype);
        cb(new Error('Error: File upload only supports PDF, DOC and DOCX file types!'));
    }
});

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/analyze', protect, analyzeResume);
router.post('/jd-match', protect, matchJobDescription);
router.get('/', protect, getResumes);
router.get('/report/:id', protect, getAnalysisReport);

module.exports = router;
