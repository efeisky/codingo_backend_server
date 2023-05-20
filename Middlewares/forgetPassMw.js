const process = require('./../DataAccessLayer/processDB')
const bodyParser = require('body-parser')
const {forgetPasswordMail} = require('./../mail/mailServer')

module.exports = (app) => {
    app.post('/forgetPass',bodyParser.json(),async (req,res) => {

        const {email} = req.body
        const date = new Date();

        await forgetPasswordMail({
            toEmail: email,
            toOTP : req.body.myOTP
        })
        .then(()=>{
            res.send({
                sentStatus : 1,
                sentDate : date.toLocaleString()
            })
        })
        .catch(e => res.send(e))

        
        
    })
}