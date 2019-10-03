const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const {getUserByEmail} = require('./helpers');
const {checkURLOwner} = require('./helpers');
const {urlsOwnedByUser} = require('./helpers');
const {generateNewShortUrl} = require('./helpers');
app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"]}));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
}

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "user2RandomID"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "user2RandomID"}
};

app.get("/", (req, res) => {
  res.send("Hello!");
});
// url homepage
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

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
})

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

app.get("/login", (req, res) => {
  let templateVars = {urls: urlDatabase, user:users[req.session.user_id]}
  res.render("urls_login.ejs", templateVars);
})

app.post("/registration", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.send("Error 400");
  };
  if (!getUserByEmail(req.body.email, users)) {
    const tempUserID = generateNewShortUrl();
    users[tempUserID] = {id:tempUserID, email:req.body.email, password: bcrypt.hashSync(req.body.password, 10)};
    req.session.user_id = tempUserID;
    res.redirect("/urls");
  } else {
    res.send("Email already exists")
  }
});

app.get("/registration", (req, res) => {
  let templateVars = {urls: urlDatabase, user:users[req.session.user_id]}
  res.render("urls_registrationPage.ejs", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const x = req.params.shortURL;
  const longUrl = urlDatabase[x].longURL;
  res.redirect(longUrl);
});

app.post("/urls/new", (req, res) => {
  const newURLShort = generateNewShortUrl();
  urlDatabase[newURLShort] = {longURL: req.body.longURL, userID: req.session.user_id, date: new Date()};
  res.redirect(`/urls/${newURLShort}`);
});

app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {urls: urlDatabase, user:users[req.session["user_id"]]}
    res.render("urls_new", templateVars);
  } else {
    let templateVars = {urls: "", user: ""}
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const id = req.session.user_id;
  if (!checkURLOwner(id, urlDatabase)) {
    res.send("User is not the creator of this URL")
  } else {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id]
    }
    console.log(templateVars)
    res.render("urls_show", templateVars);
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const id = req.session.user_id;
  if (!checkURLOwner(id, urlDatabase)) {
    res.send("User is not the creator of this URL")
  } else {
    res.redirect("/urls/:shortURL");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const id = req.session.user_id;
  if (!checkURLOwner(id, urlDatabase)) {
    res.send("User is not the creator of this URL")
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});