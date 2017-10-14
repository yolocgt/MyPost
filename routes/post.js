var express = require('express');
var router = express.Router();
const Post = require('../db').Post;
const User = require('../db').User;
const Reply = require('../db').Reply;
/* GET home page. */
router.get('/get_data', function (req, res, next) {
  Post.find().populate('poster', 'name age').then(function (posts) {
    // Post.find().then(function (posts) {
    // console.log(posts);
    res.json({ code: 'success', posts });
  })
});

// 发表新帖
router.post('/add', function (req, res) {
  var newPost = new Post(req.body);
  // 保存贴子
  newPost.save().then(function () {
    // 更新贴主发贴数+1  [Post表]外键poster关联[User表]
    User.findByIdAndUpdate(req.body.poster, { $inc: { 'post_num': 1 } }, function (err) {
      if (!err) {
        res.redirect('/views/post/index.html');
      } else {
        console.log(err);
      }
    })
  })
})

// 删除贴子
router.get('/delete/:id', (req, res) => {
  var id = req.params.id;
  Post.findById(id, function (err, post) {
    // 更新贴主发贴数-1  [Post表]外键poster关联[User表]
    User.findByIdAndUpdate(post.poster, { $inc: { 'post_num': -1 } }, function (err) {
      // 删除贴子下的所有回复 [Reply表]外键post关联[Post表]
      Reply.remove({ 'post': id }, function () {
        // 删除贴子
        Post.findByIdAndRemove(id, (err) => {
          res.json({ code: 'success' });
        });
      });
    })
  })
})
module.exports = router;
