targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment which is used to generate a short unique hash used in all resources.')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
@allowed(['australiaeast', 'eastasia', 'eastus', 'eastus2', 'northeurope', 'southcentralus', 'southeastasia', 'uksouth', 'westus2'])
@metadata({
  azd: {
    type: 'location'
  }
})
param location string

param skipVnet bool
param apiServiceName string = ''
param apiUserAssignedIdentityName string = ''
param applicationInsightsName string = ''
param appServicePlanName string = ''
param logAnalyticsName string = ''
param resourceGroupName string = ''
param storageAccountName string = ''
param vNetName string = ''
param disableLocalAuth bool = true

var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = { 'azd-env-name': environmentName }
var functionAppName = !empty(apiServiceName) ? apiServiceName : 'nodejs-api-${resourceToken}'

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: !empty(resourceGroupName) ? resourceGroupName : 'rg-${environmentName}'
  location: location
  tags: tags
}

module api './app/api.bicep' = {
  name: 'api'
  scope: rg
  params: {
    name: functionAppName
    location: location
    tags: tags
    runtimeName: 'node'
    runtimeVersion: '20'
    storageAccountName: storage.outputs.name
    appSettings: {
      AZURE_AISEARCH_ENDPOINT: 'https://example.com',
      EMBEDDING_MODEL_DEPLOYMENT_NAME: 'embedding-model',
      CHAT_MODEL_DEPLOYMENT_NAME: 'chat-model',
      SYSTEM_PROMPT: 'Your system prompt here'
    }
  }
}

module storage './core/storage/storage-account.bicep' = {
  name: 'storage'
  scope: rg
  params: {
    name: !empty(storageAccountName) ? storageAccountName : 'storage-${resourceToken}'
    location: location
    tags: tags
  }
}

output FUNCTION_APP_NAME string = api.outputs.name
output RESOURCE_GROUP string = rg.name
