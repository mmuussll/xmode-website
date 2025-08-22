const fs = require('fs-extra');
const terser = require('terser');
const cssnano = require('cssnano');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
const sourcePath = __dirname;

async function build() {
  try {
    // 1. Clean and create the dist directory
    await fs.emptyDir(distPath);
    console.log('Cleaned dist directory.');

    // 2. Minify JavaScript
    const jsCode = await fs.readFile(path.join(sourcePath, 'script.js'), 'utf8');
    const minifiedJs = await terser.minify(jsCode);
    await fs.writeFile(path.join(distPath, 'script.js'), minifiedJs.code);
    console.log('JavaScript minified.');

    // 3. Minify CSS
    const cssCode = await fs.readFile(path.join(sourcePath, 'styles.css'), 'utf8');
    const minifiedCss = await cssnano().process(cssCode, { from: undefined });
    await fs.writeFile(path.join(distPath, 'styles.css'), minifiedCss.css);
    console.log('CSS minified.');

    // 4. Copy other files
    const filesToCopy = [
      'index.html',
      'manifest.json',
      'favicon.svg',
      'icon.png',
      'icon1.png',
      'icon2.png',
      'icon3.png',
      'og-image.html',
      'robots.txt',
      'sitemap.xml',
      'sw.js',
      '_redirects',
      'analytics.html',
      'browserconfig.xml',
      '404.html',
      '.htaccess',
      'LICENSE',
      'README.md',
      'googleca3bb8787a863884.html'
    ];

    for (const file of filesToCopy) {
        if (await fs.exists(path.join(sourcePath, file))) {
            await fs.copy(path.join(sourcePath, file), path.join(distPath, file));
        }
    }
    console.log('Copied necessary files.');

    // 5. Update index.html to point to minified files (optional, but good practice)
    // For simplicity, we are not doing this automatically. 
    // The user should deploy the 'dist' folder.

    console.log('\nBuild successful!\n');
    console.log('Your optimized website is ready in the /dist directory.');
    console.log('Deploy this directory to your web host.');

  } catch (err) {
    console.error('Error during build process:', err);
    process.exit(1);
  }
}

build();
