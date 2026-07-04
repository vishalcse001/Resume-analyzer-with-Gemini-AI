const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResume = async (resumeText, retries = 2) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    generationConfig: {
      temperature: 0.2,
    },
  });

  const prompt = `You are an expert ATS (Applicant Tracking System) and resume reviewer. Analyze the following resume text and give a response STRICTLY in this JSON format, no extra text before or after, no markdown:

{
  "atsScore": <number between 0-100>,
  "strengths": ["point1", "point2", "point3"],
  "weaknesses": ["point1", "point2", "point3"],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}

Resume text:
${resumeText}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      const cleanText = rawText.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (err) {
      const isOverloaded = err.message?.includes('503') || err.message?.includes('overloaded');
      if (isOverloaded && attempt < retries) {
        console.log(`Attempt ${attempt + 1} failed (server overloaded), retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 sec wait karke retry
        continue;
      }
      throw err;
    }
  }
};

module.exports = analyzeResume;