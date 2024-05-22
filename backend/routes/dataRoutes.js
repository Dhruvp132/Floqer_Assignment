const express = require("express");
const router = express.Router();
const { getSalaries, lineDataGraph, jobTitlesByYear } = require('../controllers/dataControllers.js');

router.get('/', getSalaries);
router.get('/linegraph', lineDataGraph);
router.get('/jobtitles', jobTitlesByYear);

module.exports = router;
