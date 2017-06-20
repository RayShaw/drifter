// var request = require('request');

// for (var i = 1; i <= 10; i++) {
//     (function (i) {
//         request.get({
//             url: "http://127.0.0.1:3003",
//             json: { "appId": "appid" + i, "width": "", "height": "" }
//         });
//     })(i);
// }



// function asyncFunction() {
//     return new Promise(function (resolve, reject) {
//         setTimeout(function () {
//             resolve('Async Hello World')
//         }, 2000)
//     })
// }

// asyncFunction().then(value => {
//     console.log(value)
// }).catch(error => {
//     console.log(error)
// })


// f2(f1('result'))

// function f1(callback){
//     setTimeout(function(){
//         // f1的任务代码
//         console.log('f1')
//         callback()
//     }, 2000)
// }

// f1(f2)








// function f1(callback) {
//     setTimeout(() => {
//         callback()
//         console.log('f1')
//     }, 2000)
// }

// function f2() {
//     console.log('f2')
// }

// function f3(callback) {
//     setTimeout(() => {
//         callback()
//     }, 1000)
// }

// function f4() {
//     console.log('f4')
// }

// function f5() {
//     console.log('f6')
//     console.log('f7')
//     setTimeout(() => {
//         console.log('f5')
//         setTimeout(() => {
//             console.log('f10')
//         }, 1)
//     }, 1)
// }


// Promise.resolve().then(f5())
// f5()
// console.log('222')
// f1(f2)
// f3(f4)





// function f1(ms) {
//     return  new Promise( (resolve, reject) =>  {
//         setTimeout(resolve, ms, 'done')
//     })
// }


// f1(1000).then(value => {
//     console.log(value)
// })





// function* gen(x) {
//     let y = yield x + 2
//     return y
// }

// let g = gen(1)
// console.log(g.next())
// console.log(g.next())



// function* gen() {
//   yield 'hello'
//   yield 'world'
//   yield 'end'
//   return
// }

// var g = gen();
// var res = g.next();

// while(!res.done){
//   console.log(res.value);
//   res = g.next();
// }


var thunkify = require('thunkify');
var fs = require('fs');

var read = thunkify(fs.readFile);
read('package.json')(function(err, str){
  // ...
});