import express from 'express';

const app = express();
const port = 3001;

app.get('/getServer', (req, res) => {
  res.json({ code: 200, server: `localhost:${port}` });
});

app.listen(port, () => {
  console.log(`DNS Registry server is running on http://localhost:${port}`);
});
