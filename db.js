const db = require('mongoose');

db.Promise = global.Promise;
db.connect('mongodb://localhost:27017/MyEmail', {
	useMongoClient: true,
	promiseLibrary: global.Promise
});

db.connection.on('open', function () {
	console.log('数据库连接成功~');
})
db.connection.on('error', function (err) {
	console.log('数据库连接失败!' + err);
})

// 用户表
var User = db.model('user', {
	name: String,//姓名
	age: Number,//年龄
	post_num: {//发帖数
		type: Number,
		default: 0
	},
	reply_num: {//回帖数
		type: Number,
		default: 0
	}
})

// 发帖表
var Post = db.model('post', {
	poster: {//发帖人
		type: db.Schema.Types.ObjectId,
		ref: 'user'
	},
	// poster: String,
	title: String,//标题
	content: String,//内容
	reply_num: {//回帖数
		type: Number,
		default: 0
	}
})

// 回帖表
var Reply = db.model('reply', {
	post: {//发帖表
		type: db.Schema.Types.ObjectId,
		ref: 'post'
	},
	replier: {//回帖人
		type: db.Schema.Types.ObjectId,
		ref: 'user'
	},
	// post: String,
	// replier: String,
	content: String//内容
})

module.exports = { User, Post, Reply };
/**用户表
 * 姓名
 * 年龄
 */

/**发帖表
 * 标题
 * 内容
 * 发件人---下拉框 用户表
 * 评论
 *	
 */

/**回帖表
 * 发帖id ---下拉框 发帖表
 * 发帖人 ---下拉框 用户表
 * 回帖人 ---下拉框 用户表
 * 回帖标题
 * 回帖内容
 */