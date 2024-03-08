import { fileURLToPath } from 'url';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import Watcher from 'watcher';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
setTimeout(async() => {
  const name = (Math.random() + 1).toString(36).substring(7);
  try {
    await writeFile(join('/data', name), 'test');
  }
  catch (ex) {
    console.log(ex);
  }
}, 500);

const watcher = new Watcher('/data', {}, (event, targetPath, targetPathNext) => {
  console.log(`Global 'all' triggered: ${event} - ${targetPath} - ${targetPathNext}`);
});
watcher.on('error', error => {
  console.log(`Error ${error}`);
});
watcher.on('ready', () => {
  console.log(`Ready`);
});
watcher.on('close', () => {
  console.log(`Close`);
});


const exit = () => {
  if (watcher) watcher.close();
  process.exit(0);
}

process.on('SIGTERM', () => {
  console.log('\nSIGTERM signal received.');
  exit();
});
process.on('SIGINT', () => {
  console.log('\nSIGINT signal received.');
  exit();
});
process.on('SIGQUIT', () => {
  console.log('\nSIGQUIT signal received.');
  exit();
});
process.on('exit', () => {
  console.log('Exiting');
});