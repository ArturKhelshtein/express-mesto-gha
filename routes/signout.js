const router = require('express').Router();

const { logout } = require('../controllers/users');

router.get('/', logout);

module.exports = router;
