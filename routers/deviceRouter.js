const { Router } = require('express');
const logger = require('../logger');
const { checkRole } = require('../middleware/roleMiddleware');
const deviceService = require('../service/deviceService');

const router = new Router();

router.post('/', checkRole(['admin']), async (req, res, next) => {
    try {
        const {
            name, price, rating, typeId, brandId,
        } = req.body;
        const { img } = req.files;
        const fileName = await deviceService.moveFile(img);
        // eslint-disable-next-line max-len
        const createdDevice = await deviceService.create(name, price, rating, fileName, typeId, brandId);

        // console.log(createdDevice);
        // return createdDevice;
        res.json(createdDevice);
    } catch (error) {
        next(error);
    }
});
router.post('/info', checkRole(['admin']), async (req, res, next) => {
    try {
        const { deviceId, title, description } = req.body;
        const posted = await deviceService.info(deviceId, title, description);
        // console.log(posted);
        // return posted;
        res.json(posted);
    } catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    const {
        typeId, brandId, limit, page,
    } = req.query;
    const allDevices = await deviceService.getAll(typeId, brandId, limit, page);
    // console.log(allDevices);
    // return allDevices;
    res.json(allDevices);
});
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const one = await deviceService.getOne(id);
        // console.log(one);
        // return one;
        res.json(one);
    } catch (error) {
        next(error);
    }
});
router.patch('/', checkRole(['admin']), async (req, res, next) => {
    try {
        const updated = await deviceService.update(req.body);
        // console.log(updated);
        // return updated
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedDevice = deviceService.delete(id);
        res.json(deletedDevice);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
