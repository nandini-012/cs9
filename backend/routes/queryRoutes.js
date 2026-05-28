const express = require('express');
const router = express.Router();
const { getQueries, createQuery, updateQuery, reportQuery } = require('../controllers/queryController');

router.route('/').get(getQueries).post(createQuery);
router.route('/:id').put(updateQuery);
router.route('/:id/report').post(reportQuery);

module.exports = router;
