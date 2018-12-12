const express = require('express');
const router = express.Router();
const { convert } = require('./math')

router.post('/mathHtml', function(req, res) {
  convert(req, res)
})

module.exports = router;