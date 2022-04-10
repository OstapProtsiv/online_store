const uuid = require('uuid');
const path = require("path");
const pool = require("../dbConn");
const ApiError = require('../error/ApiError');

class DeviveService {
    async create(name, price, rating, imgName, typeId, brandId, info) {
        const created = await pool.query('INSERT INTO device (name,price,rating,img,type_id,brand_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [name, price, rating, imgName, typeId, brandId]);
        // insert info into Device_info
        return created.rows;
    }
    async moveFile(file) {
        let fileName = uuid.v4();
        file.mv(path.resolve(__dirname, '..', 'static', `${fileName}.jpg`));
        return fileName;
    }
    async getAll(typeId, brandId, limit, page) {
        // add offset liit, find by brandId Type id
        limit = limit || 4;
        let offset = page * limit - limit || 0;
        let all;
        if (!brandId && !typeId) {

            all = await pool.query('SELECT * FROM device limit $1 offset $2', [limit, offset]);
        }
        if (!brandId && typeId) {
            all = await pool.query('SELECT * FROM device WHERE type_id= $1 limit $2 offset $3', [typeId, limit, offset]);
        }
        if (brandId && !typeId) {
            all = await pool.query('SELECT * FROM device WHERE brand_id = $1 limit $2 offset $3', [brandId, limit, offset]);
        }
        if (brandId && typeId) {
            all = await pool.query('SELECT * FROM device WHERE type_id=$1 AND brand_id = $2 LIMIT $3 OFFSET $4', [typeId, brandId, limit, offset]);
        }

        await Promise.all(all.rows.map(async (elem) => {
            elem.info = (await pool.query('SELECT description from device_info where device_id=$1', [elem.id])).rows;
        }));

        //Поясни це плзззззз ↑↑↑↑


        return all.rows;
    }
    async getOne(id) {
        const one = await pool.query(`SELECT * FROM device where id=${id}`);
        // include into response info array about device
        if (!one) {
            return ApiError.BadRequest(403, `there is no user with id:${id}`)
        }
        console.log(one.rows[0]);
        one.rows[0].info = (await pool.query('SELECT description from device_info where device_id=$1', [one.rows[0].id])).rows;
        return one.rows;
    }
    async info(deviceId, title, description) {
        const postedInfo = await pool.query('INSERT INTO device_info (device_id,title,description) VALUES ($1,$2,$3) RETURNING *', [deviceId, title, description]);
        return postedInfo.rows;
    }
}

module.exports = new DeviveService();