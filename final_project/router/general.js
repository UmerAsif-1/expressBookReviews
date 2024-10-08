const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if both username and password are provided
    if (username && password) {
      // Check if the username already exists
      if (!doesExist(username)) {
        // Add the new user to the array
        users.push({ username: username, password: password });
        return res.status(201).json({ message: "User successfully registered. Now you can login." });
      } else {
        return res.status(400).json({ message: "User already exists!" });
      }
    }
  
    // If username or password is missing
    return res.status(400).json({ message: "Username and password are required." });
  });
    // utility function to check if a user with the given username already exists
    const doesExist = (username) => {
        // Filter the users array for any user with the same username
        let userswithsamename = users.filter((user) => {
            return user.username === username;
        });
        // Return true if any user with the same username is found, otherwise false
        if (userswithsamename.length > 0) {
            return true;
        } else {
            return false;
        }
      };
      
    
    
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let getBooks = new Promise((resolve, reject) => {
        // Adding some delay
        setTimeout(() => {
            resolve(books);
        }, 2000); //  2-second delay
    });

    getBooks.then((bookList) => {
        res.status(200).send(JSON.stringify(bookList, null, 4));
    }).catch((error) => {
        res.status(500).json({ message: "Error fetching books", error: error });
    });
});
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        //  async operation 
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]); //  if found
            } else {
                reject("Book not found!"); //  error message if not found
            }
        });

        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();

    try {
        const booksByAuthor = await new Promise((resolve, reject) => {
            let Bookstofind = [];

            for (let isbn in books) {
                if (books[isbn].author.toLowerCase() === author) {
                    Bookstofind.push(books[isbn]);
                }
            }

            if (Bookstofind.length > 0) {
                resolve(Bookstofind);
            } else {
                reject("No books found by the specified author");
            }
        });

        res.status(200).json(booksByAuthor);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();

    try {
        const booksByTitle = await new Promise((resolve, reject) => {
            let Bookstofind = [];

            for (let isbn in books) {
                if (books[isbn].title.toLowerCase() === title) {
                    Bookstofind.push(books[isbn]);
                }
            }

            if (Bookstofind.length > 0) {
                resolve(Bookstofind);
            } else {
                reject("No books found with the specified title");
            }
        });

        res.status(200).json(booksByTitle);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
  const isbn = req.params.isbn;

  if(books[isbn]){
    const reviews = books[isbn].reviews;
    if (Object.keys(reviews).length > 0 ){
    res.status(200).json(reviews); 
    } else {
    res.status(404).json({ message: "No reviews found for this book." });
    }
} else {
res.status(404).json({ message: "Book not found!" });
}
  });

module.exports.general = public_users;
