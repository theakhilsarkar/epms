const express = require('express');
const router = express.Router();
const { checkHealth } = require('../controllers/healthController');

router.route('/').get(checkHealth);

module.exports = router;
