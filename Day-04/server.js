const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
  if (req.url === '/api/hello') {
    // API
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Hello, World!' }))
  } else {
    // Static frontend (docs)
    let filePath = path.join(
      __dirname,
      'public',
      req.url === '/' ? 'index.html' : req.url
    )
    let ext = path.extname(filePath)
    let contentType = 'text/html'

    switch (ext) {
      case '.js':
        contentType = 'application/javascript'
        break
      case '.css':
        contentType = 'text/css'
        break
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404)
        res.end('Not Found')
      } else {
        res.writeHead(200, { 'Content-Type': contentType })
        res.end(content, 'utf-8')
      }
    })
  }
})

server.listen(3000, () => {
  console.log('Learning website running at http://localhost:3000')
})
