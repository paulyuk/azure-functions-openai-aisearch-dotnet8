const { app } = require('@azure/functions');

// Setup the Azure Functions app
app.setup({
    enableHttpStream: true
});

// Import function modules
require('./functions/ingest.js');
require('./functions/ask.js');