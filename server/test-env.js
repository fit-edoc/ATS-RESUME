const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const testPdf = async () => {
    console.log('Testing PDF Parse...');
    try {
        // Create a dummy PDF file content (this is a very basic verification, 
        // a real PDF is needed to test pdf-parse, but let's check if module loads)
        console.log('PDF module loaded:', !!pdf);

        // We can't easily synthesize a valid PDF without a lib. 
        // But we can check if we can read a file if one exists.
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            console.log('Uploads dir does not exist!');
            fs.mkdirSync(uploadsDir);
            console.log('Created uploads dir');
        } else {
            console.log('Uploads dir exists');
        }

        console.log('Test complete. Environment seems okay.');
    } catch (error) {
        console.error('Test failed:', error);
    }
};

testPdf();
