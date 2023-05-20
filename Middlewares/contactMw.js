const process = require('./../DataAccessLayer/processDB')
const bodyParser = require('body-parser')
const { Contact } = require('./../Extras/Contact');

module.exports = (app) => {
    app.post('/setContact',bodyParser.json(),async (req,res) => {
        const {email,subject,content} = req.body
        const contactModel = new Contact(
            email,
            subject,
            content
        )
        const setToDB = await process.setContact(contactModel.getContactValues())
        if(setToDB.sqlStatus === 1){
            res.send({
                status:1
            })
        }else{
            res.send({
                status:0,
                error : setToDB.errorStatus
            })
        }
        
        
    })
}