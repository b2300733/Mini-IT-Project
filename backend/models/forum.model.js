const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  replies: [this]
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userEmail: { type: String, required: true },
  category: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  comments: [CommentSchema],
  timestamp: { type: Date, default: Date.now }
});


module.exports = mongoose.model("ForumPost", PostSchema);
