compile = require('slm').compile
path = require('path')
fs = require('fs')

# Allows modules included by slm-brunch to be overwritten by
# a module in the current working directory's ./node_modules.
localRequire = (module) ->
  try
    modulePath = path.join process.cwd(), 'node_modules', module
    return require modulePath

  catch userError
    throw userError unless userError.code is 'MODULE_NOT_FOUND'

    try
      return require module

    catch localError
      throw localError

module.exports = class SlmCompiler
  brunchPlugin: yes
  type: 'template'
  staticTargetExtension: 'html'
  pattern: /\.(?:slim|slm)$/

  setup: (config) ->
    @options = clone(config) || {}
    @options.locals = config.locals || {}
   
  constructor: (config) ->
    @setup(config)

  compileStatic: (data, path, callback) ->
    options = @options
    filepath = data.path
    return new Promise (resolve, reject) ->
      try
        fs.readFile filepath, 'utf8', (err, data) ->
          if err 
            throw err
          result = compile(String(data), options)(options.locals)
          return resolve(result)
      catch err
        error = reject(err)

