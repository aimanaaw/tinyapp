const getUserByEmail = function(checkEmail, database) {
  for (let usr in database) {
    if (checkEmail === database[usr].email) {
      return database[usr];
    };
  };
}

const checkURLOwner = function(id, someURL, urlDatabase) {
  return urlDatabase[someURL].userID === id
}

const urlsOwnedByUser = function (id, urlDatabase) {
  let URLOfUser = {};
  for(let url in urlDatabase) {
    if(urlDatabase[url].userID === id) {
      URLOfUser[url] = urlDatabase[url].longURL;
    }
  }
  return URLOfUser;
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