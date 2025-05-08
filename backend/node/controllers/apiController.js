const getRoot = (req, res) => {
  res.send('API de rutas funcionando');
};

import fetch from 'node-fetch';

const postChat = async (req, res) => {
  const body = req.body || {};
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AUTHORIZATION_BEARER}`,
        "HTTP-Referer": "https://mhtest.alwaysdata.net/#/",
        "X-Title": "Mhosan",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": body.model || "microsoft/phi-4-reasoning-plus:free",
        "messages": body.messages || [
          { role: "user", content: "¿Cuantos términos tiene la serie de Fibonacci?" },
          { role: 'assistant', content: "No esto seguro, pero mi mejor suposición es" },
        ],
        'provider': body.provider || { 'sort': 'throughput' }
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      res.json({ message: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'No message content found', data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getRoot,
  postChat
};
