const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/generate', auth, async (req, res) => {
  const { type, context } = req.body;

  if (!context || context.trim() === '') {
    return res.status(400).json({ message: 'Context is required' });
  }

  let prompt = '';
  if (type === 'summary') {
    prompt = `Write a professional resume summary for: ${context}. 3-4 sentences, first person, impactful. Return only the summary text.`;
  } else if (type === 'experience') {
    prompt = `Improve this resume experience: "${context}". Use action verbs and achievements. Return only the improved text.`;
  } else if (type === 'skills') {
    prompt = `Suggest 10 skills for: ${context}. Return ONLY comma-separated list. Example: JavaScript, React, Node.js`;
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Resume Builder'
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500
      })
    });

    const data = await response.json();
    console.log('OpenRouter response:', JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(500).json({ message: 'AI error: ' + data.error.message });
    }

    const text = data?.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ message: 'Empty AI response' });

    res.json({ result: text.trim() });

  } catch (err) {
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
});

module.exports = router;