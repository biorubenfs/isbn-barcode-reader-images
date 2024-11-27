const fs = require('fs');
const path = require('path');

/* barcodes folder */
const imagesDir = './src/example-images';
const images = []

/* create empty html file */
const htmlFile = fs.createWriteStream('index.html');

/* create basic structure in html file*/
htmlFile.write('<html>\n');
htmlFile.write('<head><title>Galería de Imágenes</title></head>\n');
htmlFile.write('<body>\n');

/* read images from folder */
fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('Error while reading dir:', err);
    return;
  }

  files.forEach((archivo, idx) => {
    /* Create a img tag for each image */
    htmlFile.write(`<img src="${path.join(imagesDir, archivo)}" id="${idx}" alt="${archivo}" width="300px" height="auto"/>\n`);
    images.push(idx)
    items = idx
  });

  /* add scripts */
  htmlFile.write('<script type="text/javascript" src="https://unpkg.com/@zxing/library@latest"></script>')
  htmlFile.write('<script src="./src/index.js"></script>')

  /* close open tags */
  htmlFile.write('</body>\n');
  htmlFile.write('</html>\n');
  htmlFile.end();

  console.log('HTML file created successfully');
  console.log('Number of img tags', files.length)
});

