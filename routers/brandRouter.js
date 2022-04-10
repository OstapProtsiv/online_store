const { checkRole } = require('../middleware/roleMiddleware');
const brandService = require('../service/brandService');

const Router = require('express').Router;

const router = new Router();

router.post('/', checkRole(['admin']), async (req, res, next) => {
    const { name } = req.body;
    const created = await brandService.create(name);
    // console.log(created);
    // return created
    res.json(created.rows);
})
router.get('/', async (req, res, next) => {
    const allBrands = await brandService.getAll();
    // console.log(allBrands);
    // return allBrands
    res.json(allBrands.rows);
})

module.exports = router;