import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    //console.log('Bearer:', process.env.AUTHORIZATION_BEARER);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AUTHORIZATION_BEARER}`,
        "HTTP-Referer": "https://mhtest.alwaysdata.net/#/",
        "X-Title": "Mhosan",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        //"model": "qwen/qwen3-0.6b-04-28:free",
        "model": "microsoft/phi-4-reasoning-plus:free",
        //"model": "deepseek/deepseek-chat-v3-0324:free",
        //"model": "deepseek/deepseek-chat:free",
        //"model": "google/gemini-2.0-flash-exp:free",
        //"model": "google/learnlm-1.5-pro-experimental:free",
        //"model": "mistralai/mistral-7b-instruct:free",
        "messages": [
          {
            role: "user",
            content: "¿Cuantos términos tiene la serie de Fibonacci?"
          },
          {
            role: 'assistant',
            content: "No esto seguro, pero mi mejor suposición es"
          },
        ],
        'provider': {
          'sort': 'throughput'   // 'throughput' es priorizar el mayor rendimiento, 'latency' es priorizar baja latencia y 'cost' es priorizar precios bajos
        }
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      console.log(data.choices[0].message.content);
    } else {
      console.log('No message content found:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();