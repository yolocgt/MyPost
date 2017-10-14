const exp = require('express');
const router = exp.Router();
const Reply = require('../db').Reply;
const User = require('../db').User;
const Post = require('../db').Post;
router.get('/get_data', function (req, res) {
	Reply.find().populate('post', 'poster title').populate({
		// 'post','name','post.poster'
		path: 'post',
		// select: 'post.poster.name',
		populate: {
			path: 'poster'
		}
	}).populate('replier', 'name').then(function (replies) {
		res.json({ code: 'success', replies });
	})
})

// 回复贴子
router.post('/add', function (req, res) {
	var newReply = new Reply(req.body);
	// 保存贴子
	newReply.save().then(function () {
		// 更新贴子评论数+1  [Reply表]外键post关联[Post表]
		Post.findByIdAndUpdate(req.body.post, { $inc: { 'reply_num': 1 } }, (err, post) => {
			console.log(post);
			// 更新用户被回贴数+1
			User.findByIdAndUpdate(post.poster, { $inc: { 'reply_num': 1 } }, function (err) {
				res.redirect('/');
			})
		})
	})
})

// 删除回贴
router.get('/delete/:id', function (req, res) {
	var id = req.params.id;
	Reply.findById(id, (err, reply) => {
		// 更新贴子评论数+1
		Post.findByIdAndUpdate(reply.post, { $inc: { 'reply_num': -1 } }, (err, post) => {
			console.log(post);
			// 更新用户贴子评论数-1
			User.findByIdAndUpdate(post.poster, { $inc: { 'reply_num': -1 } }, function (err) {
				// 删除贴子
				Reply.findByIdAndRemove(id, (err) => {
					if (!err) {
						res.json({ code: 'success' });
					}
				})
			})
		});
	})
})

module.exports = router;