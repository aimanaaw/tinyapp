const getUserByEmail = function(checkEmail, database) {
  for (let usr in database) {
    if (checkEmail === database[usr].email) {
      return database[usr];
    };
  };
}

const checkURLOwner = function(id, someURL, urlDatabase) {
    if (urlDatabase[someURL].userID === id) {
      return true;
    } else {
      return false;
    }
}

const urlsOwnedByUser = function (id, urlDatabase) {
  let URLOfUser = {};
  for(let url in urlDatabase) {
    if(urlDatabase[url].userID === id) {
      console.log(url);
      URLOfUser[url] = urlDatabase[url].longURL;
    }
  }
  console.log(URLOfUser);
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