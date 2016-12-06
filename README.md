# ci-publish
> Poor man's semantic release utility. Let the CI do the `npm publish` step after the build passes

[![NPM][ci-publish-icon] ][ci-publish-url]

[![Build status][ci-publish-ci-image] ][ci-publish-ci-url]

## Goal

Allow any CI to publish your module after tests pass, using your account to login.

Q: Why not use [semantic-release](https://github.com/semantic-release/semantic-release)?

A: Because it needs a lot of tweaking to setup on
[CircleCI](https://glebbahmutov.com/blog/how-to-setup-semantic-release-on-circle-ci/) or
[Gitlab](https://github.com/semantic-release/semantic-release/pull/77)

Q: But your package only does the "release" part without the "semantic" version upgrade?

A: Yeah :( I am sorry

Example: this own repo, see [.travis.yml](.travis.yml) file

## How to use

- Add as a dependency to your project `npm install --save-dev ci-publish`

- Login into your project's NPM registry

```
npm login --registry <registry url>
npm login --registry http://registry.npmjs.org
```

- Copy the token

The login step added a line to your `~/.npmrc` file looking something like this

    //registry.npmjs.org/:_authToken=00000000-0000-0000-0000-000000000000

Grab the auth token value `00000000-0000-0000-0000-000000000000` (older NPM proxies or
registries like [sinopia](https://www.npmjs.com/package/sinopia) might have an older
different token string format)

- Set the token as CI environment variable

Go to your CI project settings and add a new variable `NPM_TOKEN` with the value you
have just copied

- Add script command (optional)

Create a script command to run the publish, in your `package.json`

```json
{
    "scripts": {
        "ci-publish": "ci-publish"
    }
}
```

Now you can run the `ci-publish` logic from shell using `npm run ci-publish` command

You can avoid adding a script command if you use explicit command in your CI files,
like `$(npm bin)/ci-publish`

- Add a command to run on your CI after the tests pass.

### Travis CI

Add `after_success` section to your `.travis.yml` file


```yaml
after_success:
    - npm run ci-publish || true
```

Every time you want to publish your module to the registry after the tests pass,
just increment the package version and push the code. The CI will pass the tests and will
try to run `ci-publish`. This will add the auth token to the CI's "user" profile,
allowing it to publish under your authority.
If the package has a new version, it will be published. If you have not
incremented the version number, this step fail,
but we do not fail the build step by using `|| true`

**warning:** The publish will fail if there are multiple Travis jobs trying to publish at the same
time, which happens if you test on multiple NodeJS versions. Maybe use a different CI engine for
the publish?

### Gitlab

Add a new `deploy` job to your `.gitlab-ci.yml` file. For example

```yaml
before_script:
  - npm install
stages:
  - test
  - deploy
npm_test:
  stage: test
  script:
    - npm test
release:
  stage: deploy
  script:
    - echo Running release
    - npm run ci-publish || true
```

Gitlab can run multiple test jobs in parallel and then a single release job.

## Typical output

For example, when successfully publishing this module, Travis produced this output

    $ npm run ci-publish || true
    > ci-publish@1.0.0 ci-publish /home/travis/build/bahmutov/ci-publish
    > node bin/ci-publish.js
    //registry.npmjs.org/:_authToken=${NPM_TOKEN}
    saved /home/travis/.npmrc
    $ npm publish || true
    * ci-publish@1.0.0

## Extra resources

* [Increment package version on demand using semantic commits](https://github.com/bahmutov/next-ver)

* [Deploying with npm private modules][deploying post]

[deploying post]: http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules

* If you need to debug NPM commands, just enable verbose NPM logging

```sh
npm_config_loglevel=verbose $(npm bin)/ci-publish
```

### Small print

Author: Gleb Bahmutov &copy; 2015

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/ci-publish/issues) on Github

## MIT License

Copyright (c) 2015 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[ci-publish-icon]: https://nodei.co/npm/ci-publish.svg?downloads=true
[ci-publish-url]: https://npmjs.org/package/ci-publish
[ci-publish-ci-image]: https://travis-ci.org/bahmutov/ci-publish.svg?branch=master
[ci-publish-ci-url]: https://travis-ci.org/bahmutov/ci-publish
