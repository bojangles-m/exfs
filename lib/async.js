const fs = require('fs');
const ncp = require('ncp');
const { dirname } = require('path');

const asyncMkdir = path => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, { recursive: true }, reject);
    resolve();
  });
};

const asyncCopy = (from, to) => {
  if (!fs.existsSync(from)) return;

  return asyncMkdir(dirname(to)).then(() => {
    return new Promise((resolve, reject) => {
      ncp(from, to, error => {
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

const asyncWriteFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, reject);
    resolve();
  });
};

const asyncAppendFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, data, reject);
    resolve();
  });
};

export const aCopy = asyncCopy;
export const aMkdir = asyncMkdir;
export const aWrite = asyncWriteFile;
export const aAppend = asyncAppendFile;
