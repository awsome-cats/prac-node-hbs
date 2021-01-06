const express = require('express')
const app = express();
const hbs = require('hbs');
const fs = require('fs');

// views
app.set('view engine', 'hbs');
// partial: 分割するためにhbsの機能であるパーシャルを使用する
hbs.registerPartials(__dirname + '/views/partials/')
// helper: 重複する関数を定義
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
  // return 'something'
});
hbs.registerHelper('upperCase', text => {
  return text.toUpperCase();
})

// middleware

// 特定の処理w行うことができるよ nextはmiddleware内の処理の終わりを意味する
app.use((req, res, next) => {
  let now = new Date();
  let log = `${now}: ${req.method}: ${req.url}`
  console.log(log)
  // middlewareによってlogを残す機能を作成,その際そのlogは新たに作られるserver.logに書き込まれる
  fs.appendFile('server.log', log + '\n', err => {
    if (err) {
      console.log(err)
    }
  })
  next();
});

// app.getでいかなるページにアクセスするコードがあってもこのmiddlewareによってページ遷移するのはmaintenanseページになります。
app.use((req, res, next) => {
  res.render('maintenanse.hbs');
})

// Home(npm initを行ったフォルダー)からpublicフォルダーの静的ファイルにアクセスする(.html)
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page(topページ)',
    content: 'Welcome Home page'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page(アバウトページ)',
    content: 'コンテンツ1'
  })
})

app.listen(3000);