# Getting Started
Install dependencies with:

```
npm install
```

## Generate HTML to scan with zxing
Run:

```
npm run generator
```

Take the number of img tags created and paste the number into `Array(n)`. 

## Scan the bar codes in the img tags of the html file
Then, open `index.html` file with **live server** plugin, copy the array of the browser console and paste into the bookList array in the books.js file.

## Export data into json file
Run:

```
npm run export
```

to create a json file with books info that should be imported into mongodb collection.
