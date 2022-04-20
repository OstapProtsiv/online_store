const { Router } = require('express');
const { checkRole } = require('../middleware/roleMiddleware');
const typeService = require('../service/typeService');

const router = new Router();

router.post('/', checkRole(['admin']), async (req, res, next) => {
    try {
        const { name } = req.body;
        const createdName = await typeService.create(name);

        return createdName;
    } catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    const allTypes = await typeService.getAll();
    // console.log(allTypes);
    // return allTypes
    res.json(allTypes);
});

module.exports = router;
