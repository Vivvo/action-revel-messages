const core = require('@actions/core');
const fs = require('fs');

// most @actions toolkit packages have async methods
async function run() {
  try {
    let dirs = fs.readdirSync('./messages');
    let keys = {};
    dirs.forEach((path) => {
      let ext = path.split('.')[1];
      keys[ext] = keys[ext].concat(readMessages(path));
    });

    let global = [];
    keys.forEach((lang) => {
      global = global.concat(keys[lang]);
    });

    let anyFailed = false;
    keys.forEach((lang) => {
      const diff = difference(keys[lang], global);
      anyFailed = anyFailed || diff.length > 0;
      if (diff.length > 0) {
        core.info(`Missiong from ${lang}`);
        diff.forEach((key) => {
          core.info(`${lang}: ${key}`);
        });
      }
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

function readMessages(path) {
  const lines = fs.readFileSync(path, 'utf8').split('\n');
  const keys = [];
  lines.forEach((line) => {
    keys.push(line.split('=')[0]);
  });
  return keys;
}

function difference(a, b) {
  return a.filter(x => !b.includes(x));
}

run();
