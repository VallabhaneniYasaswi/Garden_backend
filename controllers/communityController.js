const Community = require('../models/Community');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Create a post
exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    console.log('Received post data:', req.body);

    // Create a temporary user if needed
    let user = await User.findOne({ email: 'default@example.com' });
    if (!user) {
      console.log('Creating default user');
      user = new User({
        name: 'Default User',
        email: 'default@example.com',
        password: 'defaultpassword',
      });
      await user.save();
      console.log('Default user created:', user._id);
    }

    const newPost = new Community({
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      tags: req.body.tags,
      user: user._id
    });

    console.log('Attempting to save post:', newPost);
    const post = await newPost.save();
    console.log('Post saved successfully:', post._id);
    res.json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ 
      message: 'Server Error',
      error: err.message 
    });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Community.find()
      .sort({ date: -1 })
      .populate('user', ['name', 'avatar']);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Community.findById(req.params.id)
      .populate('user', ['name', 'avatar'])
      .populate('comments.user', ['name', 'avatar']);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.image = req.body.image || post.image;
    post.tags = req.body.tags || post.tags;

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);
    const user = await User.findOne({ email: 'default@example.com' });

    if (post.likes.some(like => like.toString() === user._id.toString())) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift(user._id);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);
    const user = await User.findOne({ email: 'default@example.com' });

    if (!post.likes.some(like => like.toString() === user._id.toString())) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    post.likes = post.likes.filter(like => like.toString() !== user._id.toString());
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add comment
exports.addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email: 'default@example.com' });
    const post = await Community.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      user: user._id
    };

    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    post.comments = post.comments.filter(comment => comment.id !== req.params.comment_id);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 