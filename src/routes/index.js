const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/cursos', (req, res) => {
  res.render('cursos');
});

module.exports = router;
