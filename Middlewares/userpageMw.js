const processDB = require('../DataAccessLayer/processDB')
const bodyParser = require('body-parser')
const {verificationMail} = require('./../mail/mailServer')
const {generateRandomPassword,formatRandomPassword, hashPlain}  = require('./../KEY/crypto.js')

module.exports = (app) => {
    app.get('/headerData',async (req,res) => {
        const {username} = req.query;
        
        const headerData = (await processDB.getUserInfos(username)).result[0]
        const requiredData = {
            username : headerData.username,
            realname : headerData.realName,
            src : headerData.pictureSrc === '' ? ('/assest/img/userIcons/unknown.png') : (headerData.pictureSrc),
            score : headerData.userScore
        }
        res.send({
            ...requiredData
        })
    })
    app.get('/getUserMainpage',async(req,res) => {
        let {username} = req.query;
        const userInfo = (await processDB.getUserInfos(username)).result[0];
        if(userInfo.userEducation){
            const lessonInfo = (await processDB.getLessonInfo({
                mathOrder : userInfo.userMathLesson,
                userClass : userInfo.userEducation,
                pythonOrder : userInfo.userPyLesson
            }));
            res.send({
                lessonDatas : {
                    mathNumber : userInfo.userMathLesson,
                    mathSubject : lessonInfo.mathResult,
                    pythonNumber : userInfo.userPyLesson,
                    userClass : userInfo.userEducation,
                    pythonSubject : lessonInfo.pythonResult,
                    userPython : userInfo.userPython === '' ? ('unknowed') : (userInfo.userPython)
                },
                eduLevel : userInfo.userEducation,
                userCompleted : 1
            })
        }else{
            res.send({
                userCompleted : 0
            })
        }
        
    })
    app.get('/getOrder',async(req,res)=>{
        const {username,type} = req.query
        let resultProcess;
        if(type === 'local'){
            resultProcess =  await processDB.getOrderAsLocal(username);
        }else{
            resultProcess =  await processDB.getOrderAsGlobal(username);
        }

        if(resultProcess.sqlStatus){
            res.send({
                status : 1,
                result : resultProcess.result
            })
        }else{
            res.send({
                status : 0,
                result : null
            })
        }
        
    })
    app.get('/getNots',async(req,res)=>{
        const {username} = req.query
        const resultProcess =  await processDB.getNots(username);

        if(resultProcess.sqlStatus){
            res.send({
                status : 1,
                result : resultProcess.result
            })
        }else{
            res.send({
                status : 0,
                result : null
            })
        }
        
    })
    app.get('/getSetting',async (req,res)=> {
        const {name} = req.query;

        const settingData = await processDB.getSettingValues(name)
        if(settingData.sqlStatus){
            res.send({
                status : 1,
                result : {...settingData.result}
            })
        }else{
            res.send({
                status : 0,
                result : null
            })
        }
    })
    app.post('/sendVerificationCode',bodyParser.json(),async (req,res)=> {
        const {name} = req.body;

        const codeData = await processDB.selectUser(name)
        if(codeData.result){
            const securityData = await processDB.getSecurity(name)
            if(!securityData.result.verified){
                
                const email = await (await processDB.getEmail(name)).result
                const key = formatRandomPassword(generateRandomPassword()) 
                
                await verificationMail({
                    toEmail : email,
                    toOTP : key
                })
                .then(()=>{
                    res.send({
                        status : 1,
                        formattedKey : key
                    })
                })
                .catch(e => res.send({
                    status : 0,
                    errorID : 3
                }))
            }
            else{
                res.send({
                    status : 0,
                    errorID : 2
                })
            }
        }else{
            res.send({
                status : 0,
                errorID : 1
            })
        }
        
    })
    app.put('/setVerify',bodyParser.json(),async (req,res)=> {
        const {name,type} = req.body;
        if(type === 'Email'){
            const verifyData = await processDB.setVerify({
                username : name,
                type : 1
            })
            if(verifyData.sqlStatus){
                res.send({
                    status : 1
                })
            }else{
                res.send({
                    status : 0
                })
            }
        }else{
            const verifyData = await processDB.setVerify({
                username : name,
                type : 0
            })
            if(verifyData.sqlStatus){
                res.send({
                    status : 1
                })
            }else{
                res.send({
                    status : 0
                })
            }
        }
        
    })
    app.put('/saveThemeChanges',bodyParser.json(),async (req,res)=> {
        const {name,biography} = req.body;

        const saveData = await processDB.saveThemeChanges(name,{
            title : biography.biographyTitle,
            content : biography.biographyContent
        })
        res.send({
            status : saveData.sqlStatus
        })
    })
    app.put('/changePassword',bodyParser.json(),async (req,res)=> {
        const {name,password} = req.body;
        const hashPassword = hashPlain(password)
        const saveData = await processDB.savePassword(name,hashPassword)
        res.send({
            saveStatus : saveData.sqlStatus
        })
    })
    app.delete('/deleteAccount',bodyParser.json(),async (req,res)=>{
        const {name} = req.query;
        console.log(name)
        //const reqData = await processDB.deleteAccount(name);
        
        res.send({
            deleteStatus : 1
        })
    })
}
