const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateSuggestions = async (resumeText, role) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the resume for the given role.',
                },
                {
                    role: 'user',
                    content: `Analyze this resume for the role of ${role}. match patterns and suggest improvements. \n\nResume Content:\n${resumeText.substring(0, 3000)}`, // Limit fit to context
                },
            ],
            max_tokens: 500,
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI Error:', error);
        return 'Detailed suggestions unavailable at the moment.';
    }
};

module.exports = { generateSuggestions };
