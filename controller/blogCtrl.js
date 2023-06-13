const Blog = require("../models/UserModel");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require('../utils/validateMongoDbId');
const cloudinaryUploadImg = require("../utils/cloudiinary");
const fs = require("fs");


// Create a blog
const createBlog = asyncHandler (async ( req, res) => {
    try{
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
});

// Update a blog
const updateBlog = asyncHandler (async ( req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const updatedBlog = await Blog.findByIdAndUpdate(id,req.body, {
            new: true,
        });
        res.json(updatedBlog);
    } catch (error) {
        throw new Error(error);
    }
});

//Get a blog
const getBlog = asyncHandler (async ( req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: {numViews: 1 },
            },
            {new: true}
            );
        res.json(getBlog);
    } catch (error) {
        throw new Error(error);
    }
});

//  Get all blogs
const getAllBlogs = asyncHandler(async ( req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch (error) {
        throw new Error(error);
    }
});

// Delete a blog
const deleteBlog = asyncHandler (async ( req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
    } catch (error) {
        throw new Error(error);
    }
});

// Like a Blog
const likeBlog = asyncHandler (async (req, res) => {
    const {blogId} = req.body;
    validateMongoDbId(blogId);

    //Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId =req?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find (
        (userId => userId?.toString() === loginUserId?.toString())
    );
    if(alreadyDisliked) {
        const blog =await Blog.findByIdAndUpdate(
            blogId, 
            {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, 
        {new: true}
        );
        res.json(blog);
    }
    if (isLiked) {
        const blog =await Blog.findByIdAndUpdate(
            blogId, 
            {
            $pull: {Likes: loginUserId },
            isLiked: false,
        }, 
        {new: true}
        );
        res.json(blog);
    } else {
        const blog =await Blog.findByIdAndUpdate(
        blogId, 
        {
        $push: {Likes: loginUserId },
        isLiked: true,
    }, 
    {new: true}
    );
    res.json(blog);}
});

// Dislike a blog
const dislikeBlog = asyncHandler (async (req, res) => {
    const {blogId} = req.body;
    validateMongoDbId(blogId);

    //Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId =req?.user?._id;
    // find if the user has disliked the blog
    const isDisLiked = blog?.isDisLiked;
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find (
        (userId => userId?.toString() === loginUserId?.toString())
    );
    if(alreadyLiked) {
        const blog =await Blog.findByIdAndUpdate(
            blogId, 
            {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, 
        {new: true}
        );
        res.json(blog);
    }
    if (isDisLiked) {
        const blog =await Blog.findByIdAndUpdate(
            blogId, 
            {
            $pull: {dislikes: loginUserId },
            isDisliked: false,
        }, 
        {new: true}
        );
        res.json(blog);
    } else {
        const blog =await Blog.findByIdAndUpdate(
        blogId, 
        {
        $push: {dislikes: loginUserId },
        isDisliked: true,
    }, 
    {new: true}
    );
    res.json(blog);}
});

 const uploadImages = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader (path);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        const findBlog = await Blog.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file;
            }),
        },
        {
            new: true,
        }
        );
        res.json(findBlog);
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog, uploadImages };