const express = require('express');
const authenticateUser = require('../../models/authenticate');

const router = express.Router();


router.post('/', express.json({type: '*/*'}), async (req, res) => {
    const body = req.body;
    const db = req.app.locals.db;

    try {
        const foundUser = await authenticateUser(body.email, body.password, db);
        let resStatus = 'Not found!';

        if(foundUser === false){
            resStatus = "Password didn't match!";
        }else if(foundUser){
            resStatus = 200;
        }

        res.send({status: resStatus, data: foundUser});
    } catch (err) {
        if(err){
            console.log(err);
            res.send({status: 'error'});
            throw err;
        }
    }
})

module.exports = router;