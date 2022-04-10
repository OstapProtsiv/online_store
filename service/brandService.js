const pool = require("../dbConn");

class BrandService {
    async create(name) {
        const created = await pool.query('INSERT INTO brand(name)  VALUES ($1) RETURNING *', [name]);
        return created;
    }
    async getAll() {
        const all = await pool.query('SELECT * FROM brand');
        return all;
    }
}

module.exports = new BrandService();