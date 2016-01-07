#!/usr/bin/env node

var npmUtils = require('npm-utils')
var userHome = require('user-home')
var join = require('path').join
var npmrcFile = join(userHome, '.npmrc')
var fs = require('fs')

function updateNpmrc (add) {
  var contents = ''
  if (fs.existsSync(npmrcFile)) {
    contents = fs.readFileSync(npmrcFile, 'utf-8') + '\n'
  }
  if (contents.indexOf(add) !== -1) {
    console.log('npmrc file already has contents to add, skipping')
    return
  }
  contents += add
  fs.writeFileSync(npmrcFile, contents, 'utf-8')
  console.log('saved', npmrcFile)
}

function formUrlToken (str) {
  if (!process.env.NPM_TOKEN) {
    throw new Error('Cannot find NPM_TOKEN')
  }
  str = str.replace(/^http:/, '')
  return str + ':_authToken=${NPM_TOKEN}'
}

function printUrl (str) {
  console.log(str)
  return str
}

function setNpmToken () {
  return npmUtils.registryUrl()
    .then(formUrlToken)
    .then(printUrl)
    .then(updateNpmrc)
}

function onError (err) {
  console.error(err)
  process.exit(-1)
}

setNpmToken()
  .catch(onError)
