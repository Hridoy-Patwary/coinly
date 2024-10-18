const { compareHash } = require("../services/hashing");


const authenticateUser = async (email, pass, db) => {
    const sql = `SELECT * FROM users WHERE email = '${email}'`;

    return new Promise((resolve) => {
        db.query(sql, async (err, result) => {
            if(err){
                console.log(err);
                throw err;
            }else{
                const data = result[0];

                if(data){
                    const matched = await compareHash(pass, data.password);
                    if(matched){
                        resolve(data);
                    }else{
                        resolve(false);
                    }
                }else{
                    resolve(null);
                }
            }
        })
    })
}

module.exports = authenticateUser;