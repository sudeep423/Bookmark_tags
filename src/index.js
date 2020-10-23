const express = require('express')
require('./db/mongoose')
const tagRouter = require('./routers/tag')
const bookmarkRouter = require('./routers/bookmark')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(tagRouter)
app.use(bookmarkRouter)

app.listen(port, () => {
    console.log('server is on port ' + port)
})