const { checkRole } = require('../middleware/roleMiddleware');
const typeService = require('../service/typeService');

const Router = require('express').Router;

const router = new Router();

router.post('/', checkRole(['admin']), async (req, res, next) => {
    try {
        const { name } = req.body;
        let createdName = await typeService.create(name);
        // console.log(createdName);
        // return createdName
        res.json(createdName);
    } catch (error) {
        next(error);
    }

});
router.get('/', async (req, res, next) => {
    let allTypes = await typeService.getAll();
    // console.log(allTypes);
    // return allTypes
    res.json(allTypes);
})

module.exports = router;