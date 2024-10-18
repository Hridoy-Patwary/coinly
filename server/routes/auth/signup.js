const express = require('express');
const { addUser } = require('../../models/insertData');
const { createHash } = require('../../services/hashing');

const router = express.Router();


router.post('/', express.json({type: '*/*'}), async (req, res) => {
    const credentials = req.body;
    const db = req.app.locals.db;

    try {
        const pass = await createHash(credentials.password);
        const resData = await addUser(credentials.name, credentials.email, pass, db);
        res.send({status: 200, data: resData});
    } catch (err) {
        if(err){
            console.log(err);
            res.send({status: 'error'});
            throw err;
        }
    }
});

module.exports = router;