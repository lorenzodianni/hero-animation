const colors = require('colors');
const {lstatSync, readdirSync} = require('fs');
const {join, basename} = require('path');
const {spawn} = require('child_process');

colors.setTheme({
  command: ['bold', 'gray'],
  std: ['gray'],
  start: ['bold', 'blue'],
  end: ['bold', 'green'],
});

const stringify = i => i instanceof Buffer ? i.toString('utf8').trim() : i.toString().trim();
const bin = command => join(__dirname, `node_modules/.bin/${command}`);
const isDirectory = source => lstatSync(source).isDirectory();
const hasTypescript = source => readdirSync(source).some(file => file.endsWith('.ts'));
const spawnPromise = (command, args) => () => new Promise((resolve) => {
  const _process = spawn(command, args);
  console.log(basename(command).command);
  _process.stdout.on('data', data => console.log('    ' + stringify(data).std));
  _process.stderr.on('data', data => console.log('    ' + stringify(data).std));
  _process.on('close', data => resolve(data));
});


const packages = readdirSync(join(__dirname, 'packages'))
  .filter(dir => isDirectory(join('packages', dir)))
  .filter(dir => hasTypescript(join('packages', dir)))
  .reduce((acc, name) => {
    const tsc = spawnPromise(bin('tsc'), ['-p', `./packages/${name}`]);
    const rollup = spawnPromise(bin('rollup'), ['--config', `./packages/${name}/rollup.config.js`]);
    const dts = spawnPromise(bin('dts-bundle-generator'), [
      '-o',
      `./dist/packages/${name}/${name}.d.ts`,
      `./packages/${name}/index.d.ts`,
    ]);
    return [...acc, {name, compile: () => tsc().then(rollup).then(dts).catch(e => console.log(stringify(e)))}];
  }, []);

packages.forEach(p => {
  console.log(`Generating ${p.name}...`.start);
  p.compile().then(() => console.log(`Completed ${p.name} package`.end));
});