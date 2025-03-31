const { app, input, output } = require("@azure/functions");

// Define the embeddings store output binding
const embeddingsStoreOutput = output.generic({
    type: "embeddingsStore",
    input: "{Text}", 
    inputType: "rawText", 
    connectionName: "AZURE_AISEARCH_ENDPOINT", 
    collection: "openai-index", 
    model: "%EMBEDDING_MODEL_DEPLOYMENT_NAME%"
});

/**
 * HTTP trigger that takes a body and adds it to the AI Search semantic search.
 * {
 *    "Text": "Contoso support incident 3455 is about slow performance.",
 *    "Title": "Contoso3455"
 * }
 */
app.http('ingest', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'ingest',
    extraOutputs: [embeddingsStoreOutput],
    handler: async (request, context) => {
        const logger = context.log;
        
        try {
            const requestBody = await request.json();
            
            if (!requestBody.Title) {
                return {
                    status: 400,
                    jsonBody: { 
                        status: 400, 
                        message: "Title of content is required" 
                    }
                };
            }
            
            logger.info(`Ingest function called with title: ${requestBody.Title}`);
            
            // Set the embeddings output binding with the text and title
            context.extraOutputs.set(embeddingsStoreOutput, { 
                title: requestBody.Title,
                text: requestBody.Text || ''
            });
            
            return {
                status: 200,
                jsonBody: { 
                    status: 200, 
                    message: "Text ingested into AI Search" 
                }
            };
        } catch (error) {
            logger.error(`Error in ingest function: ${error.message}`);
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