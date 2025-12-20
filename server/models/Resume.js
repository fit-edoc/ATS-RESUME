const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        fileUrl: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        parsedText: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        atsScore: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Resume', resumeSchema);
