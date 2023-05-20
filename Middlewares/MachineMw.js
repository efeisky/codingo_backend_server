const processDB = require('./../DataAccessLayer/processDB')
const bodyParser = require('body-parser')

module.exports = (app) => {
    app.post('/pythonMachine',bodyParser.json(),async (req,res) => {
        try {
            const response = await fetch('http://127.0.0.1:7000/python/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ result: req.body.result }),
            });
        
            if (response.ok) {
              const data = await response.json();
              res.send({
                status : 1,
                data
              })
            } else {
              res.send({
                status : 0,
                error : 'HTPP error'
              })
            }
          } catch (error) {
            res.send({
                status : 0,
                error : error
              })
          }
    })
    app.get('/getQuestionForPractice',async(req,res)=>{
      const {username,lessonName} = req.query;
      try {
        const response = await fetch('http://127.0.0.1:7000/practice/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username : username, lesson: lessonName}),
        });
    
        if (response.ok) {
          let data;
          data = await response.json();
          res.send({
            status : 1,
            incomingValue : data
          })
        } else {
          res.send({
            status : 0,
            error : 'HTPP error'
          })
        }
      } catch (error) {
        res.send({
            status : 0,
            error : error
          })
      }
  })
}