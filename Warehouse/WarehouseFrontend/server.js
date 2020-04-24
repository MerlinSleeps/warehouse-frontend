const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(`${__dirname}/dist/WarehouseFrontend`));

app.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/dist/WarehouseFrontend/index.html`);
});

// Start the app
app.listen(process.env.PORT || 8080);
