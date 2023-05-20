const { Message } = require('../Extras/Message')
const processDB = require('./../DataAccessLayer/processDB')
const bodyParser = require('body-parser')
module.exports = (app) => {
    app.get('/userDetailForChat',async (req,res) => {
        const {username} = req.query

        const userDetail = await processDB.getUserInfos(username)
        const {realName,pictureSrc} = userDetail.result[0]
        if(pictureSrc === ''){
            res.send({
                realName,
                pictureSrc : '/assest/img/userIcons/unknown.png'
            })
        }else{
            res.send({
                realName,
                pictureSrc
            })
        }
        
    })
    app.get('/chatUserList',async (req,res) => {
        const {username} = req.query
        const chatDetails = await processDB.getChat(username)
        if(chatDetails.sqlStatus){
            res.send({
                data : chatDetails.result,
                status : 1
            })
        }else{
           res.send({
                data : null,
                status : 0
           })
        }
    })
    app.get('/messageListByChat',async (req,res) => {
        const {nowUsername, toUsername} = req.query;
        let server_url = process.env.SERVER_URL

        const response = await fetch(`${server_url}/setReadStatus`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nowUsername,
              toUsername
            })
          });
          const data = await response.json();
          let readStatusSetted;
          if(data.putStatus){
            readStatusSetted = true
          }else{
            readStatusSetted = false
          }
        

        const getList = await processDB.getChatMessages(nowUsername,toUsername)
        if(getList.sqlStatus){
            res.send({
                data : getList.result,
                status : 1,
                readStatusSetted
            })
        }else(
            res.send({
                data : null,
                status : 0,
                readStatusSetted
            })
        )
        
    })
    app.put('/setReadStatus',bodyParser.json(),async (req,res) => {
        const {nowUsername, toUsername} = req.body;

        const putReadStatus = await processDB.setReadStatus(nowUsername,toUsername)
        if (putReadStatus.sqlStatus) {
            res.send({
                putStatus: 1,
                responseStatus: 200
            })
            
        } else {
            res.send({
                putStatus: 0,
                responseStatus: 200
            })
        }
    })
    app.post('/newMessageForChat',bodyParser.json(),async (req,res) => {
        const {messageContent,messageDate,messageSender,messageReceiver,chatType} = req.body;

        const styledMessage = new Message(
            messageContent,
            messageSender,
            messageReceiver,
            messageDate
        )
        const sendMessage = await processDB.newMessage(styledMessage.getMessageValues(),chatType)
        
        if(sendMessage.sqlStatus){
            res.send({
                status : 1
            })
        }else{
            res.send({
                status : 0
            })
        }
    })
    app.get('/getSchoolForChat',async (req,res) => {
        const {username} = req.query;

        const schoolData = await processDB.getSchoolName(username);
        if(schoolData.sqlStatus){
            res.send({
                name : schoolData.result,
                status : 1
            })
        }else{
            res.send({
                name : '',
                status : 0
            })
        }
        
    })
    app.get('/messageListBySchoolChat',async (req,res) => {
        const {username,name} = req.query;
        const chatData = await processDB.getChatMessagesBySchool(username,name)
        if(chatData.sqlStatus){
            res.send({
                data : chatData.result,
                status : 1
            })
        }else(
            res.send({
                data : null,
                status : 0
            })
        )
        
    })
}
