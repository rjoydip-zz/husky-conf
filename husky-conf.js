'use strict'
const path = require('path')
const meow = require('meow')
const { pullAt, merge, omit } = require('lodash')
const chalk = require('chalk')
const updateNotifier = require('update-notifier')
const readPkg = require('read-pkg')
const writePkg = require('write-pkg')
const dotProp = require('dot-prop')

const log = console.log
const cwd = process.cwd

class HuskyConf {
  constructor () {
    this.command = ['init', 'add', 'remove']
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
      string: ['_'],
      alias: {
        i: 'init',
        a: 'add',
        r: 'remove'
      },
      flags: {
        init: {
          type: 'array',
          default: 'init'
        },
        add: {
          type: 'array',
          default: false
        },
        remove: {
          type: 'array',
          default: false
        }
      }
    })

    if (this.cli.input.length === 0) {
      log(chalk.red('Specify at least one path'))
      process.exit(1)
    } else {
      const val = pullAt(this.cli.input, [0, 1])
      this.setup(val[0], val[1])
    }

    this.updateNotify()
  }

  updateNotify () {
    updateNotifier({ pkg: this.cli.pkg }).notify()
  }

  add () {

  }

  remove () {

  }

  init () {
    readPkg(cwd()).then(pkg => {
      const huskyExists = dotProp.get(pkg, 'husky')
      if (huskyExists) {
        log(chalk.green('Husky already exists'))
      } else {
        const _scripts = dotProp.has(pkg, 'scripts') ? dotProp.set(
          merge(
            dotProp.get(pkg, 'scripts'),
            {
              'precommit': 'npm test'
            }
          )
        ) : {
          test: `echo "Error: no test specified" && exit 1`
        }

        writePkg(
          path.join(cwd(), 'package.json'),
          omit(Object.assign(
            pkg,
            {
              'scripts': _scripts,
              'husky': {
                'hooks': {
                  'pre-commit': 'npm run precommit'
                }
              }
            }
          ), '_id')
        ).then(pkg => {
          log(chalk.green('Husky setup completed'))
        }).catch(error => {
          log(chalk.red(error))
        })
      }
    }).catch(error => {
      log(chalk.red(error))
    })
  }

  setup (input, values) {
    if (this.command.indexOf(input) > -1) {
      if (input === 'init') {
        this.add()
      } else if (input === 'remove') {
        this.remove()
      } else if (input === 'add') {
        this.add()
      }
      //   log(chalk.green('input', input))
      //   log(chalk.green('values', values))
    } else {
      log(chalk.red('Command not valid'))
    }
  }
}

module.exports = Object.assign(new HuskyConf(), { HuskyConf })
