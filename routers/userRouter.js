const { Router } = require('express');
const logger = require('../logger');
const userService = require('../service/userService');

const router = new Router();

router.post('/registration', async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        const user = await userService.registration(email, password, role);
        // console.log(user);
        // return user;
        res.json(user);
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const logined = await userService.login(email, password);
        // console.log(logined);
        // return logined;
        res.json(logined);
    } catch (error) {
        next(error);
    }
});
router.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const newTokens = await userService.refresh(refreshToken);
        // console.log(accessToken);
        // return newTokens
        res.json(newTokens);
    } catch (error) {
        next(error);
    }
});
router.delete('/delete', async (req, res, next) => {
    try {
        const { email } = req.body;
        const deleted = userService.delete(email);
        // console.log(deleted);
        // return deleted;
        res.json(deleted);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
