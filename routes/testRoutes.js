const express = require('express');

const router = express.Router();

const {
    home,
    testDb
} = require('../controllers/testController');

router.get('/', home);

router.get('/test-db', testDb);

module.exports = router;