const process = require('./../DataAccessLayer/processDB')
const bodyParser = require('body-parser')
const { hashPlain } = require('./../KEY/crypto');


module.exports = async(app) => {
    app.put('/resetPassword',bodyParser.json(),async(req,res) => {
        const {email,requestPassword} = req.body;
        const processResult = await process.resetPass({
            email : email,
            password : hashPlain(requestPassword)
        })
        if(processResult.sqlResult === true){
            res.send({
                status : 'Succesfully'
            })
        }else{
            res.send({
                status : 'Failure'
            })
        }
        
    })
}
