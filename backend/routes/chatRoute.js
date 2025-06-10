const express = require('express');
const axios = require('axios');
const router = express.Router();
const openai = require('../config/openaiConfig');

router.post('/', async (req, res) => {
  const { messages } = req.body;
  // Replace this with the actual call to your OpenAI API or other model
  try {
    const response = await openai.chat.completions.create({
        messages,
        model: 'ft:gpt-4o-mini-2024-07-18:personal::Ag2VB7G0',
        max_completion_tokens: 100
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch response' });
  }
});

module.exports = router;
