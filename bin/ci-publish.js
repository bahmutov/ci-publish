#!/usr/bin/env node

var npm = require('npm-utils')

function onError (err) {
  console.error(err)
  process.exit(-1)
}

npm.setAuthToken()
  .then(npm.publish)
  .catch(onError)
