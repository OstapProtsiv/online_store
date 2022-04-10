const logger = require('../logger');
const userService = require('../service/userService');

const Router = require('express').Router;

const router = new Router();

router.post('/registration', async (req, res, next) => {
    try {
        let { email, password, role } = req.body;
        let user = await userService.registration(email, password, role);
        // console.log(user);
        // return user;
        res.json(user);
    } catch (error) {
        next(error)
    }

})

router.post('/login', async (req, res, next) => {
    try {
        let { email, password } = req.body;
        let logined = await userService.login(email, password);
        // console.log(logined);
        // return logined;  
        res.json(logined);
    } catch (error) {
        next(error);
    }


})
router.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        let newTokens = await userService.refresh(refreshToken);
        // console.log(accessToken);
        // return {
        // accessToken:newTokens.accessToken,
        // refreshToken:newTokens.refreshToken
        // }
        res.json(newTokens);
    } catch (error) {
        next(error)
    }

})
router.get('/auth', (req, res) => {
    res.json('working');
})

module.exports = router;