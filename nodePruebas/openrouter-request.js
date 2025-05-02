import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    console.log('Bearer:', process.env.AUTHORIZATION_BEARER);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AUTHORIZATION_BEARER}`,
        "HTTP-Referer": "https://mhtest.alwaysdata.net/#/",
        "X-Title": "Mhosan",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "qwen/qwen3-0.6b-04-28:free",
        "messages": [
          {
            "role": "user",
            "content": "Cual es el sentido de la vida?"
          }
        ]
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