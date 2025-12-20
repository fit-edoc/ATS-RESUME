const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');
const fs = require('fs');

const parseResume = async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();

    try {
        if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } else if (ext === '.docx' || ext === '.doc') {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } else if (ext === '.txt') {
            return fs.readFileSync(filePath, 'utf8');
        } else {
            throw new Error('Unsupported file format');
        }
    } catch (error) {
        console.error('Error parsing resume:', error);
        throw new Error(`Failed to parse resume content: ${error.message}`);
    }
};

module.exports = { parseResume };
