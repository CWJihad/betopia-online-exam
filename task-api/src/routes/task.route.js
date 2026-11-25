const express = require('express');
const { createTask, getTasks } = require('../controller/task.controller');

const router = express.Router();

router.route('/tasks')
    .post(createTask)
    .get(getTasks);

module.exports = router;