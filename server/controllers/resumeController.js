const asyncHandler = require('express-async-handler');
const Resume = require('../models/Resume');
const AnalysisReport = require('../models/AnalysisReport');
const { parseResume } = require('../utils/fileParser');
const { generateSuggestions } = require('../utils/openai');

// @desc    Upload Resume
// @route   POST /resume/upload
// @access  Private
const uploadResume = asyncHandler(async (req, res) => {
    
    console.log('Upload request received');
    if (!req.file) {
        console.log('No file received');
        res.status(400);
        throw new Error('Please upload a file');
    }

    console.log('File received:', req.file);

    const { role } = req.body;

    // ... logic ...

    console.log('Parsing resume...');
    let parsedText = '';
    try {
        parsedText = await parseResume(req.file.path);
        console.log('Resume parsed successfully, length:', parsedText.length);
    } catch (err) {
        console.error('Parsing failed:', err);
        throw new Error('Failed to parse resume content: ' + err.message);
    }

    const resume = await Resume.create({
        user: req.user.id,
        fileUrl: req.file.path,
        fileName: req.file.originalname,
        parsedText,
        role: role || 'General',
    });

    console.log('Resume saved:', resume._id);
    res.status(201).json(resume);
});

// @desc    Analyze Resume
// @route   POST /resume/analyze
// @access  Private
const analyzeResume = asyncHandler(async (req, res) => {
    const { resumeId } = req.body;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
        res.status(404);
        throw new Error('Resume not found');
    }

    if (resume.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Scoring Logic
    // 1. Keyword Match (40%) - specific to role
    // 2. Formatting (20%)
    // 3. Section Completeness (20%)
    // 4. Experience Quality (20%)

    const text = resume.parsedText.toLowerCase();

    // 1. Keywords
    const roleKeywords = {
        'frontend': ['react', 'javascript', 'css', 'html', 'next.js', 'redux', 'typescript'],
        'backend': ['node.js', 'express', 'mongodb', 'sql', 'api', 'auth', 'docker'],
        'mern': ['mongodb', 'express', 'react', 'node.js', 'redux', 'javascript'],
        'fullstack': ['react', 'node.js', 'database', 'api', 'frontend', 'backend', 'devops']
    };

    const targetKeywords = roleKeywords[resume.role.toLowerCase()] || roleKeywords['fullstack'];
    const foundKeywords = targetKeywords.filter(k => text.includes(k));
    const keywordScore = (foundKeywords.length / targetKeywords.length) * 40;

    // 2. Formatting (Simple heuristics)
    let formattingScore = 20;
    const formattingIssues = [];
    if (resume.fileName.includes(' ')) { // simplistic check
        // formattingIssues.push('File name should not contain spaces'); // Not really ATS strict but good practice
    }
    // Check for common non-ATS friendly chars
    // if (/[^\x00-\x7F]/.test(text)) { formattingScore -= 5; formattingIssues.push('Non-standard characters detected'); }

    // 3. Sections
    const sections = ['education', 'experience', 'skills', 'projects', 'summary'];
    const foundSections = sections.filter(s => text.includes(s));
    const sectionScore = (foundSections.length / sections.length) * 20;

    // 4. Experience (Simplistic length/content check)
    const experienceScore = text.length > 500 ? 20 : 10;

    const totalScore = keywordScore + formattingScore + sectionScore + experienceScore;

    // AI Suggestions
    const aiSuggestions = await generateSuggestions(resume.parsedText, resume.role);

    // Update Resume Score
    resume.atsScore = Math.round(totalScore);
    await resume.save();

    // Create Report
    const report = await AnalysisReport.create({
        resume: resume._id,
        keywordMatch: Math.round(keywordScore),
        formattingScore,
        sectionScore: Math.round(sectionScore),
        experienceScore,
        totalScore: Math.round(totalScore),
        missingKeywords: targetKeywords.filter(k => !text.includes(k)),
        suggestions: aiSuggestions,
    });

    res.status(200).json(report);
});

// @desc    Match with JD
// @route   POST /resume/jd-match
// @access  Private
const matchJobDescription = asyncHandler(async (req, res) => {
    const { resumeId, jobDescription } = req.body;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
        res.status(404);
        throw new Error('Resume not found');
    }

    const resumeText = resume.parsedText.toLowerCase();
    const jdText = jobDescription.toLowerCase();

    // Extract keywords from JD (simplistic: split and filter common words)
    // A real app would use NLP (e.g. natural, compromise)
    const jdWords = jdText.split(/\W+/).filter(w => w.length > 3);
    const uniqueJdWords = [...new Set(jdWords)];

    const caughtWords = uniqueJdWords.filter(w => resumeText.includes(w));
    const matchPercentage = (caughtWords.length / uniqueJdWords.length) * 100;

    res.json({
        matchPercentage: Math.round(matchPercentage),
        missingKeywords: uniqueJdWords.filter(w => !resumeText.includes(w)).slice(0, 10), // Top 10 missing
    });
});

// @desc    Get all resumes
// @route   GET /resume
// @access  Private
const getResumes = asyncHandler(async (req, res) => {
    const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(resumes);
});

// @desc    Get analysis report
// @route   GET /resume/report/:id
// @access  Private
const getAnalysisReport = asyncHandler(async (req, res) => {
    const report = await AnalysisReport.findOne({ resume: req.params.id });
    if (!report) {
        res.status(404);
        throw new Error('Report not found');
    }
    res.status(200).json(report);
})


module.exports = {
    uploadResume,
    analyzeResume,
    matchJobDescription,
    getResumes,
    getAnalysisReport
};
