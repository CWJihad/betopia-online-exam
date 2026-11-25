const express = require('express');
const taskRouter = require('./src/routes/task.route');

const app = express();
app.use(express.json());
app.use('/api/v1', taskRouter);
// server is running
app.use('/', (req, res) => {
    res.send("Server is running.......")
})


module.exports = app;