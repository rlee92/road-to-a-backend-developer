module.exports = {
  html: (title, list, desc, control) => {
    return `
      <!doctype html>
      <html>
      <head>
      <title>WEB - ${title}</title>
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
  },
  list: (fileList) => {
    let list = '<ul>'
    let i = 0
    while(i < fileList.length) {
      list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
      i++
    }
    list += '</ul>'
    return list
  }
}
