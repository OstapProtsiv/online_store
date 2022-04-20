/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
const uuid = require('uuid');
const path = require('path');
const { QueryTypes } = require('sequelize');
const ApiError = require('../error/ApiError');
const sequelize = require('../dbConn/sequelizeConn');

function parseDbAnswer(answer, type) {
    if (type === 'select') { return answer[0]; }
    return answer[0][0];
}
class DeviveService {
    async create(name, price, rating, imgName, typeId, brandId, info) {
        const created = await sequelize.query(
            'INSERT INTO devices (name,price,rating,img,"typeId","brandId") VALUES (?,?,?,?,?,?) RETURNING *',
            {
                replacements: [name, price, rating, imgName, typeId, brandId],
                type: QueryTypes.INSERT,
            },
        );
        const createdData = parseDbAnswer(created, 'insert');

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
            // all = await pool.query('SELECT * FROM device limit $1 offset $2', [limit, offset]);
            all = await sequelize.query(
                'SELECT * FROM devices limit ? offset ?',
                {
                    replacements: [limit, offset],
                    type: QueryTypes.SELECT,
                },
            );
        }
        if (!brandId && typeId) {
            // all = await pool.query('SELECT * FROM device WHERE type_id= $1 limit $2 offset $3', [typeId, limit, offset]);
            all = await sequelize.query(
                'SELECT * FROM devices WHERE "typeId"= ? limit ? offset ?',
                {
                    replacements: [typeId, limit, offset],
                    type: QueryTypes.SELECT,
                },
            );
        }
        if (brandId && !typeId) {
            // all = await pool.query('SELECT * FROM device WHERE brand_id = $1 limit $2 offset $3', [brandId, limit, offset]);
            all = await sequelize.query(
                'SELECT * FROM devices WHERE "brandId" = ? limit ? offset ?',
                {
                    replacements: [brandId, limit, offset],
                    type: QueryTypes.SELECT,
                },
            );
        }
        if (brandId && typeId) {
            // all = await pool.query('SELECT * FROM device WHERE type_id=$1 AND brand_id = $2 LIMIT $3 OFFSET $4', [typeId, brandId, limit, offset]);
            all = await sequelize.query(
                'SELECT * FROM devices WHERE "typeId"=? AND "brandId" = ? LIMIT ? OFFSET ?',
                {
                    replacements: [brandId, limit, offset],
                    type: QueryTypes.SELECT,
                },
            );
        }
        console.log(all);

        await Promise.all(all.map(async (elem) => {
            const info = await sequelize.query(
                'SELECT description from "deviceInfos" where "deviceId"=?',
                { replacements: [elem.id], type: QueryTypes.SELECT },
            );
            elem.info = info;
        }));

        // Поясни це плзззззз ↑↑↑↑

        return all;
    }

    async getOne(id) {
        const one = await sequelize.query(
            `SELECT * FROM devices where id=${id}`,
            { type: QueryTypes.SELECT },
        );

        if (!one) {
            return ApiError.BadRequest(403, `there is no device with id:${id}`);
        }
        const oneData = parseDbAnswer(one, 'select');
        oneData.info = await sequelize.query(
            'SELECT description from "deviceInfos" where "deviceId"=?',
            { replacements: [id], type: QueryTypes.SELECT },
        );
        return oneData;
    }

    async info(deviceId, title, description) {
        const postedInfo = await sequelize.query(
            'INSERT INTO "deviceInfos" ("deviceId",title,description) VALUES (?,?,?) RETURNING *',
            {
                replacements: [deviceId, title, description],
                type: QueryTypes.INSERT,
            },
        );
        return parseDbAnswer(postedInfo, 'select');
    }
}

module.exports = new DeviveService();
