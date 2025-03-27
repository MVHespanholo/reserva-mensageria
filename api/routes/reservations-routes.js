const express = require('express');
const reservationsController = require('../controllers/reservations-controller');

const router = express.Router();

router.get('/', reservationsController.list);

module.exports = router;