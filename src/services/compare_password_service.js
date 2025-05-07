const bcrypt = require('bcryptjs');

function comparePasswordService(login_password, user_hash)
{
    let isCorrect = bcrypt.compareSync(login_password, user_hash);
    return isCorrect;
}

module.exports = comparePasswordService;