const mongoose = require('mongoose');

const analysisReportSchema = mongoose.Schema(
    {
        resume: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Resume',
        },
        keywordMatch: {
            type: Number,
            required: true,
        },
        formattingScore: {
            type: Number,
            required: true,
        },
        sectionScore: {
            type: Number,
            required: true,
        },
        experienceScore: {
            type: Number,
            required: true,
        },
        totalScore: {
            type: Number,
            required: true,
        },
        missingKeywords: {
            type: [String],
            default: [],
        },
        suggestions: {
            type: String, // Storing as string or JSON object depending on complexity, string for simplicity or mixed
        },
        detailedAnalysis: {
            type: Object, // To store specific section feedback
        },
        jdMatchPercentage: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('AnalysisReport', analysisReportSchema);
