/*
 * @Descripttion : 
 * @Author       : zhangming
 * @Date         : 2021-06-02 10:54:30
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-02 14:53:46
 */

/**
 * @description: https://developer.okta.com/blog/2018/09/13/build-and-understand-express-middleware-through-examples
 * @param {*}
 * @return {*}
 */

// const express = require('express');
// const app = express();

// const requireJsonContent = () => {
//   return (req, res, next) => {
//     if (req.headers['content-type'] !== 'application/json') {
//         res.status(400).send('Server requires application/json')
//     } else {
//       next()
//     }
//   }
// }

// app.get('/', (req, res, next) => {
//   res.send('Welcome Home');
// });

// app.post('/', requireJsonContent(), (req, res, next) => {
//   res.send('You sent JSON');
// })

// app.listen(3000);

/**
 * @description: https://www.webtips.dev/how-to-make-your-very-own-express-middleware
 * @param {*}
 * @return {*}
 */

const express = require('express');
const app = express();

/**
 * @description: ex1
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {*}
 */
// const logOne = (req, res, next) => { 
//     console.log('1️⃣');
//     next();
// };

// const logTwo = (req, res, next) => { 
//     console.log('2️⃣');
//     next();
// };

// const logThree = (req, res, next) => { 
//     console.log('3️⃣');
//     next();
// };

// app.use(logThree);
// app.use(logTwo);
// app.use(logOne);


/**
 * @description: ex2
 * @param {*}
 * @return {*}
 */

const openFirstChest = (req, res, next) => {
    console.log('💸');
    next();
};

const openSecondChest = (req, res, next) => {
    console.log('💰');
    next();
};

const congratulations = (req, res, next) => {
    res.send('You\'ve found the secret treasure 🎉');
};

app.get('/treasury', [openFirstChest, openSecondChest, congratulations]);

app.listen(3000);