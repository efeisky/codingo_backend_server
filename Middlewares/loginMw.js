const processDB = require('./../DataAccessLayer/processDB')
const { User } = require('./../Extras/User');


module.exports = (app) => {
    app.get('/loginUser',async (req,res) => {
        if(req.query.signType === 'Google'){
            const {email} = req.query
            const temporaryUser = new User(req.query.username,'',email,'','','','','')
            const signAlready = await processDB.loginControlByEmail(temporaryUser.getEmail())
            if(signAlready.length > 0){
                res.send({
                    availabilityStatus:1,
                    Content: signAlready
                })
            }else{
                res.send({
                    availabilityStatus:0
                })
            }
        }else{
            const {email,password} = req.query;
            const temporaryUser = new User(req.query.username,'',email,password,'','','','')
            const loginStatus = await processDB.loginControlByEmailAndPassword({
                email:temporaryUser.getEmail(),
                password:temporaryUser.getPass()
            })
            if(loginStatus.length > 0){
                res.send({
                    availabilityStatus:1,
                    Content: loginStatus
                })
            }else{
                res.send({
                    availabilityStatus:0
                })
            }
        }
        
    })
}
