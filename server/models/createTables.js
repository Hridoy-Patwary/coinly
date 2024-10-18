const createTable = (db) => {
    const sql = 'CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password TEXT, time TEXT)';
    db.query(sql, (err, result) => {
        if(err){
            console.log(err.message);
            throw err;
        }
    })
}

module.exports = {
    createTable
}