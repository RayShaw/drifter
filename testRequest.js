const request = require('request')


// for (let i = 0; i < 5; i++) {
//     (function (i) {
//         request.post({
//             url: "http://localhost:3003",
//             json: { "owner": "bottle" + i, "type": "female", "content": "content" + i }
//         }, function (err, res, body) {
//             console.log('error:', err)
//             console.log('statusCode:', res && res.statusCode)
//             console.log('body:', body)
//         })
//     })(i)
// }

// request.get({
//     url: "http://localhost:3003?user=12&type=female",
// }, function (err, res, body) {
//     console.log('error', err)
//     console.log('statusCode:', res && res.statusCode)
//     console.log('body', body)
// })


// request.get({
//     url: "http://localhost:3003/bottle/all/12",
// }, function (err, res, body) {
//     console.log('error', err)
//     console.log('statusCode:', res && res.statusCode)
//     console.log('body', body)
// })

// request.get({
//     url: 'http://localhost:3003/bottle/5948d2db3fc6d75927eadde6'
// }, function (err, res, body) {
//     console.log('error', err)
//     console.log('statusCode:', res && res.statusCode)
//     console.log('body', body)
// })



// request.put({
//     url: 'http://localhost:3003/bottle/5948d2db3fc6d75927eadde6',
//     json: { user: '12', content: 'testeststest123' }
// }, function (err, res, body) {
//     console.log('error', err)
//     console.log('statusCode:', res && res.statusCode)
//     console.log('body', body)
// })



request.delete({
    url: 'http://localhost:3003/bottle/5948d3ea9bfc2659e15ed9a2'
}, function (err, res, body) {
    console.log('error', err)
    console.log('statusCode:', res && res.statusCode)
    console.log('body', body)
})