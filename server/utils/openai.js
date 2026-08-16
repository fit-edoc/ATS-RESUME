const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSuggestions = async (resumeText, role) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the resume for the given role.
        
Analyze this resume for the role of ${role}. Match patterns and suggest improvements.

FORMATTING REQUIREMENTS:
- Use markdown headings (#) and subheadings (##, ###) to organize your response.
- Use bullet points for all lists and suggestions.
- Do NOT output long paragraphs. Keep all points concise and actionable.
- Do NOT use bold labels like "**Strengths:**". Instead, use proper subheadings (e.g., "### Strengths").
- Ensure the overall structure is highly readable and broken down into logical sections.

Resume Content:
${resumeText.substring(0, 3000)}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API Error:', error.message || error);
        if (error.status === 429 || (error.message && error.message.toLowerCase().includes('quota'))) {
            return 'Gemini API quota exceeded. Please check your billing details.';
        }
        return 'Detailed suggestions unavailable at the moment due to an API error.';
    }
};

module.exports = { generateSuggestions };
