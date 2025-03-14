const ForumPost = require('../models/forum.model');
const User = require('../models/user.model');

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
      return res.status(404).json({ message: 'User not found' });
    }

    const post = new ForumPost({
      title,
      content,
      category,
      author: user.username,
      userEmail,
      timestamp: new Date()
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
    
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      author: user.username,
      content,
      timestamp: new Date()
    });

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle votes
const handleVote = async (req, res) => {
  try {
    const { postId } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (voteType === 'upvote') {
      post.upvotes += 1;
    } else if (voteType === 'downvote') {
      post.downvotes += 1;
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  addComment,
  handleVote
};