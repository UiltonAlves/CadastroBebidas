'user strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/customer-controller');
const authService = require('../services/auth-service');

router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/',controller.post);
router.put('/:id',authService.authorize,controller.put);
router.post('/refresh-token', authService.authorize, controller.refreshToken);
router.post('/authenticate', controller.authenticate);

module.exports = router;