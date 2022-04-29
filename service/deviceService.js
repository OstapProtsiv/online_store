/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
const uuid = require('uuid');
const path = require('path');
const ApiError = require('../error/ApiError');
const models = require('../models');

function parseDbAnswer(answer, type) {
    return answer.dataValues;
}
class DeviveService {
    async create(name, price, rating, imgName, typeId, brandId) {
        const created = await models.device.create({
            name,
            price,
            rating,
            img: imgName,
            typeId,
            brandId,
        });
        // const created = await sequelize.query(
        //     'INSERT INTO devices (name,price,rating,img,"typeId","brandId") VALUES (?,?,?,?,?,?) RETURNING *',
        //     {
        //         replacements: [name, price, rating, imgName, typeId, brandId],
        //         type: QueryTypes.INSERT,
        //     },
        // );
        const createdData = parseDbAnswer(created);

        return createdData;
    }

    async moveFile(file) {
        const fileName = uuid.v4();
        file.mv(path.resolve(__dirname, '..', 'static', `${fileName}.jpg`));
        return fileName;
    }

    async getAll(typeId, brandId, limit, page) {
        limit = limit || 4;
        const offset = page * limit - limit || 0;
        let all;
        if (!brandId && !typeId) {
            all = await models.device.findAll({
                limit,
                offset,
            });
            // all = await sequelize.query(
            //     'SELECT * FROM devices limit ? offset ?',
            //     {
            //         replacements: [limit, offset],
            //         type: QueryTypes.SELECT,
            //     },
            // );
        }
        if (!brandId && typeId) {
            all = await models.device.findAll({
                where: {
                    typeId,
                },
                limit,
                offset,
            });
            // all = await sequelize.query(
            //     'SELECT * FROM devices WHERE "typeId"= ? limit ? offset ?',
            //     {
            //         replacements: [typeId, limit, offset],
            //         type: QueryTypes.SELECT,
            //     },
            // );
        }
        if (brandId && !typeId) {
            all = await models.device.findAll({
                where: {
                    brandId,
                },
                limit,
                offset,
            });
            // all = await sequelize.query(
            //     'SELECT * FROM devices WHERE "brandId" = ? limit ? offset ?',
            //     {
            //         replacements: [brandId, limit, offset],
            //         type: QueryTypes.SELECT,
            //     },
            // );
        }
        if (brandId && typeId) {
            all = await models.device.findAll({
                where: {
                    typeId,
                    brandId,
                },
                limit,
                offset,
            });
            // all = await sequelize.query(
            //     'SELECT * FROM devices WHERE "typeId"=? AND "brandId" = ? LIMIT ? OFFSET ?',
            //     {
            //         replacements: [brandId, limit, offset],
            //         type: QueryTypes.SELECT,
            //     },
            // );
        }

        all = await Promise.all(all.map(async (elem) => {
            const info = await models.deviceInfo.findAll({
                attributes: ['description'],
                where: {
                    deviceId: elem.id,
                },
            });
            elem.dataValues.info = [];
            info.forEach((deviceInfo) => {
                elem.dataValues.info.push(deviceInfo.dataValues);
            });
            return parseDbAnswer(elem);
        }));

        return all;
    }

    async getOne(id) {
        const one = await models.device.findAll({
            where: {
                id,
            },
        });
        if (!one) {
            return ApiError.BadRequest(403, `there is no device with id:${id}`);
        }
        const oneData = parseDbAnswer(one[0]);
        const oneInfo = await models.deviceInfo.findAll({
            where: {
                deviceId: id,
            },
        });

        oneData.info = oneInfo.map((elem) => parseDbAnswer(elem).description);
        return oneData;
    }

    async info(deviceId, title, description) {
        const postedInfo = await models.deviceInfo.create({
            deviceId,
            title,
            description,
        });
        return parseDbAnswer(postedInfo);
    }

    async update({
        id, name, price, rating, imgName, typeId, brandId,
    }) {
        const updated = await models.device.update(
            {
                name,
                price,
                rating,
                img: imgName,
                typeId,
                brandId,
            },
            {
                where: {
                    id,
                },
            },
        );
        return updated;
    }

    async delete(id) {
        await models.basket.destroy({
            where: {
                deviceId: id,
            },
        });
        await models.deviceInfo.destroy({
            where: {
                deviceId: id,
            },
        });
        const deletedDevice = await models.device.destroy({
            where: {
                id,
            },
        });
        return deletedDevice;
    }
}

module.exports = new DeviveService();
