const processDB = require('../DataAccessLayer/processDB')
const bodyParser = require('body-parser')

module.exports = (app) => {
    app.get('/profileByUsername',async(req,res) => {
        let {username} = req.query;
        let server_url = process.env.SERVER_URL

        const userInfo = await processDB.getUserInfos(username);
        
        if(userInfo.sqlStatus){
            if(userInfo.result.length === 0){
                res.send({
                    processResult : 1,
                    formattedData : 'Unknown User'
                })
            }else{
                let fetchEdu = '1';
                if(userInfo.result[0].userEducation > 12){
                    fetchEdu = '0'
                }
                const responseScore = await fetch(`${server_url}/profileScoreValues?username=${username}&edu=${fetchEdu}`, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json'
                    }
                });
                
                const responseFollower = await fetch(`${server_url}/getFollowerCount?username=${username}`, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json'
                    }
                });

                const responseSecurity = await fetch(`${server_url}/getProfileSecurity?username=${username}`, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json'
                    }
                })
                
                const scoreValues = await responseScore.json();
                const followerValues = await responseFollower.json();
                const securityValue = await responseSecurity.json();
                
                const formatData = {
                    realName : userInfo.result[0].realName,
                    username : userInfo.result[0].username,
                    school : userInfo.result[0].school,
                    province : userInfo.result[0].userProvince,
                    picture : userInfo.result[0].pictureSrc,
                    score : userInfo.result[0].userScore,
                    eduLevel : userInfo.result[0].userEducation,
                    pythonLevel : userInfo.result[0].userPython,
                    mathLessonNo : userInfo.result[0].userMathLesson,
                    pythonLessonNo : userInfo.result[0].userPyLesson,
                    biographyTitle: userInfo.result[0].biographyTitle,
                    biographyContent: userInfo.result[0].biographyContent,
                    likeCount : scoreValues.datas.likeCount,
                    orderInSchool : scoreValues.datas.orderInSchool,
                    orderInProvince : scoreValues.datas.orderInProvince,
                    lastTenDayScore : scoreValues.datas.lastTenDayScore,
                    follower : followerValues.followDatas.follower,
                    followed : followerValues.followDatas.followed,
                    security : securityValue.securityDatas.verified
                }
                res.send({
                    processResult : 1,
                    formattedData : formatData
                })
                
            }
            
        }else{
            res.send({
                processResult : 0,
                err : userInfo.errorStatus
            })
        }
    })
    app.get('/searchProfile',async(req,res) => {
        const profiles = await processDB.searchProfile()
        if(profiles.sqlStatus){
            res.send({
                profile : profiles.data,
                err: false
            })
        }else{
            res.send({
                err: true
            })
        }
    })
    app.post('/profileActions',bodyParser.json(),async (req,res)=>{
        const {transaction, utp, upto} = req.body;

        if(transaction === 'like'){
            const likeProcess = await processDB.actionProfile({
                utp : utp,
                upto : upto,
                date : new Date().toISOString().slice(0,10)
            },transaction)
            if(likeProcess.sqlStatus){
                res.send({
                    status : 1
                })
            }else{
                res.send({
                    status : 0,
                    errorMsg : likeProcess.errorStatus
                })
            }
        }else{
            const followProcess = await processDB.actionProfile({
                utp : utp,
                upto : upto,
                date : new Date().toISOString().slice(0,10)
            },transaction)
            
            if(followProcess.sqlStatus){
                res.send({
                    status : 1
                })
            }else{
                res.send({
                    status : 0,
                    errorMsg : followProcess.errorStatus
                })
            }
        }
    })
    app.get('/profileScoreValues',async (req,res)=>{
        let {username,edu} = req.query;

        
        const likeValue = await processDB.getProfileScores(username,'like');
        let orderInSchool;
        if(parseInt(edu) === 1){
            orderInSchool = await processDB.getProfileScores(username,'orderInSchool')
        }
        const orderInProvince = await processDB.getProfileScores(username,'orderInProvince')
        const lastTenDayScore = await processDB.getProfileScores(username,'lastTenDayScore')
        res.send({
            status : 1,
            datas : {
                likeCount       : likeValue.result.count,
                orderInSchool   : orderInProvince.result.rank,
                orderInProvince : orderInProvince.result.rank,
                lastTenDayScore : lastTenDayScore.result.score
            }
        })
    })
    app.get('/getFollowValues',async (req,res)=>{
        const {username,type} = req.query;

        const followData = await processDB.getFollow(username,type)

        if(followData.sqlStatus){
            res.send({
                status : 1,
                followDatas : followData.result
            })
        }else{
            res.send({
                status : 0,
                followDatas : followData.result
            })
        }
    })
    app.get('/getFollowerCount',async (req,res)=>{
        const {username} = req.query;

        const followData = await processDB.getFollowCount(username)
        if(followData.sqlStatus){
            res.send({
                status : 1,
                followDatas : followData.result
            })
        }else{
            res.send({
                status : 0,
                followDatas : followData.result
            })
        }
    })
    app.get('/getProfileSecurity',async (req,res)=>{
        const {username} = req.query;
        const securityData = await processDB.getSecurity(username)
        if(securityData.sqlStatus){
            res.send({
                status : 1,
                securityDatas : securityData.result
            })
        }else{
            res.send({
                status : 0,
                securityDatas : securityData.result
            })
        }
    })
    app.post('/sendReportProfile',bodyParser.json(),async (req,res)=>{
        const {utp,upto,reportContent} = req.body;

        const sendReport = await processDB.setReport({
            utp : utp,
            upto : upto,
            date : new Date().toISOString().slice(0,10)
        },reportContent)

        if(sendReport.sqlStatus){
            res.send({
                sendStatus : 1
            })
        }else{
            res.send({
                sendStatus : 0
            })
        }
    })
}
