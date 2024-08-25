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
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if(books[isbn]){
    res.send(books[isbn]);
  }
  else{
    res.status(404).send("Book not found!");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
 
  const author = req.params.author;

  let booksbyauthor = [];

  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        booksbyauthor.push(books[isbn]);
    }
}
if(booksbyauthor.length > 0 ){
    return res.status(200).json(booksbyauthor);
} else {
        // If no books are found by the specified author, send a 404 status and a message
        return res.status(404).json({ message: "No books found by the specified author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
  const title = req.params.title;

  let booksbytitle =[];

  for (let isbn in books){
    if (books[isbn].title.toLowerCase() === title.toLowerCase()){
        booksbytitle.push(books[isbn]);
    }
}
    if (booksbytitle.length > 0){
        return res.status(200).json(booksbytitle);
    }
     else{
        return res.status(404).json({message:"No books found by the specified author" });
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
