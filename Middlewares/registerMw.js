const process = require('./../DataAccessLayer/processDB');
const { User } = require('./../Extras/User');
const { usernameFormatter } = require('./../SECURE/usernameFormatter')
const {registerMail} = require('./../mail/mailServer')
const bodyParser = require('body-parser')

module.exports = async(app) => {
    app.post('/registerUser',bodyParser.json(),async(req,res) => {
        var user;
        if(req.body.signType === 'Google'){
            let {username,email,pictureSrc} = req.body
            const goodUsername = usernameFormatter(username)
            console.log(goodUsername)
            user = new User(username,goodUsername,email,'','','','','',pictureSrc)
        }else{
            let {username,email,password,school,userEducation,userPython,userProvince} = req.body;
            const goodUsername = usernameFormatter(username)
            user = new User(username,goodUsername,email,password,school,parseInt(userEducation),userPython,userProvince)
        }

        if(user.registerStatus !== true){
            res.send({
                status: 0,
                errorID: 1,
                errorMessage: 'The transaction cannot be processed at the moment'
            })
            throw new Error("Registration failed due to class")
        }else{
            const signAlready = await process.selectUser(user.getUsername())
            if(signAlready.result !== 0){
                res.send({
                    status: 0,
                    errorID: 2,
                    errorMessage: 'This user is already registered'
                })
            }else{
                const register = await process.registerUser(user.getUserDetailsAsList())
                console.log("Buradayız en sonunda")
                console.log(register)
                if(register.sqlStatus === 1){
                    let {username,email} = req.body;
                    registerMail({
                            toUsername: username,
                            styleUsername : usernameFormatter(username),
                            toEmail:email
                    })
                    .catch(e => console.log(e))

                    res.send({
                        status: 1,
                        errorID: 0,
                        errorMessage: ''
                    })
                }else{
                    res.send({
                        status: 0,
                        errorID: 3,
                        errorMessage: 'A glitch in the system has emerged.'
                    })
                }
            }
            
        }
    })
}
