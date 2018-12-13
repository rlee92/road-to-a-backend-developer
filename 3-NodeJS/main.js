const http = require('http')
const fs = require('fs')
const url = require('url')

let app = http.createServer((request,response) => {
  let _url = request.url
  let pathName = url.parse(_url, true).pathname
  let queryData = url.parse(_url, true).query
  let title = queryData.id

  if(pathName === '/'){
    if(queryData.id === undefined){

      fs.readdir('./data', (error, fileList) => {
        let title = 'Welcome'
        let description = 'Hello, Node.js'
        let list = '<ul>'
        let i = 0;
        while(i < fileList.length) {
          list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
          i++
        }
        list = list + '</ul>'

        let template = `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        <h2>${title}</h2>
        <p>${description}</p>
        </body>
        </html>
        `
        response.writeHead(200)
        response.end(template)
      })


    } else {
      fs.readdir('./data', function(error, fileList){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = '<ul>';
        var i = 0;
        while(i < fileList.length){
          list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
          i = i + 1;
        }
        list = list+'</ul>';
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var template = `
          <!doctype html>
          <html>
          <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
          </head>
          <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <h2>${title}</h2>
          <p>${description}</p>
          </body>
          </html>
          `;
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
})

  app.listen(3000, () => {
    console.log("Server is running...")
  })
