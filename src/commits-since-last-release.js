/*
  returns something like
  { name: 'ci-publish',
  versions: [ '1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.1.0' ],
  timestamps:
   [ '2016-01-07T20:49:10.977Z',
     '2016-01-07T20:54:08.557Z',
     '2016-01-07T20:59:05.577Z',
     '2016-01-07T21:15:00.188Z',
     '2016-01-07T21:15:40.930Z',
     '2016-01-08T03:27:18.522Z' ],
  'dist-tags': { latest: '1.1.0' } }
*/
var name = require(process.cwd() + '/package.json').name
var available = require('available-versions')
var changed = require('changed-log')

available({
  name: name
}).then(function (versions) {
  console.log(versions)
  var latest = versions['dist-tags'].latest
  console.log('latest version %s@%s', name, latest)
  return changed({
    name: name,
    from: latest
  }).then(function (report) {
    console.log('since then')
    report.print()
  })
})
