const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

async function search(query) {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: query,
      max_tokens: 100
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    throw error;
  }
}

async function generateEmbeddings(text) {
  try {
    const response = await openai.createEmbedding({
      model: 'text-embedding-ada-002', // Replace with your embedding model
      input: text
    });
    return response.data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

module.exports = { search, generateEmbeddings };