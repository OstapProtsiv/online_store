const models = require('../models');
const ApiError = require('../error/ApiError');

function parseDbAnswer(answer) {
    return answer.dataValues;
}
class BrandService {
    async create(name) {
        try {
            const created = models.brand.create({
                name,
            });

            const createdData = parseDbAnswer(created);
            if (!created) {
                return ApiError.BadRequest(403, `this name - ${name} of brand already exists`);
            }
            return createdData;
        } catch (error) {
            return ApiError.BadRequest(403, `this name - ${name} of type already exists`);
        }
    }

    async getAll() {
        const allBrands = await models.brand.findAll();
        return allBrands;
    }
}

module.exports = new BrandService();
