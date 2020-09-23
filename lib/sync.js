const {
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmdirSync,
  unlinkSync,
} = require('fs');
const { join } = require('path');

export const isFile = path => {
  try {
    return statSync(path).isFile();
  } catch (error) {
    return false;
  }
};

export const isDir = path => {
  try {
    return statSync(path).isDirectory();
  } catch (error) {
    return false;
  }
};

const listDirs = dir => {
  if (!isDir(dir)) return [];

  return readdirSync(dir).filter(dirname => isDir(join(dir, dirname)));
};

const syncMkdir = path => {
  try {
    mkdirSync(path, { recursive: true });
    return true;
  } catch (error) {
    return false;
  }
};

const propExist = (prop, obj) =>
  obj && obj[prop] !== undefined && obj[prop] !== '';

const excludeFiles = (path, opt) => {
  return opt
    ? propExist('exclude', opt) &&
        !path.match(new RegExp(opt.exclude)) &&
        isFile(path)
    : isFile(path);
};

const listFiles = (path, opt) => {
  if (!isDir(path)) return [];

  return readdirSync(path)
    .map(name => join(path, name))
    .filter(path => isFile(path))
    .filter(path => excludeFiles(path, opt));
};

const listFilesRecursively = (path, opt) => {
  const dirs = listDirs(path);

  let files = dirs
    .map(dir => listFilesRecursively(join(path, dir), opt)) // go through each directory
    .reduce((a, b) => a.concat(b), []); // map returns a 2d array (array of file arrays) so flatten

  return files.concat(listFiles(path, opt));
};

const rmDir = path => {
  listDirs(path).map(dir => rmDir(dir));
  listFiles(path).map(file => unlinkSync(file));

  if (isDir(path)) rmdirSync(path);
};

const readFile = file => {
  if (!isFile(file)) return null;

  try {
    return readFileSync(file);
  } catch (error) {
    return null;
  }
};

const writeFile = (file, data) => {
  try {
    writeFileSync(file, data);
    return true;
  } catch (error) {
    return false;
  }
};

export const read = readFile;
export const write = writeFile;
export const ld = listDirs;
export const lf = listFiles;
export const lfDeep = listFilesRecursively;
export const mkdir = syncMkdir;
export const rm = rmDir;
