const pdfParse = require('pdf-parse');
console.log(typeof pdfParse); // 'function' aana chahiye
const Resume = require('../models/Resume');
const analyzeResume = require('../utils/claudeService');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const data = await pdfParse(req.file.buffer);
    const extractedText = data.text;

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({ message: 'Could not extract enough text from PDF' });
    }

    // Claude se analysis karwao
    const analysis = await analyzeResume(extractedText);

    const resume = await Resume.create({
      user: req.userId,
      fileName: req.file.originalname,
      extractedText,
      analysis,
    });

    res.status(201).json({
      message: 'Resume analyzed successfully',
      resumeId: resume._id,
      analysis,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
exports.getHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.userId })
      .select('fileName analysis createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};