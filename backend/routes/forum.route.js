const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  createPost,
  addComment,
  addReply,
  handleVote,
} = require("../controllers/forum.controller");

router.get("/posts", getAllPosts);
router.post("/posts", createPost);
router.post("/posts/:postId/comments", addComment);
router.post("/posts/:postId/vote", handleVote);
router.post("/posts/:postId/comments/:commentId/replies", addReply);

module.exports = router;
