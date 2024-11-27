const fs = require('fs')
const {ulid} = require('ulid')

const booksList = [
    "9788434435728",
    "9781718500402",
    "9788419160362",
    "9788412497786"
]

async function getAuthorFromPath(path) {
    const response = await fetch(`https://openlibrary.org${path}.json`)
    const body = await response.json()
    return body.name
}

async function getBookFromISBN(isbn) {
    const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`, { method: 'GET' })
    if (response.status !== 200) return null
    const body = await response.json()

    const authors = []
    if (body.authors != null) {
        for (const author of body.authors) {
            const authorName = await getAuthorFromPath(author.key)
            authors.push(authorName)
        }
    }

    return {
        title: body.title,
        authors: authors,
        isbn: isbn,
        covers: body.covers && body.covers[0] ? body.covers[0] : null
    }
}

async function processBooks() {
    let countSuccess = 0
    const failedIsbn = []

    /* create the json file and opening the square brackets */
    fs.appendFileSync('./book-list.json', '[')

    for (const isbn of booksList) {
        console.log(`processing isbn: ${isbn}`)
        const openLibraryBook = await getBookFromISBN(isbn)
        if (openLibraryBook == null) {
            failedIsbn.push(isbn)
            console.error(`fetch failed with isbn: ${isbn}`)
            continue
        }
        const now = new Date()

        const dbBook = {
            _id: ulid(),
            title: openLibraryBook.title,
            authors: openLibraryBook.authors,
            isbn: openLibraryBook.isbn,
            cover: openLibraryBook.covers ? openLibraryBook.covers.toString() : null,
            createdAt: now,
            updatedAt: now
        }

        fs.appendFile('./book-list.json', `${JSON.stringify(dbBook)},\n`, (error) => {
            if (error == null) {
                console.log(`added book with isbn: ${isbn}: ${dbBook.title}`)
                countSuccess++
            } else {
                console.error(`error adding book with isbn ${isbn}`, error)
            }
        })
    }

    /* Wait a bit until all data is written before close the square brackets */
    setTimeout(() => {
        fs.appendFileSync('./book-list.json', ']')
        console.log('############# REPORT ########################')
        console.log('> books added:       ', countSuccess)
        console.log('> fetch failed:      ', failedIsbn.length)
        console.log(`> isbn failed log:   `, failedIsbn)
        console.log('#############################################')
    }, 1000)
}

processBooks().catch(error => console.error('Error processing books:', error))

