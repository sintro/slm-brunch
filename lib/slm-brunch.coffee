compile = require('slm-angular2')
path = require('path')
fs = require('fs')
html = require("html")

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

clone = (obj) ->
  if obj?
    return obj
  copy = obj.constructor()
  for attr of obj
    if obj.hasOwnProperty(attr)
      copy[attr] = clone(obj[attr])
  copy

compile.template._engine._chain.forEach (e) ->
  if e.hasOwnProperty('_format')
    e._format = 'html'

module.exports = class SlmCompiler
  brunchPlugin: yes
  type: 'template'
  staticTargetExtension: 'html'
  pattern: /\.(?:slim|slm)$/

  setup: (config) ->
    @options = clone(config) || {}
    @options.locals = config.locals || {}
   
  constructor: (@config) ->
    @setup(@config)

  compileStatic: (data, path, callback) ->
    options = @options
    filepath = data.path
    prettyResult = ''
    return new Promise (resolve, reject) ->
      try
        fs.readFile filepath, 'utf8', (err, data) ->
          try
            if err 
              throw err
            result = compile.compile(String(data), {})(options.locals)
            if options.optimize
              resolve result
            else
              resolve html.prettyPrint(result, {indent_size: 2})
          catch err
            reject(err)
      catch err
        reject(err)
