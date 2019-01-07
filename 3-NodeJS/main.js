const http = require('http')
const fs = require('fs')
const url = require('url')
const qs = require('querystring')

let templateList = (fileList) => {
  let list = '<ul>'
  let i = 0
  while(i < fileList.length) {
    list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
    i++
  }
  list += '</ul>'
  return list
}

let templateHTML = (title, list, desc) => {
  return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create"> Create </a>
    <h2>${title}</h2>
    <p>${desc}</p>
    </body>
    </html>
  `
}

let app = http.createServer((request,response) => {
  let _url = request.url
  let pathName = url.parse(_url, true).pathname
  let queryData = url.parse(_url, true).query

  if(pathName === '/'){
    if(queryData.id === undefined){
      fs.readdir('./data', (error, fileList) => {
        let title = 'Welcome'
        let description = 'Hello, Node.js'
        let list = templateList(fileList)
        let template = templateHTML(title, list, description)
        response.writeHead(200)
        response.end(template)
      })
    } else {
      fs.readdir('./data', (error, fileList) => {
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
          let title = queryData.id
          let list = templateList(fileList)
          let template = templateHTML(title, list, description)
          response.writeHead(200)
          response.end(template)
        })
      })
    }
  } else if (pathName === '/create') {
    fs.readdir('./data', (error, fileList) => {
      let title = 'WEB - Create'
      let list = templateList(fileList)
      let template = templateHTML(title, list, `
        <form action="http://localhost:3000/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>`)
      response.writeHead(200)
      response.end(template)
    })
  } else if (pathName === '/create_process') {
    let body = ''
    request.on('data', function(data){
          body = body + data;
      })
    request.on('end', function(){
      let post = qs.parse(body);
      let title = post.title;
      let description = post.description
    });

    response.writeHead(200)
    response.end('success')

  } else {
    response.writeHead(404)
    response.end('Page Not Found!')
  }
})

  app.listen(3000, () => {
    console.log("Server is running...")
  })
