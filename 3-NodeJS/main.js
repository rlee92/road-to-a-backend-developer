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

let templateHTML = (title, list, desc, control) => {
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
    ${control}
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
        let template = templateHTML(title, list, description, `<a href="/create"> Create </a>`)
        response.writeHead(200)
        response.end(template)
      })
    } else {
      fs.readdir('./data', (error, fileList) => {
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
          let title = queryData.id
          let list = templateList(fileList)
          let template = templateHTML(title, list, description, `<a href="/create"> Create </a> <a href="/update?id=${title}"> Update </a>`)
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
        <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
        <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
        <input type="submit">
        </p>
        </form>`, '')
        response.writeHead(200)
        response.end(template)
      })
    } else if (pathName === '/create_process') {
      let body = ''
      request.on('data', (data) => {
        body = body + data;
      })
      request.on('end', _ => {
        let post = qs.parse(body);
        let title = post.title;
        let description = post.description
        fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        })
      })
    } else if(pathName === '/update') {
      fs.readdir('./data', (error, fileList) => {
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
          let title = queryData.id
          let list = templateList(fileList)
          let template = templateHTML(title, list,
            `<form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
            <textarea name="description" placeholder="description" value=${description}></textarea>
            </p>
            <p>
            <input type="submit">
            </p>
            </form>
            `
          , `<a href="/create"> Create </a> <a href="/update?id=${title}"> Update </a>`)
          response.writeHead(200)
          response.end(template)
        })
      })
    } else if(pathName === '/update_process') {
      let body = ''
      request.on('data', (data) => {
        body = body + data;
      })
      request.on('end', _ => {
        let post = qs.parse(body);
        let title = post.title;
        let id = post.id
        let description = post.description
        fs.rename(`data/${id}`, `data/${title}`, (err) => {
          fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
        })
      })
    } else {
      response.writeHead(404)
      response.end('Page Not Found!')
    }
  })

  app.listen(3000, () => {
    console.log("Server is running...")
  })
