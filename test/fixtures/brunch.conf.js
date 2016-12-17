exports.default = {
  paths: {
    root: '.'
  },
  plugins: {}
};

exports.compileStatic = {
  paths: {
    root: '.'
  },
  plugins: {
    slm: {
      locals: {
        title: 'slm-brunch'
      }
    }
  }
};

exports.getDependenciesWithOverride = {
  paths: {
    root: '.'
  },
  plugins: {
    slm: {
      basedir: 'custom'
    }
  }
};