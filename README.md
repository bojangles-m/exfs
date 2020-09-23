# ex-Fs

A module extends build-in fs module and makes file system manipulation a bit easier.

## Install

```js
$ npm i ex-fs
```

## Usage

##### async Functions

```js
aMkdir(path); // makes directories and their contents recursively
aCopy(from, to);
aWrite(path, data);
aAppend(path, data);
```

##### sync Functions

```js
isFile(path);
isDir(path);
read(file); // path to file
write(file, data); // path to file
ld(dir); // list directories
lf(path, opt); // list files
lfDeep(path, opt); // List files recursively
mkdir(path); // makes directories and their content recursively
rm(path); // removes directories and their content recursively
```

## License

[MIT](LICENSE.md)
