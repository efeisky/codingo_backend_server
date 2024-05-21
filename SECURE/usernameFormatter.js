module.exports.usernameFormatter = (str) => {
    if (typeof str !== 'string') {
        throw new Error('Girdi bir string olmalıdır.');
    }
    return str.replace(/\s+/g, '_');
}
