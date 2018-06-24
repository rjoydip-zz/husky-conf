"use strict"
const path = require("path")
const meow = require("meow")
const { pullAt, merge, omit, find } = require("lodash")
const chalk = require("chalk")
const updateNotifier = require("update-notifier")
const readPkg = require("read-pkg")
const writePkg = require("write-pkg")
const dotProp = require("dot-prop")
const { oneLine } = require('common-tags')

const log = console.log
const cwd = process.cwd

class HuskyConf {
  constructor() {
    this.command = ["init", "add", "remove"]
    this.hooks = [
      "applypatch-msg",
      "commit-msg",
      "post-applypatch",
      "post-checkout",
      "post-commit",
      "post-merge",
      "post-receive",
      "post-rewrite",
      "post-update",
      "pre-applypatch",
      "pre-auto-gc",
      "pre-commit",
      "pre-push",
      "pre-rebase",
      "pre-receive",
      "prepare-commit-msg",
      "push-to-checkout",
      "update"
    ]
    this.cli = meow(`
        Usage 
          $ husky-conf <input> ... <string>

        Options
            --${this.command[0]},       -i  Initialize husky
            --${this.command[1]},       -a  Add husky hook
            --${this.command[2]},       -r  Remove existing husky hook

        Examples
          $ husky-conf --help
    `, {
        string: ["_"],
        alias: {
          i: "init",
          a: "add",
          r: "remove"
        },
        flags: {
          init: {
            type: "array",
            default: "init"
          },
          add: {
            type: "array",
            default: false
          },
          remove: {
            type: "array",
            default: false
          }
        }
      })

    if (this.cli.input.length === 0) {
      log(chalk.red("Specify at least one path"))
      process.exit(1)
    } else {
      const val = pullAt(this.cli.input, [0, 1])
      this.setup(val[0], val[1])
    }

    this.updateNotify()
  }

  updateNotify() {
    updateNotifier({ pkg: this.cli.pkg }).notify()
  }

  removeDash(value) {
    return value.replace(/-/g, '')
  }

  add(value) {
    if (this.hooks.indexOf(value) < 0) {
      log(chalk.red("Invalid hook"))
    } else {
      readPkg(cwd()).then(pkg => {
        console.log(
          {
            ...dotProp.get(pkg, "husky.hooks"),
            ...oneLine`{
              "${value}": "npm run ${this.removeDash(value)}"
            }`
          }
        )
      const _scripts = dotProp.has(pkg, "scripts") ? merge(
        dotProp.get(pkg, "scripts"),
        `"${this.removeDash(value)}": "npm run test"`
      ) : {
          "test": "echo \"Error: no test specified\" && exit 1"
        }

      const _husky = dotProp.has(pkg, "husky") ? {
        ...dotProp.get(pkg, "husky.hooks"),
        ...oneLine`{
          "${value}": "npm run ${this.removeDash(value)}"
        }`} : {
          "hooks": {
            "pre-commit": "npm run precommit"
          }
        }

      writePkg(
        path.join(cwd(), "package.json"),
        omit(
          merge(
            pkg,
            { "scripts": _scripts },
            { "husky": _husky }
          ),
          "_id"
        )
      ).then(pkg => {
        log(chalk.green("Husky setup completed"))
      }).catch(error => {
        log(chalk.red(error))
      })
    }).catch (error => {
      log(chalk.red(error))
    })
  }
}

remove(value) {

}

init() {
  readPkg(cwd()).then(pkg => {
    const huskyExists = dotProp.get(pkg, "husky")
    if (huskyExists) {
      log(chalk.green("Husky already exists"))
    } else {
      const _scripts = dotProp.has(pkg, "scripts") ? dotProp.set(
        merge(
          dotProp.get(pkg, "scripts"),
          { "precommit": "npm test" }
        )
      ) : {
          "test": "echo \"Error: no test specified\" && exit 1",
          "precommit": "npm test"
        }

      writePkg(
        path.join(cwd(), "package.json"),
        omit(Object.assign(
          pkg,
          {
            "scripts": _scripts,
            "husky": {
              "hooks": {
                "pre-commit": "npm run precommit"
              }
            }
          }
        ), "_id")
      ).then(pkg => {
        log(chalk.green("Husky setup completed"))
      }).catch(error => {
        log(chalk.red(error))
      })
    }
  }).catch(error => {
    log(chalk.red(error))
  })
}

setup(input, value) {
  if (this.command.indexOf(input) > -1) {
    if (input === "init") {
      this.init()
    } else if (input === "remove") {
      this.remove(value)
    } else if (input === "add") {
      this.add(value)
    }
  } else {
    log(chalk.red("Command not valid"))
  }
}
}

module.exports = Object.assign(new HuskyConf(), { HuskyConf })
