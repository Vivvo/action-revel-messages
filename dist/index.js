require('./sourcemap-register.js');module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 932:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const core = __webpack_require__(186);
const fs = __webpack_require__(747);
const walk = __webpack_require__(200);

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
    walk.sync('./views/', function (path, stat) {
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


/***/ }),

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __webpack_require__(351);
const file_command_1 = __webpack_require__(717);
const utils_1 = __webpack_require__(278);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(747));
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 200:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var EventEmitter = __webpack_require__(614).EventEmitter,
_fs = __webpack_require__(747),
_path = __webpack_require__(622),
sep = _path.sep||'/';// 0.6.x


module.exports = walkdir;

walkdir.find = walkdir.walk = walkdir;

walkdir.sync = function(path,options,eventHandler){
  if(typeof options == 'function') cb = options;
  options = options || {};
  options.sync = true;
  return walkdir(path,options,eventHandler);
};

// return promise.
walkdir.async = function(path,options,eventHandler){
  return new Promise((resolve,reject)=>{
    if(typeof options == 'function') cb = options;
    options = options || {};

    let emitter = walkdir(path,options,eventHandler)

    emitter.on('error',reject)
    emitter.on('fail',(path,err)=>{
      err.message = 'Error walking": '+path+' '+err.message
      if(err) reject(err)
    })

    let allPaths = {}
    emitter.on('path',(path,stat)=>{
      if(options.no_return !== true) allPaths[path] = stat;
    })
    emitter.on('end',()=>{
      if(options.no_return !== true){
        return resolve(options.return_object?allPaths:Object.keys(allPaths))
      }
      resolve()
    })
  })
}

