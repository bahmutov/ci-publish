# ci-publish
> Poor man's semantic release utility. Let the CI do the `npm publish` step after the build passes

## How to use

- Add as a dependency to your project `npm install --save-dev ci-publish`

- Login into your project's NPM registry

    npm login --registry <registry url>
    npm login --registry http://registry.npmjs.org

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

- Add a command to run on your CI after the tests pass. For example, on Travis CI

    after_success:
        - npm run ci-publish || true
        - npm publish || true

Every time you want to publish your module to the registry after the tests pass, 
just increment the package version and push the code. The CI will pass the tests and will
try to run `ci-publish`. This will add the auth token to the CI's "user" profile,
allowing it to publish under your authority. 

Then we run the `npm publish` command using standard NPM tool.
If the package has a new version, it will be published. If you have not
incremented the version number, this step fail, 
but we do not fail the build step by using `|| true`

## Extra resources

* [Deploying with npm private modules][deploying post]

[deploying post]: http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules

### Small print

Author: Gleb Bahmutov &copy; 2015

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/obind/issues) on Github

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
