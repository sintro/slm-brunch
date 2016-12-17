'use strict';

const slm = require('slm');
const sysPath = require('path');
const umd = require('umd-wrapper');
const progeny = require('progeny');

// perform a deep cloning of an object
const clone = (obj) => {
  if (null == obj || 'object' !== typeof obj) return obj;
  const copy = obj.constructor();
  for (const attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
  }
  return copy;
};

class SlmCompiler {
  constructor(cfg) {
    const defaultBaseDir = sysPath.join(cfg.paths.root, 'app');
    const slm = cfg.plugins.slm || {};
    const config = (slm && slm.options) || slm;

    // cloning is mandatory because config is not mutable
    this.locals = slm && slm.locals || {};
    this.options = clone(config) || {};
    this.options.basePath = (config && config.basedir) || defaultBaseDir;

    const getDependencies = progeny({
      rootPath: this.options.basePath,
      reverseArgs: true
    });

    this.getDependencies = (data, path, cb) => getDependencies(data, path, cb);
  }

  compile(file) {
    try {
      const compiled = this._getCompiledTemplate(file);
      return Promise.resolve(umd(compiled));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  compileStatic(file) {
    try {
      const compiled = this._getCompiledTemplate(file, this.locals);
      return Promise.resolve(compiled);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  _getCompiledTemplate(file, data={}) {
    const options = clone(this.options);
    options.filename = file.path;
    return JSON.stringify(slm.compile(file.data, options)(data));
  }
}

SlmCompiler.prototype.brunchPlugin = true;
SlmCompiler.prototype.type = 'template';
SlmCompiler.prototype.extension = /\.(slm|html)$/;
SlmCompiler.prototype.staticTargetExtension = 'html';

module.exports = SlmCompiler;
