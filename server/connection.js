const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'patwaryd_coinly'
});

// const con = mysql.createConnection({
//     host: "localhost",
//     user: 'patwaryd_server',
//     password: 'server642004H',
//     database: 'patwaryd_server'
// })

const connectDB = () => {
    con.connect((err) => {
        if(err) throw err;
        console.log('connected');
    })
    return con;
}

module.exports = connectDB;