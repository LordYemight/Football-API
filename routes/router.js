const express = require ('express');
const createUser = require('../controllers/createUser');
const router = express.Router();

router.post('/signUp', createUser)

module.exports = router;