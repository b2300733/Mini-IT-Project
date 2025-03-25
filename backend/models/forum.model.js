const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const CommentSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  replies: [ReplySchema],
  isReplying: { type: Boolean, default: false },
  replyContent: String,
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: String }],
  downvotedBy: [{ type: String }],
  commentCount: { type: Number, default: 0 },
  comments: [CommentSchema],
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ForumPost", PostSchema);
