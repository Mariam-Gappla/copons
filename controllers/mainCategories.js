const MainCategory = require("../models/mainCategories");
const allMainCategories = async (req, res, next) => {
    try {
        const mainCategories = await MainCategory.find({});
        return res.status(200).send({
            code: 200,
            status: true,
            data: mainCategories
        })
    }
    catch (error) {
        next(error)
    }
}
const addMainCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        await MainCategory.create({
            name: name
        });
        return res.status(200).send({
            code: 200,
            status: true,
            message: "تم اضافه القسم بنجاح"
        })

    }
    catch (error) {
        next(error)
    }
}
module.exports = {
    allMainCategories,
    addMainCategory,
}