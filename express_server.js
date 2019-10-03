const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const emailLookUp = function(email) {
  for (let usr in users) {
    if (email === users[usr].email) {
      return users[usr];
    };
  };
  return false;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
function generateRandomString() {
  let newShortUrl = "";
  for (let i = 0; i < 6; i ++) {
    letCodeAt = Math.random() * (123 - 97) + 97;
    newShortUrl += String.fromCharCode(letCodeAt);
  }
  return newShortUrl;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase, user: users[req.cookies["user_id"]]}
  res.render("urls_index", templateVars);
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id", req.body.user_id);
  res.redirect("/login");
})

app.post("/login", (req, res) => {
  let userEmail = req.body.email;
  let potentialUser = emailLookUp(userEmail);
  if (potentialUser === false) {
    res.send("Error 403: Email not found")
  }
  if (potentialUser.password === req.body.password) {
    res.cookie("user_id", potentialUser.id);
    res.redirect("/urls");
  } else {
    res.send("Incorrect password")
  }
})

app.get("/login", (req, res) => {
  let templateVars = {urls: urlDatabase, user:users[req.cookies["user_id"]]}
  res.render("urls_login.ejs", templateVars);
})

app.post("/registration", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.send("Error 400");
  };
  if (!emailLookUp(req.body.email)) {
    const tempUserID = generateRandomString();
    users[tempUserID] = {id:tempUserID, email:req.body.email, password:req.body.password};
    res.cookie("user_id", users[tempUserID])
    res.redirect("/urls");
  } else {
    res.send("Email already exists")
  }
});
app.get("/registration", (req, res) => {
  let templateVars = {urls: urlDatabase, user:users[req.cookies["user_id"]]}
  res.render("urls_registrationPage.ejs", templateVars);
});

app.post("/urls", (req, res) => {
  const newURLShort = generateRandomString();
  urlDatabase[newURLShort] = req.body.longURL;
  res.redirect(`/urls/${newURLShort}`);
});

app.get("/u/:shortURL", (req, res) => {
  const x = req.params.shortURL;
  const longURL = urlDatabase[x];
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {urls: urlDatabase, user:users[req.cookies["user_id"]]}
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    users
  }
  res.render("urls_show", templateVars, users);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
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