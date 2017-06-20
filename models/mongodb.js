const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/drifter', { server: { poolSize: 10 } })


// 定义漂流瓶模型，并设置数据存储到 bottles 集合
const bottleModel = mongoose.model('Bottle',
    new mongoose.Schema(
        {
            bottle: Array,
            message: Array
        }, {
            collection: 'bottles'
        }
    )
)

// 将用户捡到漂流瓶改变格式保存
module.exports.save = async (picker, _bottle) => {
    let bottle = { bottle: [], message: [] }
    bottle.bottle.push(picker)
    bottle.message.push([_bottle.owner, _bottle.time, _bottle.content])
    // add
    // return await new Promise((resolve, reject) => {
    //     bottleModel.create(bottle, function (err, result) {
    //         console.log(result)
    //         return err ? reject(err) : resolve(result)
    //     })
    // })
    return Promise.resolve(
        bottleModel.create(bottle)
    )
}

// 获取用户捡到的所有漂流瓶
module.exports.getAll = async user => {
    //find
    // return await new Promise((resolve, reject) => {
    //     bottleModel.find({ bottle: user }, function (err, result) {
    //         console.log(result)
    //         return err ? reject(err) : resolve({ code: 1, bottle: result })
    //     })
    // })

    return Promise.resolve(
        bottleModel.find({ bottle: user })
    )
}


// 获取特定 id 的漂流瓶
module.exports.getOne = async _id => {
    //findById
    // return await new Promise((resolve, reject) => {
    //     bottleModel.findById(_id, function (err, bottle) {
    //         return err ? reject({ code: 0, msg: "读取漂流瓶失败..." }) :
    //             resolve({ code: 1, msg: bottle })
    //     })
    // })

    return Promise.resolve(
        bottleModel.findById(_id)
    )
}


// 回复特定 id 的漂流瓶
module.exports.reply = async (_id, reply) => {
    reply.time = reply.time || Date.now();
    // 通过 id 找到要回复的漂流瓶
    let _bottle = await new Promise((resolve, reject) => {
        bottleModel.findById(_id, function (err, result) {
            resolve(result)
        })
    })
    var newBottle = {};
    newBottle.bottle = _bottle.bottle;
    newBottle.message = _bottle.message;
    // 如果捡瓶子的人第一次回复漂流瓶，则在 bottle 键添加漂流瓶主人
    // 如果已经回复过漂流瓶，则不再添加
    if (newBottle.bottle.length === 1) {
        newBottle.bottle.push(_bottle.message[0][0]);
    }
    // 在 message 键添加一条回复信息
    newBottle.message.push([reply.user, reply.time, reply.content]);
    // 更新数据库中该漂流瓶信息

    let result = await new Promise((resolve, reject) => {
        bottleModel.findByIdAndUpdate(_id, newBottle, function (err, bottle) {
            if (err) {
                reject({ code: 0, msg: "回复漂流瓶失败..." })
                // 成功时返回更新后的漂流瓶信息
            }
            resolve({ code: 1, msg: bottle })
        })
    })

    return result
}


// 删除特定 id 的漂流瓶
module.exports.delete = async _id => {
    // 通过 id 查找并删除漂流瓶
    // return await new Promise((resolve, reject) => {
    //     bottleModel.findByIdAndRemove(_id, function (err) {
    //         return err ? reject({ code: 0, msg: "删除漂流瓶失败..." }) :
    //             resolve({ code: 1, msg: "删除成功！" })
    //     })
    // })

    return Promise.resolve(
        bottleModel.findOneAndRemove(_id)
    )
}