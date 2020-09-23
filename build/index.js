'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');

var ncp = require('ncp');

var _require = require('path'),
    dirname = _require.dirname;

var asyncMkdir = function asyncMkdir(path) {
  return new Promise(function (resolve, reject) {
    fs.mkdir(path, {
      recursive: true
    }, reject);
    resolve();
  });
};

var asyncCopy = function asyncCopy(from, to) {
  if (!fs.existsSync(from)) return;
  return asyncMkdir(dirname(to)).then(function () {
    return new Promise(function (resolve, reject) {
      ncp(from, to, function (error) {
        if (error) {
          // Wrap to have a useful stack trace.
          reject(new Error(error));
          return;
        }

        resolve();
      });
    });
  });
};

var asyncWriteFile = function asyncWriteFile(path, data) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, data, reject);
    resolve();
  });
};

var asyncAppendFile = function asyncAppendFile(path, data) {
  return new Promise(function (resolve, reject) {
    fs.appendFile(path, data, reject);
    resolve();
  });
};

var aCopy = asyncCopy;
var aMkdir = asyncMkdir;
var aWrite = asyncWriteFile;
var aAppend = asyncAppendFile;

var _require$1 = require('fs'),
    readdirSync = _require$1.readdirSync,
    statSync = _require$1.statSync,
    readFileSync = _require$1.readFileSync,
    writeFileSync = _require$1.writeFileSync,
    mkdirSync = _require$1.mkdirSync,
    rmdirSync = _require$1.rmdirSync,
    unlinkSync = _require$1.unlinkSync;

var _require2 = require('path'),
    join = _require2.join;

var isFile = function isFile(path) {
  try {
    return statSync(path).isFile();
  } catch (error) {
    return false;
  }
};
var isDir = function isDir(path) {
  try {
    return statSync(path).isDirectory();
  } catch (error) {
    return false;
  }
};

var listDirs = function listDirs(dir) {
  if (!isDir(dir)) return [];
  return readdirSync(dir).filter(function (dirname) {
    return isDir(join(dir, dirname));
  });
};

var syncMkdir = function syncMkdir(path) {
  try {
    mkdirSync(path, {
      recursive: true
    });
    return true;
  } catch (error) {
    return false;
  }
};

var propExist = function propExist(prop, obj) {
  return obj && obj[prop] !== undefined && obj[prop] !== '';
};

var excludeFiles = function excludeFiles(path, opt) {
  return opt ? propExist('exclude', opt) && !path.match(new RegExp(opt.exclude)) && isFile(path) : isFile(path);
};

var listFiles = function listFiles(path, opt) {
  if (!isDir(path)) return [];
  return readdirSync(path).map(function (name) {
    return join(path, name);
  }).filter(function (path) {
    return isFile(path);
  }).filter(function (path) {
    return excludeFiles(path, opt);
  });
};

var listFilesRecursively = function listFilesRecursively(path, opt) {
  var dirs = listDirs(path);
  var files = dirs.map(function (dir) {
    return listFilesRecursively(join(path, dir), opt);
  }) // go through each directory
  .reduce(function (a, b) {
    return a.concat(b);
  }, []); // map returns a 2d array (array of file arrays) so flatten

  return files.concat(listFiles(path, opt));
};

var rmDir = function rmDir(path) {
  listDirs(path).map(function (dir) {
    return rmDir(dir);
  });
  listFiles(path).map(function (file) {
    return unlinkSync(file);
  });
  if (isDir(path)) rmdirSync(path);
};

var readFile = function readFile(file) {
  if (!isFile(file)) return null;

  try {
    return readFileSync(file);
  } catch (error) {
    return null;
  }
};

var writeFile = function writeFile(file, data) {
  try {
    writeFileSync(file, data);
    return true;
  } catch (error) {
    return false;
  }
};

var read = readFile;
var write = writeFile;
var ld = listDirs;
var lf = listFiles;
var lfDeep = listFilesRecursively;
var mkdir = syncMkdir;
var rm = rmDir;

var readJsonFile = function readJsonFile(file) {
  return JSON.parse(read(file));
};
var writeJsonFile = function writeJsonFile(file, data) {
  return write(file, JSON.stringify(data, null, 2) + '\n');
};

exports.aAppend = aAppend;
exports.aCopy = aCopy;
exports.aMkdir = aMkdir;
exports.aWrite = aWrite;
exports.isDir = isDir;
exports.isFile = isFile;
exports.ld = ld;
exports.lf = lf;
exports.lfDeep = lfDeep;
exports.mkdir = mkdir;
exports.read = read;
exports.readJsonFile = readJsonFile;
exports.rm = rm;
exports.write = write;
exports.writeJsonFile = writeJsonFile;
