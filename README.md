# VoxEngine Stubs

[![npm](https://img.shields.io/npm/v/@ama-team/voxengine-stubs.svg?style=flat-square)](https://www.npmjs.com/package/@ama-team/voxengine-stubs)
[![CircleCI/Master](https://img.shields.io/circleci/project/github/ama-team/voxengine-stubs/master.svg?style=flat-square)](https://circleci.com/gh/ama-team/voxengine-stubs/tree/master)
[![Coveralls/Master](https://img.shields.io/coveralls/ama-team/voxengine-stubs/master.svg?style=flat-square)](https://coveralls.io/github/ama-team/voxengine-stubs?branch=master)
[![Scrutinizer/Master](https://img.shields.io/scrutinizer/g/ama-team/voxengine-stubs/master.svg?style=flat-square)](https://scrutinizer-ci.com/g/ama-team/voxengine-stubs)
[![Code Climate](https://img.shields.io/codeclimate/github//ama-team/voxengine-stubs.svg?style=flat-square)](https://codeclimate.com/github/ama-team/voxengine-stubs)

This repository contains stubs for VoxEngine-specific global objects to
help in testing VoxImplant applications.

## Installation

```bash
npm i @ama-team/voxengine-stubs
```

## Usage

Library has main entrypoint:

```js
var Stubs = require('@ama-team/voxengine-stubs')
```

It exposes several methods: `.setup()`, `.install()`, 
`.uninstall()`, `.reset()` and `.flush()`. First three are
terribly self-explanatory:

```js
beforeEach(function() {
  Stubs.setup({global: {allure: {enabled: true}}})
  Stubs.install()
})
afterEach(function() {
  Stubs.uninstall()
})
```

Reset and flush are different things. When dealing with stubs like
Logger, you'll want to a) save what's been in there (that's `.flush()` 
method) and b) clear that before every test (and that's `.reset()`).
Reset method is a little bit redundant if you constantly call install 
and uninstall methods, but may come handy in hard cases. `.uninstall()`
method calls `.flush()` automatically, so usually you won't need to 
call it either.

## Configuration

There are four levels of configuration:

- Stub defaults
- Global defaults
- Global configuration
- Stub configuration

When it comes to work, all three levels are recursively merged into 
one, and lower level keys take precedence of upper ones. Defaults are
hard-boiled inside library and can't be changed, while the latter two
levels are configured as single object:

```js
Stubs.setup({
  global: {
    allure: {
      enabled: true
    }
  },
  Logger: {
    allure: {
      filename: 'voxengine.log'
    }
  }
})
```

## Sinon integration

Every stubbed function is wrapped in `Sinon.spy`, so you may call
something like `Logger.write.getCall(0).args[0]` in your tests without
any hassle.

Spies are recreated on every reset call, so calls don't accumulate.

## Per-stub work

Sometimes you will need to work with stubs directly. Most of the stubs
have corresponding `._setup()`, `._reset()` and `._flush()` methods 
that practically do the same thing you expect.

## Logger

Logger saves passed data to internal state and flushes it as
`voxengine.log` Allure attachment.

It's configuration schema is:

```yaml
allure:
  enabled: true
  filename: voxengine.log
  mimeType: text/plain
```

## VoxEngine

VoxEngine stubs `.terminate`, `.customData`, `.addEventListener` and 
`.removeEventListener` functions. You can use `._emit(event)` function
to invoke event raise.

Configuration:
```yaml
allure:
  enabled: true
  events:
    filename: events.yml
    mimeType: application/x-yaml
  listeners:
    filename: listeners.yml
    mimeType: application/x-yaml
  customData:
    filename: custom-data.yml
    mimeType: application/x-yaml
customData:
  default: ''
terminate:
  # Whether to throw on second VoxEngine.terminate call
  throwOnMultipleCalls: false
  # Whether to throw if `this` is lost. Such call may result in
  # undesired behavior in VoxEngine.
  throwOnLostContext: true
```

## Net

Only HTTP part has been stubbed yet.

```yaml
allure:
  enabled: true
  pattern: http-interaction-%d.yml
  mimeType: application/yaml
# list
http:
  # list of HttpRequestResult-alike structures
  # example:
  #   code: 200
  #   headers:
  #     - key: Server
  #       value: elasticsearch/5.5.2
  #   raw_headers: |
  #     Server: elasticsearch/5.5.2
  #   text: '{"acknowledged":true}'
  responses: []
  # whether to throw when last response have been reached or
  # just start from beginning
  roundRobin: false
```

Every response may have a matcher - function that will accept url and
options and will return true or false:

```js
var response = {
  code: 403,
  matcher: function (url, options) {
    return url === 'http://host.tld/protected' && options.method === 'POST'
  }
}
```

Every response may specify a delay function that will return a promise:

```js
var response = {
  code: 200,
  delay: function() {
    return new Promise(function (resolve) { 
      setTimeout(resolve, 20)
     })
  }
}
````

## AppEvents and CallEvents

Both of these namespace have been stubbed. You can create events 
yourself by just calling `new AppEvents.Something({property: value})`
constructor. Events come with some dumb defaults, so most of the time
you will have correct types even if you don't feed constructor with
anything.

## Hey, i don't see X in that list!

That's probably because i had no time to implement it. Pull requests
are appreciated.

## Allure integration

Currently all flushing boils down to saving Allure attachments if it's
turned on and is present as `allure` global object. [Allure][] is a
beautiful reporting tool made just for case like this: collect all
data about tests and present it in beautiful view. If you haven't 
got a chance to get acquainted with it earlier, do it now, because it
will save you tons of testing time.

## License

MIT

## Dev branch state

[![CircleCI/Dev](https://img.shields.io/circleci/project/github/ama-team/voxengine-stubs/dev.svg?style=flat-square)](https://circleci.com/gh/ama-team/voxengine-stubs/tree/dev)
[![Coveralls/Dev](https://img.shields.io/coveralls/ama-team/voxengine-stubs/dev.svg?style=flat-square)](https://coveralls.io/github/ama-team/voxengine-stubs?branch=dev)
[![Scrutinizer/Dev](https://img.shields.io/scrutinizer/g/ama-team/voxengine-stubs/dev.svg?style=flat-square)](https://scrutinizer-ci.com/g/ama-team/voxengine-stubs)

  [allure]: https://github.com/allure-framework/allure2
