You are an ai assistant tasked with migrating this current project folder to another language.

Here are some specific requirements:
- This must build a working Azure Function project complete with code, Readme changes, and AZD bicep in the /infra folder
Convert from .NET 8 / C# to Node.js.
- Use the Javascript v2 programming model of Azure functions
- migrate a copy of the code into a ./migrated folder.  Keep making changes in the .migrated folder. 
- use this file `prompts.md` as the main prompt and source of context
- the following repo contains good Node.Js code that works with OpenAI, and this can be used for context around the entire project: https://github.com/Azure-Samples/azure-functions-completion-openai-node
- specifically the code for interacting with AI llms should use the Azure functions extension for AI, documented in these links:
- if constants are ever defined to store environment variables, reuse those in the imperative code to load values instead of loading environment variables again.  Also try to assign a sensible default value.  
- ensure the lastest supported extension bundle for Azure Functions is used for all languages except .NET/C# and PowerShell.  This looks like the following in host.json
```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```
- but if Functions AI features are being used we need to use the Preview Extension bundle for all languages except .NET/C# and PowerShell
```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[4.*, 5.0.0)"
  }
}
```
- if this is an AI based application in Functions please try to always prefer using the AI Functions extension documented here:
https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-openai-embeddings-input?pivots=programming-language-javascript

- ensure the node package.json file has the latest version of the Azure Functions runtime packages installed, and azure openai sdk, e.g.
```json
  "dependencies": {
    "@azure/functions": "^4.0.0",
    "@azure/openai": "^2.0.0"
  },
```
