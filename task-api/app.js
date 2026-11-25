const express = require('express');
const taskRouter = require('./src/routes/task.route');

const app = express();
app.use(express.json());
app.use('/api/v1', taskRouter);

export default app;