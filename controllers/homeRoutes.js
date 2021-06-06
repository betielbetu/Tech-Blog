const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Gets all blogs
router.get('/', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [
        // Get all comments from blog post
        {
          model: Comment,
          include: {
            model: User,
            attributes: ['name'],
          }
        },
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogs, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Gets blog post by primary key
router.get('/blogs/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        // Get all comments from blog post
        {
          model: Comment,
          include: {
            model: User,
            attributes: ['name'],
          }
        },
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const blog = blogData.get({ plain: true });

    res.render('blog', {
      ...blog,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Gets profile page withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Gets login page
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to profile/dashboard
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

// Gets signup page
router.get('/signup', (req, res) => {
  // If logged in the redirect to profile/dashboard
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('signup');
});

// Gets edit page for specific blog post
router.get('/blogs/edit/:id', withAuth, async (req, res) => {
  console.log("here");
  try {
    const editBlogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    if (!editBlogData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    const edit = editBlogData.get({ plain: true });
    console.log("here");
    res.render('edit', {
      edit,
      logged_in: req.session.logged_in
    });
    console.log("here");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;