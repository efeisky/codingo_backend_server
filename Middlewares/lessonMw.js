const processDB = require('../DataAccessLayer/processDB')
const bodyParser = require('body-parser')

module.exports = (app) => {
    app.get('/getLessonDetailsByLessonName',bodyParser.json(),async(req,res) => {
        const {lessonName,username} = req.query
        if(lessonName === 'math'){
            const user = await processDB.getUserInfos(username)
            const userClass = user.result[0].userEducation
            
                const lessonRes = await processDB.getLessonDetailsByLessonNameAndClass(lessonName,userClass)
                if(lessonRes.sqlStatus){
                    if(lessonRes.data !== undefined){
                        res.send({
                            status : 1,
                            maxValue : user.result[0].userMathLesson,
                            lessonDatas : lessonRes.data
                        })
                    }else{
                        res.send({
                            status : 1,
                            lessonDatas : 'Not found'
                        })
                    }
                }else{
                    res.send({
                        status : 0,
                        err : lessonRes.errorStatus
                    })
                }
            
        }else{
            const user = await processDB.getUserInfos(username)
            if(user.result[0].userPython === ''){
                res.send({
                    status : 0,
                    err : 'No Defined'
                })
            }
            else{
                const lessonRes = await processDB.getLessonDetailsByLessonName(lessonName)
                if(lessonRes.sqlStatus){
                    if(lessonRes.data !== undefined){
                        res.send({
                            status : 1,
                            maxValue : user.result[0].userPyLesson,
                            lessonDatas : lessonRes.data
                        })
                    }else{
                        res.send({
                            status : 1,
                            lessonDatas : 'Not found'
                        })
                    }
                }else{
                    res.send({
                        status : 0,
                        err : lessonRes.errorStatus
                    })
                }
            }
            
        }
    })
    app.get('/lessonData',async(req,res)=>{
        const {username,name,lesClass,id} = req.query;

        let lesData = await processDB.getLessonByNameClassAndID(name,lesClass,id);
        let questionValues,informationValues,alreadyData;
        if(lesData.result){
            alreadyData = await processDB.testLessonAlreadyTested(username,lesData.result.id)
            questionValues = await processDB.getLessonQuestion(lesData.result.id);
            informationValues = await processDB.getLessonInformation(lesData.result.id);
            
            if(alreadyData.result){
                res.send({
                    lessonValues : lesData.result,
                    status : lesData.sqlStatus,
                    isAvailable : 0,
                    alreadyTested : 1,
                })
            }else{
                res.send({
                    lessonValues : lesData.result,
                    status : lesData.sqlStatus,
                    isAvailable : lesData.result ? 1 : 0,
                    alreadyTested : alreadyData.result,
                    questionValues : questionValues.sqlStatus ? questionValues.result : null,
                    informationValues : {
                        hasInformation : informationValues.result ? true : false,
                        videoSrc : informationValues.result ? informationValues.result.video : null,
                        xml : informationValues.result ? informationValues.result.xml : null
                    }
                })
            }
            
        }
        else{
            res.send({
                lessonValues : lesData.result,
                status : lesData.sqlStatus,
                isAvailable : lesData.result ? 1 : 0,
                alreadyTested : 0,
            })
        }
        
    })
    app.post('/setAfterLesson',bodyParser.json(),async(req,res)=>{
        const {username,addedScore,lessonClass,lessonName,lessonOrder,lessonResult,notValues} = req.body;
        
        const lessonID = (await processDB.getLessonByNameClassAndID(lessonName,lessonClass,lessonOrder)).result.id;

        const addResult = await processDB.setLessonResult(username,lessonID,lessonResult,new Date().toISOString().slice(0,10))
        const updateLessonValues = await processDB.updateLesson(username,lessonName,addedScore)
        if(notValues.length > 0){
            const noteDate = lessonName === 'math' ? `1-${lessonOrder}` : `0-${lessonOrder}`
            
            const addNote = await processDB.setNoteForLesson(username,JSON.stringify(notValues),noteDate);
        }
        
        res.send({
            status : addResult.sqlStatus && updateLessonValues.sqlStatus ? true : false
        })
    })
    app.patch('/setPythonData',bodyParser.json(),async(req,res)=>{
        
        if(req.body.isKnow){
            const pythonSet = await processDB.setPython(req.body.username,req.body.level);
            
            res.send({
                patchStatus : pythonSet.sqlStatus
            })
        }
        else{
            const pythonSet = await processDB.setPython(req.body.username);
            
            res.send({
                patchStatus : pythonSet.sqlStatus
            })
        }
    })
    app.get('/getQuestion',async(req,res)=>{
        const questions = await processDB.getQuestionsForPythonTest()
        res.send({
            status : questions.sqlStatus,
            questionValues : questions.result
        })
    })
    app.get('/getQuestionForTrial',async(req,res)=>{
        const {eduLevel,knowPy} = req.query;
        
        const questions = await processDB.getQuestionsForTrial(eduLevel,knowPy)
        
        res.send({
            status : questions.sqlStatus,
            questionValues : questions.result
        })
    })
    
}
