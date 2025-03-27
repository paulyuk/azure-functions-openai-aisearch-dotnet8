# Migrated Azure Function Project

This is the migrated version of the Azure Function project, converted from .NET 8 / C# to Node.js using the JavaScript v2 programming model.

## Prerequisites

- Node.js (v20 or later)
- Azure Functions Core Tools
- Azure CLI

## Project Structure

The project is organized as follows:

```
migrated/
├── src/
│   ├── index.js               # Entry point for the Azure Function
│   ├── openai/
│   │   └── openaiService.js    # Logic for interacting with the OpenAI API
│   └── utils/
│       └── helper.js           # Utility functions for the application
├── infra/
│   ├── main.bicep              # Infrastructure as code for Azure Function deployment
│   └── parameters.json          # Parameters for Bicep deployment
├── package.json                 # npm configuration file
├── host.json                    # Configuration settings for Azure Functions host
├── local.settings.json          # Local configuration settings for Azure Functions
└── README.md                    # Documentation for the migrated project
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables in `local.settings.json`:

   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "<Your Azure Storage Connection String>",
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "AZURE_AISEARCH_ENDPOINT": "<Your AI Search Endpoint>",
       "EMBEDDING_MODEL_DEPLOYMENT_NAME": "<Your Embedding Model Name>",
       "CHAT_MODEL_DEPLOYMENT_NAME": "<Your Chat Model Name>",
       "SYSTEM_PROMPT": "<Your System Prompt>",
       "AZURE_OPENAI_API_KEY": "<Your OpenAI API Key>"
     }
   }
   ```

3. Start the Azure Function locally:

   ```bash
   func start
   ```

## Deployment

1. Ensure you have the Azure CLI and Azure Functions Core Tools installed.

2. Deploy the function to Azure:

   ```bash
   func azure functionapp publish <Your Function App Name>
   ```

## Functions

### Ingest

- **Endpoint**: `/api/ingest`
- **Method**: `POST`
- **Body**:

  ```json
  {
    "Title": "<Your Content Title>"
  }
  ```

- **Response**:

  ```json
  {
    "message": "Text ingested into AI Search"
  }
  ```

### Ask

- **Endpoint**: `/api/ask`
- **Method**: `POST`
- **Body**:

  ```json
  {
    "question": "<Your Question>"
  }
  ```

- **Response**:

  ```json
  {
    "response": "<AI Search Response>"
  }
  ```

## Contributing

Contributions to this project are welcome. Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.