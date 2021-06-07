const User = require('User');
const Blog = require('Blog');
const Comment = require('Comment');

// User and Blog associations - users have many blogs - a blog belongs to a user
User.hasMany(Blog, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Blog.belongsTo(User, {
  foreignKey: 'user_id'
});

// Comment to User associations - users have many comments - a comment belongs to a user
User.hasMany(Comment, {
  foreignKey: 'user_id'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

// Comment to Blog associations - blogs have many comments - a comment belongs to a blog
Blog.hasMany(Comment, {
    foreignKey: 'blog_id'
});

Comment.belongsTo(Blog, {
    foreignKey: 'blog_id'
});

module.exports = { User, Blog, Comment };