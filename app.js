const express = require('express')
const drift = require('./models/drift')
const mongodb = require('./models/mongodb')
const bodyParser = require('body-parser')

const app = express()

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json 
app.use(bodyParser.json())

// 仍一个漂流瓶
// POST owner=xxx&type=xxx&content=xxx[&time=xxx]
app.post('/', (req, res) => {
    if (!req.body.owner || !req.body.type || !req.body.content) {
        return res.json({ code: 0, msg: "信息不完整" })
    }
    if (req.body.type && (['male', 'female'].indexOf(req.body.type) === -1)) {
        return res.json({ code: 0, msg: "类型错误" })
    }
    drift.throw(req.body).then(result => {
        res.json(result)
    })
})


// 捡一个漂流瓶
// GET /?user=xxx[&type=xxx]
app.get('/', (req, res) => {
    if (!req.query.user) {
        return res.json({ code: 0, msg: "信息不完整" })
    }
    if (req.query.type && (['male', 'female', 'all'].indexOf(req.query.type) === -1)) {
        return res.json({ code: 0, msg: "类型错误" })
    }
    drift.pick(req.query).then(result => {
        // 捡到一个瓶子后，同时将该瓶子放到 "我的瓶子" 里(mongodb)
        if (result.code === 1) {
            mongodb.save(req.query.user, result.msg).then(bottle => {
                // console.log(bottle)
                return res.json({ code: 1, msg: result })
            }).catch(error => {
                return res.json({ code: 0, msg: "获取漂流瓶失败，请重试" })
            })
        }
        // res.json(result)
    })
})

// 获取一个用户所有的漂流瓶
// GET /user/nswbmw
app.get('/bottle/all/:user', (req, res) => {
    mongodb.getAll(req.params.user).then((result) => {
        return res.json(result)
    })
})

// 获取特定 id 的漂流瓶
// GET /bottle/529a8b5b39242c82417b43c3
app.get('/bottle/:_id', (req, res) => {
    mongodb.getOne(req.params._id).then((result) => {
        return res.json({ code: 1, msg: result })
    })
})

// 回复特定 id 的漂流瓶
// POST user=xxx&content=xxx[&time=xxx]
app.put('/bottle/:_id', (req, res) => {
    if (!(req.body.user && req.body.content)) {
        return res.json({ code: 0, msg: "回复信息不完整！" })
    }
    mongodb.reply(req.params._id, req.body).then((result) => {
        return res.json({ code: 1, msg: result })
    })
})


// 删除特定 id 的漂流瓶
// GET /delete/529a8b5b39242c82417b43c3
app.delete('/bottle/:_id', (req, res) => {
    mongodb.delete(req.params._id).then(result => {
        return res.json(result)
    });
})

app.listen(3003, () => {
    console.log('app is listening at 3003')
})