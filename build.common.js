const colors = require('colors');
const {lstatSync, readdirSync, readFileSync, writeFileSync} = require('fs');
const {join, basename} = require('path');
const {spawn} = require('child_process');

const stringify = i => i instanceof Buffer ? i.toString('utf8').trim() : i.toString().trim();

const bin = command => join(__dirname, `node_modules/.bin/${command}`);

const isDirectory = source => lstatSync(source).isDirectory();

const hasTypescript = source => readdirSync(source).some(file => file.endsWith('.ts'));

const readFileJSON = input => JSON.parse(readFileSync(input, 'utf8'));

const PACKAGES_PATH = join(__dirname, 'packages');

const writeFileJSON = (output, data) => {
  const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  writeFileSync(output, content);
  return content;
};

const exec = (command, args) => () => new Promise((resolve) => {
  const _process = spawn(bin(command), args);
  log.command(basename(command));
  _process.stdout.on('data', data => log.std(data));
  _process.stderr.on('data', data => log.std(data));
  _process.on('close', data => resolve(data));
});

const log = {
  command: info => console.log(stringify(info).bold.gray),
  std: info => console.log('    ' + stringify(info).gray),
  start: info => console.log(stringify(info).bold.blue),
  end: info => console.log(stringify(info).bold.green),
  info: info => console.log(info),
};

module.exports = {
  bin,
  isDirectory,
  hasTypescript,
  readFileJSON,
  writeFileJSON,
  exec,
  log,
  PACKAGES_PATH,
  isTypescriptFolder: dir => isDirectory(join(PACKAGES_PATH, dir)) && hasTypescript(join(PACKAGES_PATH, dir)),
};
