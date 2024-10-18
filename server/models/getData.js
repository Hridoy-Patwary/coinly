const getDataFromAnyTable = async (tableName, rowName, rowID, db) => {
    const sql = `SELECT * FROM ${tableName} WHERE ${rowName} = '${rowID}'`;

    return new Promise((resolve) => {
        db.query(sql, (err, result) => {
            if(err) {
                console.log(err.message);
                throw err;
            }else{
                resolve({userData: result[0]})
            }
        });
    })
}

/**
 * @param {number} uid The user ID
 * @param {any} db The db to run query
 * @param {any} res The response variable to send HTTP response
 */
const getUserData = async (uid, db) => {
    const data = await getDataFromAnyTable('users', 'id', uid, db);
    return data;
}

module.exports = {
    getUserData
};