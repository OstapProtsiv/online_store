const ApiError = require("../error/ApiError");
const { QueryTypes } = require('sequelize');
const sequelize = require('../dbConn/sequelizeConn');

function parseDbAnswer(answer, type) {
    if (type == 'select')
        return answer[0];
    if (type == 'insert')
        return answer[0][0];
}

class TypeService {
    async create(name) {
        try {
            const created = await sequelize.query(
                'INSERT INTO "productTypes" (name) VALUES (?) RETURNING id,name',
                {
                    replacements: [name],
                    type: QueryTypes.INSERT
                }
            )

            let createdData = parseDbAnswer(created, 'insert');
            if (!created) {
                return ApiError.BadRequest(403, `this name - ${name} of type already exists`);
            }
            console.log(createdData);
            return createdData;
        } catch (error) {
            return ApiError.BadRequest(403, `this name - ${name} of type already exists`);
        }

    }

    async getAll() {
        // const allTypes = await pool.query("SELECT * FROM 'productTypes'");
        const allTypes = await sequelize.query(
            'SELECT * FROM "productTypes"',
            {
                type: QueryTypes.SELECT
            }
        )
        return allTypes;
    }
}

module.exports = new TypeService();