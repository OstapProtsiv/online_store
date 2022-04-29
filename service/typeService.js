const ApiError = require('../error/ApiError');
const models = require('../models');

function parseDbAnswer(answer) {
    return answer.dataValues;
}

class TypeService {
    async create(name) {
        try {
            const created = await models.productType.create({
                name,
            });
            const createdData = parseDbAnswer(created);
            if (!created) {
                return ApiError.BadRequest(403, `this name - ${name} of type already exists`);
            }
            return createdData;
        } catch (error) {
            return ApiError.BadRequest(403, `this name - ${name} of type already exists`);
        }
    }

    async getAll() {
        const allTypes = await models.productType.findAll({});
        return allTypes;
    }
}

module.exports = new TypeService();
