const bcrypt = require('bcrypt')
const saltRounds = 5;

const compareHash = (inputPassword, encryptedPassword) => {
    return bcrypt.compare(inputPassword, encryptedPassword);
}

const createHash = async (input) => {
    const hashedInput = await bcrypt.hash(input, saltRounds);
    return hashedInput;
}

module.exports = {
    createHash,
    compareHash
};