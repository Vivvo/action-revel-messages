const core = require('@actions/core');
const fs = require('fs');
const walk = require('walkdir');

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

    // Missing from a language
    Object.keys(keys).forEach((lang) => {
      const diff = difference(global, keys[lang]);
      anyFailed = anyFailed || diff.length > 0;
      if (diff.length > 0) {
        core.info(`Missing from ${lang}`);
        diff.forEach((key) => {
          core.info(`${lang}: ${key}`);
        });
      }
    });

    // Gather: Usage from views
    let used = [];
    walk.sync('./app/views/', function (path, stat) {
      if (stat.isFile()) {
        used = used.concat(readView(path));
      }
    });

    // Not used
    const notUsed = difference(global, used);
    notUsed.forEach((key) => {
      core.info(`Never used: ${key}`);
    });

    // Not defined
    const notDefined = difference(used, global);
    notDefined.forEach((key) => {
      core.info(`Never defined: ${key}`);
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

function readMessages(path) {
  const lines = fs.readFileSync(path, 'utf8').split('\n');
  const keys = [];
  lines.forEach((line) => {
    if (line != "") {
      keys.push(line.split('=')[0]);
    }
  });
  return keys;
}

function readView(path) {
  const regex = /\{\{\s*msg\s(?:.+?)\s\"(.+?)\"\s*\}\}/gm;
  let keys = [];
  let m;
  while ((m = regex.exec(fs.readFileSync(path, 'utf8'))) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (groupIndex == 1) {
        keys.push(match);
      }
    });
  }
  return keys;
}

function difference(a, b) {
  return a.filter(x => !b.includes(x));
}

run();
