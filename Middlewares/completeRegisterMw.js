const {multer} = require('./../SECURE/multer')
const {authenticateGoogle,uploadToGoogleDrive} = require('./../SECURE/google')
const process = require('./../DataAccessLayer/processDB')
const { hashPlain } = require('./../KEY/crypto');
const { usernameFormatter} = require('./../SECURE/usernameFormatter')

module.exports = async(app) => {
    app.put('/completeRegister',multer.single("file"),async (req,res) => {
      const hashedUsername = hashPlain(req.body.username)
      if(req.body.signType === 'Email'){
        try {
          if (!req.file) {
            res.status(400).send("No file uploaded.");
            return;
          }
          const auth = authenticateGoogle();
          const response = await uploadToGoogleDrive(req.file,auth, hashedUsername);
          const pictureSrc = response.publicKey;
          
          const completeRegister = await process.registerCompleteByEmail(pictureSrc, req.body.username)

          if(completeRegister.sqlStatus === 1){
            res.send({
              apiStatus:true,
              changedValues:true
            })
          }else{
            res.send({
              apiStatus:true,
              changedValues:false
            })
          }
        } catch (err) {
          return {
            apiStatus:false,
            changedValues:false,
            err
          }
        }
      }else{
        const {password,school,userEducation,userPython,userProvince} = JSON.parse(req.body.values)
        const completeRegister = await process.registerCompleteByGoogle(
          {
            password: password,
            school,
            userEducation,
            userPython,
            userProvince,
            username: usernameFormatter(req.body.username)
          })
        if(completeRegister.sqlStatus === 1){
          res.send({
            apiStatus:true,
            changedValues:true
          })
        }else{
          res.send({
            apiStatus:true,
            changedValues:false
          })
        }
      }
        
        
    })
}
