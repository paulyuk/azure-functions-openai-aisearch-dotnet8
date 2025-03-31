---
name: Azure Function using OpenAI trigger and bindings extension with Azure AI Search
description: This repository contains an Azure Function using Node.js with OpenAI trigger and bindings extension to highlight OpenAI retrieval augmented generation with Azure AI Search. The sample uses managed identity.
page_type: sample
products:
- azure-functions
- azure-openai
- azure-ai-search
- entra-id
urlFragment: azure-functions-openai-aisearch-nodejs
languages:
- javascript
- node
- bicep
- azdeveloper
---

# Azure Functions (Node.js)
## Using Azure Functions OpenAI trigger and bindings extension to import data and query with Azure Open AI and Azure AI Search

This sample contains an Azure Function using the JavaScript v4 programming model with OpenAI bindings extension to highlight OpenAI retrieval augmented generation with Azure AI Search.

You can learn more about the OpenAI trigger and bindings extension in the [GitHub documentation](https://github.com/Azure/azure-functions-openai-extension) and in the [Official OpenAI extension documentation](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-openai).

## Prerequisites

* [Node.js 18 LTS](https://nodejs.org/)
* [Azure Functions Core Tools v4.x](https://learn.microsoft.com/azure/azure-functions/functions-run-local?tabs=v4%2Cwindows%2Cnode%2Cportal%2Cbash)
* [Azure OpenAI resource](https://learn.microsoft.com/azure/openai/overview)
* [Azure AI Search resource](https://learn.microsoft.com/en-us/azure/search/)
* [Azurite](https://github.com/Azure/Azurite) for local storage emulation
* [Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd) to create Azure resources automatically - recommended

## Prepare your local environment

### Create Azure OpenAI and Azure AI Search resources for local and cloud dev-test

Once you have your Azure subscription, run the following in a new terminal window to create Azure OpenAI, Azure AI Search and other resources needed. You will be asked if you want to enable a virtual network that will lock down your OpenAI and AI Search services so they are only available from the deployed function app over private endpoints. To skip virtual network integration, select true. If you select networking, your local IP will be added to the OpenAI and AI Search services so you can debug locally.

```bash
azd init --template https://github.com/eamonoreilly/azure-functions-openai-aisearch-dotnet8
```

Mac/Linux:
```bash
chmod +x ./infra/scripts/*.sh 
```

Windows:
```powershell
set-executionpolicy remotesigned
```

Run the following command to provision resources in Azure:
```bash
azd provision
```

If you don't run azd provision, you can create an [OpenAI resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesOpenAI) and an [AI Search resource](https://portal.azure.com/#create/Microsoft.Search) in the Azure portal to get your endpoints. After it deploys, click Go to resource and view the Endpoint value. You will also need to deploy a model, e.g. with name `chat` with model `gpt-35-turbo` and `embeddings` with model `text-embedding-ada-002`.

### Configure local.settings.json 
Update the `local.settings.json` file with your Azure OpenAI and Azure AI Search endpoints:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "FUNCTIONS_WORKER_RUNTIME_VERSION": "~18",
    "AZURE_OPENAI_ENDPOINT": "<your-openai-endpoint>",
    "AZURE_AISEARCH_ENDPOINT": "<your-aisearch-endpoint>",
    "CHAT_MODEL_DEPLOYMENT_NAME": "chat",
    "EMBEDDING_MODEL_DEPLOYMENT_NAME": "embeddings",
    "SYSTEM_PROMPT": "You must only use the provided documents to answer the question"
  }
}
```

### Permissions
Add your account with the following permissions to the Azure OpenAI and AI Search resources when testing locally:
* Cognitive Services OpenAI User (OpenAI resource)
* Azure Search Service Contributor (AI Search resource)
* Azure Search Index Data Contributor (AI Search resource)

If you used `azd provision`, these permissions are automatically granted to your logged-in user and your function's managed identity.

### Access to Azure OpenAI and Azure AI Search with virtual network integration
If you selected virtual network integration, access to Azure OpenAI and Azure AI Search is limited to the Azure Function app through private endpoints and cannot be reached from the internet. To allow testing from your local machine, you need to go to the networking tab in Azure OpenAI and Azure AI Search and add your client IP to the allowed list. If you used `azd provision` this step is already done.

## Running the Function App locally

1. Install the project dependencies:
```bash
cd migrated
npm install
```

2. Start the function app:
```bash
npm start
# or
func start
```

3. Send POST requests to the `ingest` and `ask` endpoints using your HTTP test tool. If you have the [RestClient](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension installed, you can execute requests directly from the `test.http` file in the `src` folder.

## Functionality

This project includes two main HTTP-triggered functions:

1. **ingest** - An HTTP POST endpoint that takes text data and adds it to AI Search using the EmbeddingsStoreOutput binding
   - Request Format:
     ```json
     {
       "Text": "Contoso support incident 3455 is about slow performance.",
       "Title": "Contoso3455"
     }
     ```

2. **ask** - An HTTP POST endpoint that takes questions and returns responses from the AI Search index using the SemanticSearchInput binding
   - Request Format:
     ```json
     {
       "question": "What is support incident 3455 about?"
     }
     ```

## Deploy to Azure

Run this command to provision the function app, with any required Azure resources, and deploy your code:

```shell
azd up
```

You'll be prompted to supply these required deployment parameters:

| Parameter | Description |
| ---- | ---- |
| _Environment name_ | An environment that's used to maintain a unique deployment context for your app. You won't be prompted if you created the local project using `azd init`.|
| _Azure subscription_ | Subscription in which your resources are created.|
| _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources.|

## Clean up resources

When you're done working with your function app and related resources, you can use this command to delete the function app and its related resources from Azure and avoid incurring any further costs (--purge does not leave a soft delete of AI resource and recovers your quota):

```shell
azd down --purge
```