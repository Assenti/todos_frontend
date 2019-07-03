const express = require('express')
const app = express()
const morgan = require('morgan')
const path = require('path')
const port = process.env.PORT || 8080

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'dist')))
app.listen(port, () => console.log('App started'))