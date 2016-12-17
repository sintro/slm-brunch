const expect = require('chai').expect;
const Plugin = require('../index');
const slm = require('slm');
const sysPath = require('path');
const fs = require('fs');
const config = require('./fixtures/brunch.conf');

describe('Plugin', () => {
  let plugin;

  beforeEach(() => {
    plugin = new Plugin(config.default);
  });

  it('should be an object', () => {
    expect(plugin).to.be.ok;
  });

  it('should has #compile method', () => {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result', done => {
    const content = 'doctype html';
    const expected = '<!DOCTYPE html>';

    plugin.compile({data: content, path: 'template.slm'}).then(data => {
      expect(eval(data)).to.equal(expected);
      done();
    });
  });

  it('should compileStatic and produce valid result', done => {
    plugin = new Plugin(config.compileStatic);
    const content = 'h1 = this.title';
    const expected = '<h1>slm-brunch</h1>';

    plugin.compileStatic({data: content, path: 'template.slm'}).then(data => {
      expect(eval(data)).to.equal(expected);
      done();
    });
  });

  describe('getDependencies', function() {
    it('should output valid deps', function(done) {
      const content = "\
       = include valid1\n\
       = include valid1.slm\n\
       = include ../../test/valid1\n\
       = include ../../test/valid1.slm\n\
       = content valid2\n\
       = content valid2.slm\n\
       = include /valid3\n\
       = include ../../test/valid2\n\
       = include ../../test/valid2.slm\n\
       = partial valid4\n\
       = partial valid4.slm\n\
      ";

      const expected = [
        sysPath.join('valid1.slm'),
        sysPath.join('app', 'valid3.slm'),
        sysPath.join('valid2.slm'),
        sysPath.join('valid4.slm'),
      ];

      // progeny now only outputs actually found files by default
      fs.mkdirSync('app');
      expected.forEach(file => fs.writeFileSync(file, 'div'));

      plugin.getDependencies(content, 'template.slm', (error, dependencies) => {
        // clean up temp fixture files
        expected.forEach(file => fs.unlinkSync(file));

        fs.rmdirSync('app');

        expect(error).not.to.be.ok;
        expect(dependencies).to.have.members(expected);

        done();
      });
    });
  });

  describe('getDependenciesWithOverride', () => {
    it('should output valid deps', done => {

      const content = "\
       = include /valid3\n\
       = partial /valid4\n\
      ";

      const expected = [
        sysPath.join('custom', 'valid3.slm'),
        sysPath.join('custom', 'valid4.slm'),
      ];

      // progeny now only outputs actually found files by default
      fs.mkdirSync('custom');
      expected.forEach(file => fs.writeFileSync(file, 'div'));

      plugin = new Plugin(config.getDependenciesWithOverride);

      plugin.getDependencies(content, 'template.slm', (error, dependencies) => {
        // clean up temp fixture files
        expected.forEach(file => fs.unlinkSync(file));
        fs.rmdirSync('custom');

        expect(error).not.to.be.ok;
        expect(dependencies).to.have.members(expected);

        done();
      });
    });
  });

});