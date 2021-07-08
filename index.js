const core = require('@actions/core');
const fs = require('fs');

// most @actions toolkit packages have async methods
async function run() {
  try {
    let dirs = fs.readdirSync('./messages');
    let keys = {};
    dirs.forEach((path) => {
      let ext = path.split('.')[1];
      if (keys[ext] === undefined) {
        keys[ext] = [];
      }
      keys[ext] = keys[ext].concat(readMessages(`./messages/${path}`));
    });

    let global = [];
    Object.keys(keys).forEach((lang) => {
      global = global.concat(keys[lang]);
    });

    let anyFailed = false;
    Object.keys(keys).forEach((lang) => {
      const diff = difference(keys[lang], global);
      anyFailed = anyFailed || diff.length > 0;
      if (diff.length > 0) {
        console.log(`Missiong from ${lang}`);
        diff.forEach((key) => {
          console.log(`${lang}: ${key}`);
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
