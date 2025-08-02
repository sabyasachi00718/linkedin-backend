
const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("author", "name");
    res.json(posts.map(post => ({
      _id: post._id,
      content: post.content,
      authorName: post.author.name,
      createdAt: post.createdAt
    })));
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const newPost = new Post({ content, author: req.user.id });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
});

module.exports = router;
