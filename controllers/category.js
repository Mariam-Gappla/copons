const categorySchema = require("../validition/category");
const Category = require("../models/category");
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
            status: true,
            code: 200,
            data: categories
        });
    }
    catch (error) {
        next(error);
    }
}
const addCategory = async (req, res, next) => {
    try {
        const lang = req.headers["accept-language"] || "ar";

        const { error } = categorySchema(lang).validate({
            name: req.body.name
        });

        if (error) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: error.details[0].message
            });
        }
        const category = await Category.create({
            name: req.body.name,
            mainCategoryId:req.params.id
        });

        return res.status(200).json({
            status: true,
            code: 200,
            message: "تم إضافة القسم بنجاح",
            data: category
        });

    } catch (error) {
        next(error);
    }
};
const updateCategory = async (req, res, next) => {
    try {
        const lang = req.headers["accept-language"] || "ar";

        const { error } = categorySchema(lang).validate({
            name: req.body.name
        });

        if (error) {
            return res.status(400).send({
                status: false,
                code: 400,
                message: error.details[0].message
            });
        }

        const categoryId = req.params.id;
        console.log(categoryId)
        const category = await Category.findById({_id:categoryId});
        if (!category) {
            return res.status(400).send({
                status: false,
                code: 400,
                message: "القسم غير موجود"
            });
        }
        const cat = await Category.findByIdAndUpdate({ _id: categoryId }, { name: req.body.name }, { new: true });


        return res.status(200).send({
            status: true,
            code: 200,
            message: "تم تعديل القسم بنجاح",
            data: cat
        });

    } catch (error) {
        next(error);
    }
};
const deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findByIdAndDelete({_id:categoryId});

        if (!category) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "القسم غير موجود"
            });
        }

        return res.status(200).json({
            status: true,
            code: 200,
            message: "تم حذف القسم بنجاح"
        });

    } catch (error) {
        next(error);
    }
};
const getCategoriesInMainCategory = async (req, res, next) => {
    try {
        const id=req.params.id;
        const categories= await Category.find({mainCategoryId:id});
        return res.status(200).send({
            status:true,
            code:200,
            data:categories
        })
    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    addCategory,
    updateCategory,
    deleteCategory,
    getCategories,
    getCategoriesInMainCategory
}
