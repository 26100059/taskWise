import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();  // Loads .env

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY // Securely loads API key from .env
});

async function main() {
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: 'Explain the importance of low latency LLMs' }],
    model: 'llama3-8b-8192',
  });

  console.log(chatCompletion.choices[0].message.content);
}

//NOTE: You need to setup the api key in the .env file in the root directory of the project to be able to run this. field name for
// key is GROQ_API_KEY=your_api_key

main();
