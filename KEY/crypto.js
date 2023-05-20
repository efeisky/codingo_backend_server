const crypto = require('crypto');

function hashPlain(plaintext) {
  return crypto.createHash('sha512').update(plaintext).digest('hex');
}

function generateRandomPassword() {
  var length = 16,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      password = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}
function formatRandomPassword(password) {
  var formattedPassword = "";
  for (var i = 0; i < password.length; i++) {
    if (i > 0 && i % 4 == 0) {
      formattedPassword += " ";
    }
    formattedPassword += password[i];
  }
  return formattedPassword;
}

module.exports = { hashPlain,generateRandomPassword,formatRandomPassword };
