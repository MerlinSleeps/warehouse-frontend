const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(`${__dirname}/dist/ShopFrontend`));

app.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/dist/ShopFrontend/index.html`);
});

// Start the app
app.listen(process.env.PORT || 9090);
