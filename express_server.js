const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const {getUserByEmail, checkURLOwner, urlsOwnedByUser, generateNewShortUrl} = require('./helpers');
app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"]}));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const users = {};
const urlDatabase = {};

app.get("/", (req, res) => {
  res.redirect("/urls");
});
// The app's homepage
app.get("/urls", (req, res) => {
  const id = req.session.user_id;
  if (urlsOwnedByUser(id, urlDatabase)) {
    let templateVars = {urls: urlsOwnedByUser(id, urlDatabase), user: users[req.session.user_id], date: new Date().toLocaleString('en-US')}
    res.render("urls_index", templateVars);
  } else {
    let templateVars = {urls: "", user: ""}
    res.render("urls_index", templateVars);
  }
});

// Post request for the user to logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
})

// Post request for the user to login
app.post("/login", (req, res) => {
  let userEmail = req.body.email;
  let potentialUser = getUserByEmail(userEmail, users);
  if (!potentialUser) {
    res.send("Error 403: Email not found")
  }
  if (bcrypt.compareSync(req.body.password, users[potentialUser.id].password)) {
    req.session.user_id = potentialUser.id;
    res.redirect("/urls");
  } else {
    res.send("Incorrect password")
  }
})

// Get request that takes the user to the login page
app.get("/login", (req, res) => {
  let templateVars = {urls: urlDatabase, user:users[req.session.user_id]}
  res.render("urls_login.ejs", templateVars);
})

// Post request that allows a user to create an account
app.post("/registration", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.send("Error 400");
    return;
  };
  if (!getUserByEmail(req.body.email, users)) {
    const tempUserID = generateNewShortUrl();
    users[tempUserID] = {id:tempUserID, email:req.body.email, password: bcrypt.hashSync(req.body.password, 10)};
    req.session.user_id = tempUserID;
    res.redirect("/urls");
  } else {
    res.send("Email already exists")
    return;
  }
});

// Get request that leads to the registration page and allows the user to create an account
app.get("/registration", (req, res) => {
  let templateVars = {urls: urlDatabase, user:users[req.session.user_id]}
  res.render("urls_registrationPage.ejs", templateVars);
});

// Get request that leads to the longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longUrl = urlDatabase[shortURL].longURL;
  res.redirect(longUrl);
});

// Post request that allows the user to create a shortURL. If the user is logged in the URL will be saved in the database. Otherwise the user will just create a shortURL
app.post("/urls/new", (req, res) => {
  const newURLShort = generateNewShortUrl();
  urlDatabase[newURLShort] = {longURL: req.body.longURL, userID: req.session.user_id, date: new Date()};
  res.redirect(`/urls/${newURLShort}`);
});

// Allows the user to create a short URL. User must be logged in
app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {urls: urlDatabase, user:users[req.session["user_id"]]}
    res.render("urls_new", templateVars);
  } else {
    let templateVars = {urls: "", user: ""}
    res.render("urls_new", templateVars);
  }
});

// Get request to access a shortURL that is already in the database
app.get("/urls/:shortURL", (req, res) => {
  const id = req.session.user_id;
  if (!checkURLOwner(id, req.params.shortURL, urlDatabase)) {
    res.send("User is not the creator of this URL")
  } else {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id]
    }
    res.render("urls_show", templateVars);
  }
});
// Post request that allows a user to edit a URL
app.post("/urls/:shortURL/edit", (req, res) => {
  const id = req.session.user_id;
  if (!checkURLOwner(id, req.params.shortURL, urlDatabase)) {
    res.send("User is not the creator of this URL")
  } else {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect("/urls/" + req.params.shortURL);
  }
});

// Post request that allows the user to delete a saved URL only if it was created by the user
app.post("/urls/:shortURL/delete", (req, res) => {
  const id = req.session.user_id;
  if (!checkURLOwner(id, req.params.shortURL, urlDatabase)) {
    res.send("User is not the creator of this URL")
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
})
// Listens for connections on the given path. In this case the path is specified as PORT 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});