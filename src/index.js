// const { BrowserBarcodeReader } = require('@zxing/library')

/* Use number of the img tags */
const images = Array.from(Array(4).keys())
const isbn = []

for (const elem of images) {
  const codeReader = new ZXing.BrowserBarcodeReader();

  const img = document.getElementById(elem.toString());

  codeReader.decodeFromImage(img)
      .then(result => {
          isbn.push(result.text)
      })
      .catch(err => {
          console.error(err);
      });
}
/* copy thi object and paste in the books.js file */
console.log(isbn)