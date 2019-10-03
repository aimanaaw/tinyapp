const getUserByEmail = function(checkEmail, database) {
  for (let usr in database) {
    if (checkEmail === database[usr].email) {
      return database[usr];
    };
  };
}

const checkURLOwner = function(id, urlDatabase) {
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      return true;
    }
  }
}

const urlsOwnedByUser = function (id, urlDatabase) {
  let URLOfUser = {};
  for(let x in urlDatabase) {
    if(urlDatabase[x].userID === id) {
      URLOfUser[x] = urlDatabase[x].longURL;
    }
  }
  if (URLOfUser === undefined) {
    return false;
  } else {
    return URLOfUser;
  }
}

const generateNewShortUrl = function () {
  let newShortUrl = "";
  for (let i = 0; i < 6; i ++) {
    letCodeAt = Math.random() * (123 - 97) + 97;
    newShortUrl += String.fromCharCode(letCodeAt);
  }
  return newShortUrl;
}

module.exports = {getUserByEmail, checkURLOwner, urlsOwnedByUser, generateNewShortUrl};