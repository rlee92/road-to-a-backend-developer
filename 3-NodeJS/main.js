const http = require('http')
const fs = require('fs')
const url = require('url')
const qs = require('querystring')
const path = require('path')
const template = require('./lib/template.js')

let app = http.createServer((request,response) => {
  let _url = request.url
  let pathName = url.parse(_url, true).pathname
  let queryData = url.parse(_url, true).query

  // Base Path
  if (pathName === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', (error, fileList) => {
        let title = 'Welcome'
        let description = 'Hello, Node.js'
        let list = template.list(fileList)
        let createBtn = `<a href="/create"> Create </a>`
        let page = template.html(title, list, description, createBtn)

        response.writeHead(200)
        response.end(page)
      })
    } else {
      fs.readdir('./data', (error, fileList) => {
        let filteredId = path.parse(queryData.id).base
        fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
          let title = queryData.id
          let list = template.list(fileList)
          let ctrlBtn = `
          <a href="/create">Create</a>
          <a href="/update?id=${title}">Update</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <input type="submit" value="Delete">
          </form>
          `
          let page = template.html(title, list, description, ctrlBtn)

          response.writeHead(200)
          response.end(page)
        })
      })
    }

  // Create Page
  } else if (pathName === '/create') {
    fs.readdir('./data', (error, fileList) => {
      let title = 'WEB - Create'
      let list = template.list(fileList)
      let createForm = `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p><textarea name="description" placeholder="description"></textarea></p>
        <p><input type="submit"></p>
      </form>
      `
      let page = template.html(title, list, createForm, '')

      response.writeHead(200)
      response.end(page)
    })

  // Create Page Handler
  } else if (pathName === '/create_process') {
    let body = ''

    request.on('data', (data) => {
      body += data
    })

    request.on('end', _ => {
      let post = qs.parse(body)
      let title = post.title
      let description = post.description

      fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
        response.writeHead(302, {Location: `/?id=${title}`})
        response.end()
      })
    })

  // Update Page
  } else if (pathName === '/update') {
    fs.readdir('./data', (error, fileList) => {
      let filteredId = path.parse(queryData.id).base
      fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        let title = queryData.id
        let list = template.list(fileList)
        let updateForm = `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p><textarea name="description" placeholder="description">${description}</textarea></p>
          <p><input type="submit"></p>
        </form>
        `
        let ctrlBtn = `<a href="/create"> Create </a> <a href="/update?id=${title}"> Update </a>`
        let page = template.html(title, list, updateForm, ctrlBtn)

        response.writeHead(200)
        response.end(page)
      })
    })

  // Update Page Handler
  } else if (pathName === '/update_process') {
    let body = ''

    request.on('data', (data) => {
      body += data
    })
    request.on('end', _ => {
      let post = qs.parse(body)
      let title = post.title
      let id = post.id
      let description = post.description

      fs.rename(`data/${id}`, `data/${title}`, (err) => {
        fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
          response.writeHead(302, {Location: `/?id=${title}`})
          response.end()
        })
      })
    })

  // Delete Page Handler
  } else if (pathName === '/delete_process') {
    let body = ''

    request.on('data', (data) => {
      body += data
    })
    request.on('end', _ => {
      let post = qs.parse(body)
      let id = post.id
      let filteredId = path.parse(id).base
      fs.unlink(`./data/${filteredId}`, (err) => {
        response.writeHead(302, {Location: `/`})
        response.end()
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
