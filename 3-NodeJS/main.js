const http = require('http')
const url = require('url')
const fs = require('fs')
let app = http.createServer((request,response) => {
    let _url = request.url
    let queryData = url.parse(_url, true).query
    console.log(queryData.id)
    if(_url == '/'){
      _url = '/index.html'
    }
    if(_url == '/favicon.ico'){
      response.writeHead(404)
      response.end()
      return

    }
    response.writeHead(200)
    // response.end(fs.readFileSync(__dirname + _url))
    response.end(queryData.id)

})
app.listen(3000, () => {
  console.log('Server is running...')
})
