const { Router } = require('express');
const userRouter = require('./userRouter');
const typeRouter = require('./typeRouter');
const deviceRouter = require('./deviceRouter');
const brandRouter = require('./brandRouter');
// const users = require('../models/');
const router = new Router();

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/device', deviceRouter);
router.use('/brand', brandRouter);
// router.get('/', (req, res) => {
//     users.user.create({
//         email: 'testModels2@gmail.com',
//         password: 'abdaskdoml',
//         role: 'user',
//     })
//     res.json('working')
// })

module.exports = router;
