# Husky Configuration [![Build Status](https://travis-ci.org/rjoydip/husky-conf.svg?branch=master)](https://travis-ci.org/rjoydip/husky-conf)

> Configure husky in your project.

## Install

```bash
$ npm i -g husky-conf
```

## Usage

```
  Configure husky for your project.

  Usage:
    $ husky-conf <option>

  Options:
      init    i  Initialize husky
      add    a  Add husky hook
      remove    r  Remove existing husky hook
      version    v  Check version of husky-conf

  Examples:
    $ husky-conf --help
    $ husky-conf version
    $ husky-conf init
    $ husky-conf add commit-msg
    $ husky-conf remove commit-msg
```

## Hooks

Husky supports all git hooks (https://git-scm.com/docs/githooks). Simply add the corresponding `npm script` to your `package.json`.

| Git hook | npm script |
| -------- | ---------- |
| applypatch-msg | applypatchmsg |
| commit-msg | commitmsg |
| post-applypatch | postapplypatch |
| post-checkout | postcheckout |
| post-commit | postcommit |
| post-merge | postmerge |
| post-receive | postreceive |
| post-rewrite | postrewrite |
| post-update | postupdate |
| pre-applypatch | preapplypatch |
| pre-auto-gc | preautogc |
| pre-commit | precommit |
| pre-push | prepush |
| pre-rebase | prerebase |
| pre-receive | prereceive |
| prepare-commit-msg | preparecommitmsg |
| push-to-checkout | pushtocheckout |
| update | update |

## Uninstall

```bash
$ npm uninstall -g husky-conf
```

## License

MIT © [Joydip Roy (rjoydip)](https://github.com/rjoydip/husky-conf/blob/master/license.md)
