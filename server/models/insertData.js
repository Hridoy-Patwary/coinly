const addUser = async (name, email, password, db) => {
    const time = new Date().getTime();
    const sql = `INSERT INTO users (name, email, password, time) VALUES ('${name}', '${email}', '${password}', '${time}')`;
    const sqlToGetTheId = `SELECT * FROM users WHERE email = '${email}'`;

    const checkEmail = new Promise((resolve) => {
        db.query(sqlToGetTheId, (err, result) => {
            if(err){
                console.log(err);
                throw err;
            }else {
                resolve(result);
            };
        })
    });

    const data = await checkEmail;
    if(data[0] == undefined){
        return new Promise((resolve) => {
            db.query(sql, (err) => {
                if(err) {
                    console.log(err.message);
                    throw err;
                }
            });

            db.query(sqlToGetTheId, (err, rslt) => {
                if(err) {
                    console.log(err.message);
                    throw err;
                }else{
                    if(rslt[0]){
                        resolve({userData: rslt[0]});
                    }else{
                        resolve(null);
                    }
                }
            });
        })
    }else{
        return 'user already exist';
    }
}

module.exports = {
    addUser
}