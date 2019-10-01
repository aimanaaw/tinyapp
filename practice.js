function generateRandomString() {
  let str = "";
  for (let i = 0; i < 6; i ++) {
    letCodeAt = Math.random() * (123 - 97) + 97;
    str = str + String.fromCharCode(letCodeAt);
  }
  return str

}

console.log(generateRandomString());