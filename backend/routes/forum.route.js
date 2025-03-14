const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  createPost,
  addComment,
  handleVote
} = require('../controllers/forum.controller');

router.get('/posts', getAllPosts);
router.post('/posts', createPost);
router.post('/posts/:postId/comments', addComment);
router.post('/posts/:postId/vote', handleVote);

module.exports = router;