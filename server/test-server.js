const express = require('express');
const app = express();

app.get('/ping', (req, res) => res.send('pong'));

app.listen(5000, '0.0.0.0', () => {
  console.log('✅ Minimal test server running on http://localhost:5000');
});