function walkdir(path,options,cb){

  if(typeof options == 'function') cb = options;

  options = options || {};
  if(options.find_links === undefined){
    options.find_links = true;
  }
  
  var fs = options.fs || _fs;

  var emitter = new EventEmitter(),
  dontTraverse = [],
  allPaths = (options.return_object?{}:[]),
  resolved = false,
  inos = {},
  stop = 0,
  pause = null,
  ended = 0, 
  jobs=0, 
  job = function(value) {
    jobs += value;
    if(value < 1 && !tick) {
      tick = 1;
      process.nextTick(function(){
        tick = 0;
        if(jobs <= 0 && !ended) {
          ended = 1;
          emitter.emit('end');
        }
      });
    }
  }, tick = 0;

  emitter.ignore = function(path){
    if(Array.isArray(path)) dontTraverse.push.apply(dontTraverse,path)
    else dontTraverse.push(path)
    return this
  }

  //mapping is stat functions to event names.	
  var statIs = [['isFile','file'],['isDirectory','directory'],['isSymbolicLink','link'],['isSocket','socket'],['isFIFO','fifo'],['isBlockDevice','blockdevice'],['isCharacterDevice','characterdevice']];

  var statter = function (path,first,depth) {
    job(1);
    var statAction = function fn(err,stat,data) {

      job(-1);
      if(stop) return;

      // in sync mode i found that node will sometimes return a null stat and no error =(
      // this is reproduceable in file descriptors that no longer exist from this process
      // after a readdir on /proc/3321/task/3321/ for example. Where 3321 is this pid
      // node @ v0.6.10 
      if(err || !stat) { 
        emitter.emit('fail',path,err);
        return;
      }

      //if i have evented this inode already dont again.
      var fileName = _path.basename(path);
      var fileKey = stat.dev + '-' + stat.ino + '-' + fileName;
      if(options.track_inodes !== false) {
        if(inos[fileKey] && stat.ino) return;
        inos[fileKey] = 1;
      }

      if (first && stat.isDirectory()) {
        emitter.emit('targetdirectory',path,stat,depth);
        return;
      }

      emitter.emit('path', path, stat, depth);

      var i,name;

      for(var j=0,k=statIs.length;j<k;j++) {
        if(stat[statIs[j][0]]()) {
          emitter.emit(statIs[j][1],path,stat,depth);
          break;
        }
      }
    };
    
    if(options.sync) {
      var stat,ex;
      try{
        stat = fs[options.find_links?'lstatSync':'statSync'](path);
      } catch (e) {
        ex = e;
      }

      statAction(ex,stat);
    } else {
        fs[options.find_links?'lstat':'stat'](path,statAction);
    }
  },readdir = function(path,stat,depth){

    if(!resolved) {
      path = _path.resolve(path);
      resolved = 1;
    }

    if(options.max_depth && depth >= options.max_depth){
      emitter.emit('maxdepth',path,stat,depth);
      return;
    }

    if(dontTraverse.length){
      for(var i=0;i<dontTraverse.length;++i){
        if(dontTraverse[i] == path) {
          dontTraverse.splice(i,1)
          return;
        }
      }
    }

    job(1);
    var readdirAction = function(err,files) {
      job(-1);
      if (err || !files) {
        //permissions error or invalid files
        emitter.emit('fail',path,err);
        return;
      }

      if(!files.length) {
        // empty directory event.
        emitter.emit('empty',path,stat,depth);
        return;     
      }

      if(path == sep) path='';
      if(options.filter){
        var res = options.filter(path,files)
        if(!res){
          throw new Error('option.filter function must return a array of strings or a promise')
        }
        // support filters that return a promise
        if(res.then){
          job(1)
          res.then((files)=>{
            job(-1)
            for(var i=0,j=files.length;i<j;i++){
              statter(path+sep+files[i],false,(depth||0)+1);
            }
          })
          return;
        }
        //filtered files.
        files = res
      }
      for(var i=0,j=files.length;i<j;i++){
        statter(path+sep+files[i],false,(depth||0)+1);
      }

    };


    //use same pattern for sync as async api
    if(options.sync) {
      var e,files;
      try {
          files = fs.readdirSync(path);
      } catch (_e) { e = _e}

      readdirAction(e,files);
    } else {
      fs.readdir(path,readdirAction);
    }
  };

  if (options.follow_symlinks) {
    var linkAction = function(err,path,depth){
      job(-1);
      //TODO should fail event here on error?
      statter(path,false,depth);
    };

    emitter.on('link',function(path,stat,depth){
      job(1);
      if(options.sync) {
        var lpath,ex;
        try {
          lpath = fs.readlinkSync(path);
        } catch(e) {
          ex = e;
        }
        linkAction(ex,_path.resolve(_path.dirname(path),lpath),depth);

      } else {
        fs.readlink(path,function(err,lpath){
          linkAction(err,_path.resolve(_path.dirname(path),lpath),depth);
        });
      }
    });
  }

  if (cb) {
    emitter.on('path',cb);
  }

  if (options.sync) {
    if(!options.no_return){
      emitter.on('path',function(path,stat){
        if(options.return_object) allPaths[path] = stat;
        else allPaths.push(path);
      });
    }
  }

  if (!options.no_recurse) {
    emitter.on('directory',readdir);
  }
  //directory that was specified by argument.
  emitter.once('targetdirectory',readdir);
  //only a fail on the path specified by argument is fatal 
  emitter.once('fail',function(_path,err){
    //if the first dir fails its a real error
    if(path == _path) {
      emitter.emit('error',new Error('error reading first path in the walk '+path+'\n'+err),err);
    }
  });

  statter(path,1);
  if (options.sync) {
    return allPaths;
  } else {
    //support stopping everything.
    emitter.end = emitter.stop = function(){stop = 1;};
    //support pausing everything
    var emitQ = [];
    emitter.pause = function(){
      job(1);
      pause = true;
      emitter.emit = function(){
        emitQ.push(arguments);
      };
    };
    // support getting the show going again
    emitter.resume = function(){
      if(!pause) return;
      pause = false;
      // not pending
      job(-1);
      //replace emit
      emitter.emit = EventEmitter.prototype.emit;
      // local ref
      var q = emitQ;
      // clear ref to prevent infinite loops
      emitQ = [];
      while(q.length) {
        emitter.emit.apply(emitter,q.shift());
      }
    };

    return emitter;
  }

}


/***/ }),

/***/ 614:
/***/ ((module) => {

"use strict";
module.exports = require("events");;

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(932);
/******/ })()
;
//# sourceMappingURL=index.js.map