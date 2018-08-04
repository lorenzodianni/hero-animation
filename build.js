const {readdirSync} = require('fs');
const {writeFileJSON, readFileJSON, exec, log, PACKAGES_PATH, isTypescriptFolder} = require('./build.common');

const updatePackageJson = (updates, input, output) => {
  log.command('package.json');
  const file = readFileJSON(`${input}/package.json`);
  const base = readFileJSON('./package.json');
  const edited = writeFileJSON(`${output}/package.json`, {
    ...file,
    ...updates.reduce((acc, key) => ({...acc, [key]: base[key]}), {}),
  });
  log.std(`updated: ${updates.join(', ')}`);
  return edited;
};

const createPackage = (name) => {
  const lib = `./packages/${name}`;
  const distLib = `./dist/${lib}`;
  const tsc = exec('tsc', ['-p', lib]);
  const rollup = exec('rollup', ['--config', `${lib}/rollup.config.js`]);
  const dts = exec('dts-bundle-generator', ['-o', `${distLib}/${name}.d.ts`, `${lib}/index.d.ts`]);
  return {
    name,
    compile: () => tsc()
      .then(() => rollup())
      .then(() => dts())
      .then(() => updatePackageJson(['version', 'author'], lib, distLib))
      .catch(e => log.info(e)),
  }
};

readdirSync(PACKAGES_PATH)
  .filter(isTypescriptFolder)
  .reduce((acc, name) => [...acc, createPackage(name)], [])
  .forEach(p => {
    log.start(`Generating ${p.name}...`);
    p.compile().then(() => {
      log.end(`Completed ${p.name} package`);
    });
  });