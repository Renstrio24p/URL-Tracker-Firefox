import esbuildServe from 'esbuild-serve';
import fs from 'fs-extra';
import dotenv from 'dotenv';
import opn from 'open';

dotenv.config();

const buildDir = 'dist';
const sourceDir = 'src';
const imagesDir = 'src/images';
const entryFile = 'src/index.ts';
const outDir = 'dist/assets';

const copyIndexHtml = () => {
  fs.copySync('index.html', `${buildDir}/index.html`);
};

const copyImages = () => {
  fs.removeSync(`${buildDir}/images`);
  fs.copySync(imagesDir, `${buildDir}/images`, { overwrite: true });
};

const openBrowser = async () => {
  if (!process.argv.includes('--build')) {
    await opn('http://localhost:9200');
  }
};

const startEsbuildServe = async () => {
  try {
    await esbuildServe({
      logLevel: 'info',
      entryPoints: [entryFile],
      bundle: true,
      outdir: outDir,
      sourcemap: true,
      plugins: [
        // Add any necessary plugins here
      ],
      loader: {
        '.ts': 'tsx',
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.gif': 'file',
        '.css': 'css'
      },
      minify: true,
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env': JSON.stringify(process.env),
      },
    }, { root: buildDir, port: 9200 });

    console.log('esbuild serve started.');
    await openBrowser();
  } catch (error) {
    console.error('Error starting esbuild serve:', error);
    process.exit(1);
  }
};

const watchImages = () => {
  try {
    const imagesWatcher = fs.watch(imagesDir, { recursive: true }, (eventType, filename) => {
      console.log(`Changes detected in images folder. Rebuilding...`);
      copyImages();
    });

    const distWatcher = fs.watch(buildDir, { recursive: true }, (eventType, filename) => {
      // Check if the dist folder is deleted
      if (eventType === 'rename' && filename === buildDir) {
        console.log('dist folder deleted. Copying index.html and images...');
        copyIndexHtml();
        copyImages();
        startEsbuildServe();
      }
    });

    process.on('SIGINT', () => {
      imagesWatcher.close();
      distWatcher.close();
      process.exit();
    });
  } catch (error) {
    console.error('Error setting up watchers:', error);
    process.exit(1);
  }
};

const runScript = async () => {
  copyIndexHtml();
  copyImages();

  if (process.argv.includes('--build')) {
    await startEsbuildServe();
    console.log('Running esbuild build...');
  } else {
    watchImages();
    await startEsbuildServe();
  }
};

runScript();
