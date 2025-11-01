const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const metagraphRouter = require('./routes/metagraph');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/metagraph', metagraphRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Legal Angels backend listening on port ${port}`);
});
