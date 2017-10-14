var express = require('express');
var router = express.Router();
const User = require('../db').User;
const Post = require('../db').Post;
const Reply = require('../db').Reply;
const mongoose = require('mongoose');
/* GET users listing. */
router.get('/get_data', function (req, res, next) {
  User.find({}, function (err, users) {
    res.json({ code: 'success', users });
  })
});

// 添加用户
router.post('/add', function (req, res) {
  var newUser = new User(req.body);
  newUser.save((err) => {
    if (!err) {
      res.redirect('/views/user/index.html');
    }
  })
})

router.get('/delete/:id', function (req, res) {
  var id = req.params.id;
  Post.findOne({ 'poster': id }, (err, post) => {
    if (post) {
      // 删除用户贴子的评论表
      Reply.remove({ 'post': post._id });
    }
  }).then(function () {
    // 删除用户贴子
    Post.remove({ 'poster': mongoose.Types.ObjectId(id) }, (err) => {
      console.log('删除用户贴子');
    });
  }).then(function () {
    // 删除用户评论的表
    Reply.remove({ 'replier': mongoose.Types.ObjectId(id) }, function (err) {
      console.log('删除用户评论的表');
    });
    User.findByIdAndRemove(id,function(){
      res.redirect('/views/user/index.html');
    });
  }).catch(function (err) {
    console.log('错误::::::::' + err);
  })
})
module.exports = router;
