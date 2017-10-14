


var express = require('express');
var router = express.Router();
const User = require('../db').User;
const Post = require('../db').Post;

/* GET users listing. */
router.get('/get_data', function (req, res, next) {
  User.find()
    .lean()
    .exec(function (err, users) {
      console.log(users);
      users.forEach(function (user) {
        Post.find({ 'poster': user.name }).count(function (err, num) {
          // console.log(user + num);
          user.postnum = num;
          console.log(user);
        })
      })
      console.log(users);
      //#region map
      // var aaa = users.map(function (user) {
      //   Post.find({ 'poster': user.name }).count(function (err, num) {
      //     // console.log(user + num);
      //     var k = user.toObject();
      //     k.postnum = num;
      //     k.id = user._id.toString();
      //     console.log(k);
      //     return k;
      //   })
      // })
      //#endregion
      res.json({ code: 'success', users: users })
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

module.exports = router;
