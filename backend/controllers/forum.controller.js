const ForumPost = require("../models/forum.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ timestamp: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new post
const createPost = async (req, res) => {
  try {
    const { title, content, category, userEmail } = req.body;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new ForumPost({
      title,
      content,
      category,
      userEmail,
      upvotes: 0,
      downvotes: 0,
      upvotedBy: [],
      downvotedBy: [],
      commentCount: 0,
      comments: [],
      timestamp: new Date(),
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, userEmail } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: `Invalid post ID: ${postId}`,
      });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      userEmail,
      content,
      timestamp: new Date(),
      replies: [],
    };

    post.comments.push(newComment);
    post.commentCount = post.comments.length;

    const updatedPost = await post.save();
    console.log("Added comment:", newComment); // Debug log
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      message: "Error adding comment",
      error: error.message,
    });
  }
};

const addReply = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content, userEmail } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: `Invalid post ID: ${postId}`,
      });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const newReply = {
      userEmail,
      content,
      timestamp: new Date(),
      replies: [],
    };

    comment.replies.push(newReply);
    post.commentCount += 1;

    const updatedPost = await post.save();
    console.log("Added reply:", newReply); // Debug log
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({
      message: "Error adding reply",
      error: error.message,
    });
  }
};

// Handle votes
const handleVote = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userEmail, voteType } = req.body;

    console.log("Vote request:", { postId, userEmail, voteType });

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: `Invalid post ID: ${postId}`,
      });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (voteType === "upvote") {
      if (post.upvotedBy.includes(userEmail)) {
        // Remove upvote
        post.upvotes--;
        post.upvotedBy = post.upvotedBy.filter((email) => email !== userEmail);
      } else {
        // Add upvote and remove downvote if exists
        if (post.downvotedBy.includes(userEmail)) {
          post.downvotes--;
          post.downvotedBy = post.downvotedBy.filter(
            (email) => email !== userEmail
          );
        }
        post.upvotes++;
        post.upvotedBy.push(userEmail);
      }
    } else if (voteType === "downvote") {
      if (post.downvotedBy.includes(userEmail)) {
        // Remove downvote
        post.downvotes--;
        post.downvotedBy = post.downvotedBy.filter(
          (email) => email !== userEmail
        );
      } else {
        // Add downvote and remove upvote if exists
        if (post.upvotedBy.includes(userEmail)) {
          post.upvotes--;
          post.upvotedBy = post.upvotedBy.filter(
            (email) => email !== userEmail
          );
        }
        post.downvotes++;
        post.downvotedBy.push(userEmail);
      }
    }

    await post.save();
    console.log("Updated post:", post); // Debug log
    res.status(200).json(post);
  } catch (error) {
    console.error("Error handling vote:", error);
    res.status(500).json({
      message: "Error handling vote",
      error: error.message,
      postId: req.params.postId,
    });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  addComment,
  handleVote,
  addReply,
};
