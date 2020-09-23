import { write, read } from './sync';

export const readJsonFile = file => JSON.parse(read(file));

export const writeJsonFile = (file, data) =>
  write(file, JSON.stringify(data, null, 2) + '\n');
