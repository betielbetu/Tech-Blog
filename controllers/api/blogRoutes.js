const router = require('express').Router();
const { Blog, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Gets specific blog posts by primary key - is this route needed?? who knows
router.get('/:id', withAuth, async (req, res) => {
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
      blog,
      logged_in: req.session.logged_in
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

// Creates a new blog post from th dashboard/profile page
router.post('/', withAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete blog post from dashboard/profile
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update blog post from blog post page
router.put('/edit/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.update({
      name: req.body.name,
      description: req.body.description
    },
    {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Post comment
router.post('/:id', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      text: req.body.text,
      user_id: req.session.user_id,
      blog_id: req.body.id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});



module.exports = router;