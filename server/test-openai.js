require('dotenv').config();
const { generateSuggestions } = require('./utils/openai');

(async () => {
  const result = await generateSuggestions('Sample resume text', 'Software Engineer');
  console.log('Result:', result);
})();
