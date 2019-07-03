const express = require('express')
const app = express()
const morgan = require('morgan')
const path = require('path')

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'dist')))
app.listen(8080, () => console.log('App started'))