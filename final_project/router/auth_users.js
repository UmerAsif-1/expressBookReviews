const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    // If the book exists, check if the reviews object for this ISBN has a review by the user
    if (books[isbn].reviews[username]) {
      // If the user has already posted a review, update it
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review updated successfully." });
    } else {
      // If no review by this user exists, add the new review
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully." });
    }
  } else {
    // If the book does not exist, return an error message
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
