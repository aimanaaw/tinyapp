const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');
const {checkURLOwner} = require('../helpers');

const testUsers = {
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
};

const testURLDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "user2RandomID"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "user2RandomID"}
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.isTrue(user.id === expectedOutput);
  });
  it('should return undefined if a non-existant email is provided during login', function() {
    const user = getUserByEmail("student@example.com", testUsers);
    const expectedOutput = undefined;
    assert.isTrue(user === expectedOutput);
  });
});

describe('checkURLOwner', function() {
  it('should return true if the user has added the URL to their list of URLs', function() {
    const user = checkURLOwner("user2RandomID", testURLDatabase);
    const expectedOutput = true;
    assert.isTrue(user === expectedOutput);
})
});

