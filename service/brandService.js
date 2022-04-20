const { QueryTypes } = require('sequelize');
const sequelize = require('../dbConn/sequelizeConn');
const ApiError = require('../error/ApiError');

// eslint-disable-next-line consistent-return
function parseDbAnswer(answer, type) {
    if (type === 'select') { return answer[0]; }
    return answer[0][0];
}
class BrandService {
    async create(name) {
        try {
            const created = await sequelize.query(
                'INSERT INTO "brands" (name) VALUES (?) RETURNING id,name',
                {
                    replacements: [name],
                    type: QueryTypes.INSERT,
                },
            );

            const createdData = parseDbAnswer(created, 'insert');
            if (!created) {
                return ApiError.BadRequest(403, `this name - ${name} of brand already exists`);
            }
            return createdData;
        } catch (error) {
            return ApiError.BadRequest(403, `this name - ${name} of type already exists`);
        }
    }

    async getAll() {
        const allBrands = await sequelize.query(
            'SELECT * FROM "brands"',
            {
                type: QueryTypes.SELECT,
            },
        );
        return allBrands;
    }
}

module.exports = new BrandService();
