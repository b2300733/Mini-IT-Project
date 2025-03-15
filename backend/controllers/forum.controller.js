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

    console.log("Adding comment:", { postId, content, userEmail });

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the highest ID among all comments and replies
    let maxId = 0;
    post.comments.forEach((comment) => {
      maxId = Math.max(maxId, comment.id || 0);
      comment.replies.forEach((reply) => {
        maxId = Math.max(maxId, reply.id || 0);
      });
    });

    const newComment = {
      id: maxId + 1, // Ensure unique ID
      userEmail,
      content,
      timestamp: new Date(),
      replies: [],
      isReplying: false,
      replyContent: "",
    };

    console.log("Created new comment with ID:", newComment.id); // Debug log

    post.comments.push(newComment);
    post.commentCount = post.comments.length;

    const updatedPost = await post.save();
    console.log("Comment added successfully:", newComment);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      message: "Error adding comment",
      error: error.message,
      stack: error.stack,
    });
  }
};

const addReply = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content, userEmail } = req.body;

    console.log("Adding reply:", { postId, commentId, content, userEmail }); // Debug log

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find comment by id (convert commentId to number since it comes as string)
    const comment = post.comments.find((c) => c.id === parseInt(commentId, 10));
    if (!comment) {
      console.log("Comment not found:", {
        commentId,
        availableComments: post.comments.map((c) => c.id),
      });
      return res.status(404).json({ message: "Comment not found" });
    }

    // Generate new reply ID
    const maxId = Math.max(
      0,
      ...post.comments.map((c) => c.id || 0),
      ...post.comments.flatMap((c) => c.replies.map((r) => r.id || 0))
    );
    const newId = maxId + 1;

    const newReply = {
      id: newId,
      userEmail,
      content,
      timestamp: new Date(),
    };

    comment.replies.push(newReply);
    post.commentCount += 1;

    await post.save();
    console.log("Reply added successfully:", newReply); // Debug log
    res.status(200).json(post);
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({
      message: "Error adding reply",
      error: error.message,
      params: req.params,
      body: req.body,
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
