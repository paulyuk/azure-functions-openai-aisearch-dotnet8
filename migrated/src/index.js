const { app, HttpRequest, HttpResponse } = require('@azure/functions');
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');

const endpoint = process.env.AZURE_AISEARCH_ENDPOINT;
const embeddingModel = process.env.EMBEDDING_MODEL_DEPLOYMENT_NAME;
const chatModel = process.env.CHAT_MODEL_DEPLOYMENT_NAME;
const systemPrompt = process.env.SYSTEM_PROMPT;
const indexName = 'openai-index';

// Ingest function
app.http('ingest', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (context, req) => {
    const body = req.body;

    if (!body || !body.Title || !body.Text) {
      console.log('Invalid request: Title or Text is missing');
      return {
        status: 400,
        body: { message: 'Title and Text are required' },
      };
    }

    console.log(`Ingest function called with title: ${body.Title}`);

    return {
      status: 200,
      body: { message: 'Text ingested into AI Search' },
      embeddingsStoreOutput: {
        text: body.Text,
        title: body.Title,
        endpoint,
        indexName,
        model: embeddingModel
      }
    };
  },
});

// Ask function
app.http('ask', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (context, req) => {
    const body = req.body;

    if (!body || !body.question) {
      console.log('Invalid request: Question is missing');
      return {
        status: 400,
        body: { message: 'Question is required' },
      };
    }

    console.log('Ask function called...');

    return {
      status: 200,
      body: {
        response: context.bindings.embeddingsHttpInput.response
      },
      embeddingsHttpInput: {
        question: body.question,
        endpoint,
        indexName,
        chatModel,
        embeddingsModel: embeddingModel,
        systemPrompt
      }
    };
  },
});

module.exports = app;