const { app, input, output } = require("@azure/functions");

// Define the semantic search input binding
const semanticSearchInput = input.generic({
    type: "semanticSearch",
    connectionName: "AZURE_AISEARCH_ENDPOINT",
    collection: "openai-index",
    query: "{question}",
    chatModel: "%CHAT_MODEL_DEPLOYMENT_NAME%",
    embeddingsModel: "%EMBEDDING_MODEL_DEPLOYMENT_NAME%",
    systemPrompt: "%SYSTEM_PROMPT%"
});

/**
 * HTTP trigger that takes a question and returns a response from the AI Search index.
 * Body should take the format below:
 * {
 *   "question": "What is support incident 3455 about?",
 * }
 */
app.http('ask', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'ask',
    extraInputs: [semanticSearchInput],
    handler: async (request, context) => {
        const logger = context.log;
        
        try {
            logger.info("Ask function called...");
            
            // Get the question from the request body
            const requestBody = await request.json();
            const question = requestBody.question;
            
            if (!question) {
                return {
                    status: 400,
                    jsonBody: { 
                        status: 400, 
                        message: "Question is required" 
                    }
                };
            }
            
            // Get the result from the semantic search binding
            const semanticSearchResult = context.extraInputs.get(semanticSearchInput);
            
            return {
                status: 200,
                body: semanticSearchResult.Response.trim()
            };
        } catch (error) {
            logger.error(`Error in ask function: ${error.message}`);
            return {
                status: 500,
                jsonBody: { 
                    status: 500, 
                    message: "Internal server error" 
                }
            };
        }
    }
});