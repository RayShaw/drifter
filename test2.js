// const fs = require('fs')
// fs.readFile('fileA.json', 'utf-8', function (err, data) {
//     if (err) throw err
//     console.log(data)
//     fs.readFile('fileB.json', 'utf-8', function (err, data) {
//         if (err) throw err
//         console.log(data)
//     })
// })

// fs.readFile('fileC.json', 'utf-8', function (err, data) {
//     if (err) throw err
//     console.log(data)
// })

// console.log('hello')



// var readFile = require('fs-readfile-promise');

// readFile('fileA.json')
//     .then(function (data) {
//         console.log(data.toString());
//     })
//     .then(function () {
//         return readFile('fileB.json');
//     })
//     .then(function (data) {
//         console.log(data.toString());
//     })
//     .catch(function (err) {
//         console.log(err);
//     });



// var fetch = require('node-fetch')

// function* gen() {
//     let url = 'https://api.github.com/users/github'
//     let result = yield fetch(url)
//     console.log(result.bio)
// }

// var g = gen()
// var result = g.next()
// // console.log(result.value)

// result.value.then(function (data) {
//     // console.log(data.json())
//     return data.json()
// }).then(function (data) {
//     g.next(data)
// })


// fetch('https://api.github.com/users/github')
//     .then(function (res) {
//         return res.json()
//     }).then(function (json){
//         console.log(json.bio)
//     })



// var fs = require('fs')
// var Thunk = function (fileName) {
//     return function (callback) {
//         return fs.readFile(fileName, 'utf-8', callback);
//     };
// };

// // var readFileThunk = Thunk('fileA.json');
// // readFileThunk(function (err, data) {
// //     console.log(data)
// // });

// var readFileThunk = Thunk('fileA.json')(function (err, data) {
//     console.log(data)
// });




// var fs = require('fs');
// var thunkify = require('thunkify');
// var readFileThunk = thunkify(fs.readFile);

// var gen = function* () {
//     var r1 = yield readFileThunk('fileA.json');
//     console.log(r1.toString());
//     var r2 = yield readFileThunk('fileB.json');
//     console.log(r2.toString());
//     var r3 = yield readFileThunk('fileC.json');
//     console.log(r3.toString());

// };

// // var g = gen();
// // var r1 = g.next();
// // r1.value(function (err, data) {
// //     if (err) throw err;
// //     var r2 = g.next(data);
// //     r2.value(function (err, data) {
// //         if (err) throw err;
// //         g.next(data);
// //     });
// // });


// function run(fn) {
//     var gen = fn();

//     function next2(err, data) {
//         var result = gen.next(data);
//         if (result.done) return;
//         result.value(next2);
//     }

//     next2();
// }
// run(gen);















// var fs = require('fs');

// var readFile = function (fileName) {
//     return new Promise(function (resolve, reject) {
//         fs.readFile(fileName, function (error, data) {
//             if (error) return reject(error);
//             resolve(data);
//         });
//     });
// };

// var gen = function* () {
//     var f1 = yield readFile('fileA.json');
//     var f2 = yield readFile('fileB.json');
//     console.log(f1.toString());
//     console.log(f2.toString());
// };


// // var g = gen();
// // g.next().value.then(function(data){
// //     g.next(data).value.then(function(data){
// //         g.next(data)
// //     })
// // })


// function run(gen) {
//     var g = gen();
//     function next2(data) {
//         var result = g.next(data);
//         if (result.done) return result.value;
//         result.value.then(function (data) {
//             next2(data);
//         });
//     }
//     next2();
// }
// run(gen);










// var fs = require('fs')
// var co = require('co')

// var readFile = function (fileName){
//   return new Promise(function (resolve, reject){
//     fs.readFile(fileName, function(error, data){
//       if (error) return reject(error);
//       resolve(data);
//     });
//   });
// };

// var gen = function* () {
//   var f1 = yield readFile('fileA.json');
//   var f2 = yield readFile('fileB.json');
//   console.log(f1.toString());
//   console.log(f2.toString());
// };

// co(gen)


// co(function*(){
//     var res = yield [
//         readFile('fileC.json'),
//         readFile('fileB.json')
//     ]
//     console.log(res.toString())
//     console.log('hello')
// })










// const co = require('co');
// const fs = require('fs');

// const stream = fs.createReadStream('./text.txt');


// let valjeanCount = 0

// co(function* () {
//     while (true) {
//         const res = yield Promise.race([
//             new Promise(resolve => stream.once('data', resolve)),
//             new Promise(resolve => stream.once('end', resolve)),
//             new Promise((resolve, reject) => stream.once('error', reject))
//         ])
//         if (!res) break

//         stream.removeAllListeners('data');
//         stream.removeAllListeners('end');
//         stream.removeAllListeners('error');
//         valjeanCount += (res.toString().match(/h/ig) || []).length;
//     }
//     console.log('count:', valjeanCount);
// })










// var fs = require('fs')

// var readFile = function (fileName){
//   return new Promise(function (resolve, reject){
//     fs.readFile(fileName, function(error, data){
//       if (error) return reject(error);
//       resolve(data);
//     });
//   });
// };

// var asyncReadFile = async function () {
//   var f1 = await readFile('fileA.json');
//   var f2 = await readFile('fileB.json');
//   console.log(f1.toString());
//   console.log(f2.toString());
// };

// asyncReadFile()










// function timeout(ms) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms, 'hi')
//     })
// }


// async function timeout(ms) {
//     return await new Promise((resolve) => {
//         setTimeout(resolve, ms, 'hi')
//     })
// }

// async function asyncPrint(value, ms) {
//     let hi = await timeout(ms)
//     console.log(hi)
//     console.log(value)
// }

// asyncPrint('hello world', 2000)











// const fetch = require('node-fetch')

// async function getTitle(url) {
//     let response = await fetch(url);
//     let html = await response.text();
//     return html.match(/<title>([\s\S]+)<\/title>/i)[1];
// }
// getTitle('https://tc39.github.io/ecma262/').then(console.log)








// function timeout(ms, str) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms, str)
//     })
// }

// async function asyncPrint(){
//     console.log(await timeout(1000, 'hello1'))
//     console.log(await timeout(1000, 'hello2'))
//     console.log(await Promise.all([timeout(1000, 'hello3'), timeout(1000, 'hello4')]))
//     let onePromise = timeout(1000, 'hello5')
//     let twoPromise = timeout(1000, 'hello6')
//     console.log(await onePromise)
//     console.log(await twoPromise)
// }

// asyncPrint()