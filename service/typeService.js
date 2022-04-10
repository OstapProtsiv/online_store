const pool = require("../dbConn");
const ApiError = require("../error/ApiError");

class TypeService {
    async create(name) {
        const created = await pool.query("INSERT INTO type1 (name) VALUES ($1) RETURNING id,name", [name]);
        if (!created) {
            return ApiError.BadRequest(403, `this name - ${name} of type already exists`);
        }
        return created.rows;
    }

    async getAll() {
        const allTypes = await pool.query("SELECT * FROM TYPE1");
        return allTypes.rows;
    }
}

module.exports = new TypeService();