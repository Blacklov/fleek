const Category = require("../models/prodcategoryModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require('../utils/validateMongoDbId');

// Create a category
const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
});

// Update a category
const updateCategory = asyncHandler(async (req, res) => {
    const { id} = req.params;
    validateMongoDbId(id);
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.body);
        res.json(updatedCategory);
    } catch (error) {
        throw new Error(error);
    }
});

// Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id} = req.params;
    validateMongoDbId(id);
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory);
    } catch (error) {
        throw new Error(error);
    }
});

// Get a category
const getCategory = asyncHandler(async (req, res) => {
    const { id} = req.params;
    validateMongoDbId(id);
    try {
        const getaCategory = await Category.findById(id);
        res.json(getaCategory);
    } catch (error) {
        throw new Error(error);
    }
});

// Get all categories
const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const getallCategory = await Category.find();
        res.json(getallCategory);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {createCategory, updateCategory, deleteCategory, getCategory, getAllCategory };