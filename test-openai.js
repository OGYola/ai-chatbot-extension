// test-openai.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('Loading from:', path.resolve(__dirname, '.env.local'));

async function testOpenAI() {
  console.log('Using API key:', process.env.OPENAI_API_KEY?.slice(0, 10) + '...' + process.env.OPENAI_API_KEY?.slice(-4));
  
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });
  
  if (response.ok) {
    console.log('✅ OpenAI API key is valid');
    const data = await response.json();
    console.log('Available models:', data.data.slice(0, 5).map(m => m.id));
  } else {
    console.log('❌ OpenAI API key is invalid:', response.status, response.statusText);
    const error = await response.text();
    console.log('Error details:', error);
  }
}

testOpenAI();