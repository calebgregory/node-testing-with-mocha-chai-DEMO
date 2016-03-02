'use strict'

const fs = require('fs')
const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const USERS_FILE = path.resolve(__dirname, '..', 'users.json')

app.set('port', process.env.PORT || 3000)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const getUsers = (req, res) =>
  fs.readFile(USERS_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache')
    res.status(200).json(JSON.parse(data))
  })
app.get('/api/users', getUsers)

const postUsers = (req, res) =>
  fs.readFile(USERS_FILE, (err, data = []) => {
    if(err) throw err
    const oldUsers = JSON.parse(data)
    const nextUsers = oldUsers.concat(req.body)
    fs.writeFile(USERS_FILE, JSON.stringify(nextUsers, null, 4), (err) => {
      res.setHeader('Cache-Control', 'no-cache')
      res.status(200).json(nextUsers)
    })
  })
app.post('/api/users', postUsers)

if (!module.parent) {
  const server = app.listen(app.get('port'), (err) => {
    if (err) throw err;
    console.log(`(>'')>*<(''<) App listening on http://localhost:${server.address().port}.`)
  })
}

module.exports = app
