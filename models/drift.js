const redis = require('redis')
const uuid = require('uuid')

// 检查用户是否超过仍瓶次数限制
async function checkThrowTimes(owner) {
    const client = redis.createClient('6379', '127.0.0.1')
    try {

        // 到2号数据库检查用户是否超过扔瓶次数限制
        await new Promise(resolve => {
            client.SELECT(2, (err, result) => resolve(result))
        })
        // 获取该用户捡瓶次数
        let throwTimes = await new Promise(resolve => {
            client.GET(owner, (err, result) => { resolve(result) })
        })
        if (throwTimes >= 10) {
            return { code: 0, msg: "今天扔瓶子的机会已经用完啦~" }
        }
        // 扔瓶次数加 1
        await new Promise(resolve => {
            client.INCR(owner, (err, result) => resolve(result))
        })

        // 检查是否是当天第一次扔瓶子
        // 若是，则设置记录该用户扔瓶次数键的生存期为 1 天
        // 若不是，生存期保持不变
        let ttl = await new Promise(resolve => {
            client.TTL(owner, (err, result) => resolve(result))
        })
        if (ttl === -1) {
            await new Promise(resolve => {
                client.EXPIRE(owner, 86400, (err, result) => resolve(result))
            })
        }

        return { code: 1, msg: ttl }

    } catch (error) {
        console.log(error)
        return { code: 0, msg: "出错了，过会儿再试试吧！！" }
    } finally {
        client.QUIT()
    }
}

// 扔一个瓶子
async function throwOneBottle(bottle) {
    // 为每个漂流瓶随机生成一个 id
    let bottleId = uuid.v4()
    let type = { male: 0, female: 1 }
    bottle.time = bottle.time || Date.now()
    const client = redis.createClient('6379', '127.0.0.1')

    try {
        // 最Promise简单写法
        // await new Promise(resolve => {
        //     client.SELECT(type[bottle.type], resolve)
        // })
        // Promise普通写法
        let result = await new Promise((resolve, reject) => {
            client.SELECT(type[bottle.type], function (error, result) {
                return error ? reject(error) : resolve(result)
            })
        })
        // console.log('selectResult', result)

        // 以 hash 类型保存漂流瓶对象
        result = await new Promise((resolve, reject) => {
            client.HMSET(bottleId, bottle, function (error, result) {
                return error ? reject(error) : resolve(result)
            })
        })
        // console.log('hmsetResult', result)

        // 设置漂流瓶生存期
        result = await new Promise((resolve, reject) => {
            client.PEXPIRE(
                // 漂流瓶有效期 要减去上一次被捡起时候的有效期
                bottleId, 5 * 60 * 1000 - (Date.now() - bottle.time),
                function (error, result) {
                    return error ? reject(error) : resolve(result)
                })
        })
        // console.log('expireResult', result)

        return { code: 1, msg: 'OK' }

    } catch (error) {
        console.log(error)
        return { code: 0, msg: "出错了，过会儿再试试吧！" }
    } finally {
        // 释放连接
        client.QUIT()
    }
}

module.exports.throw = bottle => {
    return new Promise((resolve, reject) => {
        checkThrowTimes(bottle.owner).then(result => {
            if (result.code === 0) {
                resolve(result)
            }
        })

        throwOneBottle(bottle).then(result => {
            resolve(result)
        })
    })
}

// 检查用户是否超过捡瓶次数限制
async function checkPickTimes(user) {
    const client = redis.createClient('6379', '127.0.0.1')
    try {

        // 到3号数据库检查用户是否超过扔瓶次数限制
        await new Promise(resolve => {
            client.SELECT(3, (err, result) => resolve(result))
        })
        // 获取该用户捡瓶次数
        let pickTimes = await new Promise(resolve => {
            client.GET(user, (err, result) => { resolve(result) })
        })
        if (pickTimes >= 10) {
            return { code: 0, msg: "今天捡瓶子的机会已经用完啦~" }
        }
        // 捡瓶次数加 1
        await new Promise(resolve => {
            client.INCR(user, (err, result) => resolve(result))
        })

        // 检查是否是当天第一次捡瓶子
        // 若是，则设置记录该用户捡瓶次数键的生存期为 1 天
        // 若不是，生存期保持不变
        let ttl = await new Promise(resolve => {
            client.TTL(user, (err, result) => resolve(result))
        })
        if (ttl === -1) {
            await new Promise(resolve => {
                client.EXPIRE(user, 86400, (err, result) => resolve(result))
            })
        }

        return { code: 1, msg: ttl }

    } catch (error) {
        console.log(error)
        return { code: 0, msg: "出错了，过会儿再试试吧！！" }
    } finally {
        client.QUIT()
    }
}
async function pickOneBottle(info) {

    let type = { all: Math.round(Math.random()), male: 0, female: 1 };
    info.type = info.type || 'all';

    const client = redis.createClient('6379', '127.0.0.1')

    try {
        let result = await new Promise((resolve, reject) => {
            client.SELECT(type[info.type], function (err, result) {
                return err ? reject(err) : resolve(result)
            })
        })
        // console.log('selectResult:', result)

        // 随机返回一个漂流瓶 id
        let bottleId = await new Promise((resolve, reject) => {
            client.RANDOMKEY(function (err, result) {
                return err ? reject(err) : resolve(result)
            })
        })
        // console.log('bottleId', bottleId)

        if (!bottleId) {
            // return { code: 0, msg: "大海空空如也..." }
            // 设定当大海中没有漂流瓶时，也只能捡到海星
            return { code: 1, msg: "海星" }
        }

        // 根据漂流瓶 id 取到漂流瓶完整信息
        let bottle = await new Promise((resolve, reject) => {
            client.HGETALL(bottleId, function (err, result) {
                return err ? reject(err) : resolve(result)
            })
        })
        // console.log('bottle', bottle)

        // 从 Redis 中删除该漂流瓶
        result = await new Promise((resolve, reject) => {
            client.DEL(bottleId, function (err, result) {
                return err ? reject(err) : resolve(result)
            })
        })
        // console.log('delResult', result)

        return { code: 1, msg: bottle }


    } catch (error) {
        console.log(error)
        return { code: 0, msg: "出错了，过会儿再试试吧！" }
    } finally {
        client.QUIT()
    }

}


module.exports.pick = (info) => {
    return new Promise((resolve, reject) => {
        checkPickTimes(info.user).then(result => {
            if (result.code === 0) {
                resolve(result)
            }
        })

        // 20%获得海星
        if (Math.random() <= 0.2) {
            resolve({ code: 1, msg: "海星" })
        }

        pickOneBottle(info).then(result => {
            resolve(result)
        })


    })
}
