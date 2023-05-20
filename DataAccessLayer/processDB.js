const pool = require('./connection')
const {testConnect} = require('./testConnection')

module.exports.selectUser = async function selectUser(username) {
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_selectUser = `SELECT * FROM table_user WHERE username = ?`;
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows, fields] = await connection.execute(sql_selectUser, [username]);
        return {
          result: rows.length,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
    return {
      result: 0,
      sqlResult: 0,
      errorStatus: 'DB isn\'t working'
    }
  }
}
module.exports.getEmail = async function getEmail(username) {
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_selectUser = `SELECT email FROM table_user WHERE username = ?`;
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows, fields] = await connection.execute(sql_selectUser, [username]);
        return {
          result: rows[0].email,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
    return {
      result: 0,
      sqlResult: 0,
      errorStatus: 'DB isn\'t working'
    }
  }
}
module.exports.getUserInfos = async function getUserInfos(username) {
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_selectUser = `
    SELECT table_user.*,table_profile.biographyTitle,table_profile.biographyContent 
    FROM table_user 
    INNER JOIN table_profile ON table_user.id = table_profile.username 
    WHERE table_user.username = ?`;
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows, fields] = await connection.execute(sql_selectUser, [username]);
        return {
          result: rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
    return {
      result: 0,
      sqlResult: 0,
      errorStatus: 'DB isn\'t working'
    }
  }
  
}
module.exports.loginControlByEmail = async function loginControlByEmail(email) {
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_loginControlByEmail = `Select id,username From table_user Where email = ?`;

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows, fields] = await connection.execute(sql_loginControlByEmail, [email]);
        return rows
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return err;
    }
  }else{
    return {
      result: 0,
      sqlResult: 0,
      errorStatus: 'DB isn\'t working'
    }
  }
}
module.exports.loginControlByEmailAndPassword = async function loginControlByEmail({email,password}) {
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_loginControlByEmail = `Select id,username From table_user Where email = ? and password = ?`;

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows, fields] = await connection.execute(sql_loginControlByEmail, [email,password]);
        return rows
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return err;
    }
  }else{
    return {
      result: 0,
      sqlResult: 0,
      errorStatus: 'DB isn\'t working'
    }
  }
}
module.exports.resetPass = async function resetPass({email,password}) {
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_loginControlByEmail = `Update table_user Set password = ? Where email = ?`;

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows, fields] = await connection.execute(sql_loginControlByEmail, [password,email]);
        return {
          sqlResult : true
        }
      }catch(err){
        return {
          sqlResult : false,
          err
        };
      }
      finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        sqlResult : false,
        err
      };
    }
  }else{
      return {
        result: 0,
        sqlResult: 0,
        errorStatus: 'DB isn\'t working'
      }
    }
}
module.exports.registerUser = async function registerUser(userClass) {
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_addUser = `INSERT INTO table_user SET realName = ?, username = ?, email = ?, password = ?, school = ?, pictureSrc = ?, userScore= ?, userEducation= ?, userPython = ?, userProvince= ?, userMathLesson = ?, userPyLesson= ?`;
    const sql_addSecurity = `
    INSERT INTO table_security SET  
    UID = ?,
    verified = 0,
    phoneVerified = 0,
    phoneNumber = '',
    twoFactor = 0
    `
    const sql_addProfile = `
    INSERT INTO table_profile SET  
    username = ?,
    biographyTitle = 'Biyografim', 
    biographyContent = ?
    `
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows, fields] = await connection.execute(sql_addUser, userClass);
        const userID = (await this.getUserInfos(userClass[1])).result[0].id;
        const [rowsProfile, fieldsProfile] = await connection.execute(sql_addProfile, [userID,`Merhaba ben ${userClass[1]}`]);
        const [rowsSecurity, fieldsSecurity] = await connection.execute(sql_addSecurity, [userID]);

        return {
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
    return {
      result: 0,
      sqlResult: 0,
      errorStatus: 'DB isn\'t working'
    }
}
  
};
module.exports.registerCompleteByGoogle = async function registerCompleteByGoogle(temporaryUser) {
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_registerCompleteByEmail = `UPDATE table_user SET password = ?, school = ?, userEducation = ?, userPython = ?,userProvince = ? WHERE username = ?`;

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const args = [
          temporaryUser.password,
          temporaryUser.school,
          temporaryUser.userEducation,
          temporaryUser.userPython,
          temporaryUser.userProvince,
          temporaryUser.username
        ]
        const [rows, fields] = await connection.execute(sql_registerCompleteByEmail, args);
        return {
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
      } catch (err) {
        return {
          sqlStatus: 0,
          errorStatus: err
        }
      }
  }else{
    return {
      result: 0,
      sqlResult: 0,
      errorStatus: 'DB isn\'t working'
    }
  }
};
module.exports.registerCompleteByEmail = async function registerCompleteByEmail(pictureSrc, username) {
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
  const sql_registerCompleteByEmail = `UPDATE table_user SET pictureSrc = ? WHERE username = ?`;

  try {
    const connection = await pool.promise().getConnection();
    
    try {
      const [rows, fields] = await connection.execute(sql_registerCompleteByEmail, [pictureSrc, username]);
      return {
        sqlStatus: 1,
        errorStatus: false
      }
    } finally {
      if (connection) connection.release();
    }
  } catch (err) {
    return {
      sqlStatus: 0,
      errorStatus: err
    }
  }}else{
    return {
      result: 0,
      sqlResult: 0,
      errorStatus: 'DB isn\'t working'
    }
  }
}
module.exports.getLessonInfo = async function ({mathOrder,userClass,pythonOrder}){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_selectMath = `SELECT * FROM table_lesson WHERE lessonName = "math" AND lessonOrder = ? AND lessonClass = ?`;
    const sql_selectPython = `SELECT * FROM table_lesson WHERE lessonName = "python" AND lessonOrder = ?`;

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const mathSql = await connection.execute(sql_selectMath, [mathOrder,userClass]);
        const pythonSql = await connection.execute(sql_selectPython, [pythonOrder]);
        return {
          sqlStatus: 1,
          errorStatus: false,
          mathResult: mathSql[0][0]['lessonSubject'],
          pythonResult: pythonSql[0][0]['lessonSubject']
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: err,
        mathResult: 'Undefined',
        pythonResult: 'Undefined'
      }
    }
  }else{
    return {
      result: 0,
      sqlResult: 0,
      errorStatus: 'DB isn\'t working'
    }
  }
}
module.exports.getLessonDetailsByLessonNameAndClass = async function (lessonName,lessonClass){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_selectByLesson = `
    SELECT table_lesson.lessonOrder as id,lessonSubject as Subject,lessonClass as Class, lessonQuestionCount as QuestionCount, table_lessonresult.lessonResult, table_lessonresult.lessonDate 
    FROM table_lesson 
    LEFT JOIN table_lessonresult
    ON table_lesson.id = table_lessonresult.lessonID
    WHERE lessonName = ? AND lessonClass = ?
    ORDER BY lessonOrder;
    `;

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql_selectByLesson, [lessonName,lessonClass]);
        return {
          sqlStatus: 1,
          errorStatus: false,
          data : rows
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        sqlStatus: 0,
        errorStatus: err,
        data : undefined
      }
    }
  }else{
      return {
        result: 0,
        sqlResult: 0,
        errorStatus: 'DB isn\'t working'
      }
    }
}
module.exports.getLessonDetailsByLessonName = async function (lessonName){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_selectByLesson = `
    SELECT table_lesson.lessonOrder as id,lessonSubject as Subject,lessonClass as Class, lessonQuestionCount as QuestionCount, table_lessonresult.lessonResult, table_lessonresult.lessonDate 
    FROM table_lesson 
    LEFT JOIN table_lessonresult
    ON table_lesson.id = table_lessonresult.lessonID
    WHERE lessonName = ?
    ORDER BY lessonOrder;
    `;

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql_selectByLesson, [lessonName]);
        return {
          sqlStatus: 1,
          errorStatus: false,
          data : rows
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        sqlStatus: 0,
        errorStatus: err,
        data : undefined
      }
    }
  }else{
      return {
        result: 0,
        sqlResult: 0,
        errorStatus: 'DB isn\'t working'
      }
    }
}
module.exports.searchProfile = async function (){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_selectByLesson = `Select username,realName,pictureSrc from table_user`;

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql_selectByLesson);
        return {
          sqlStatus: 1,
          errorStatus: false,
          data : rows
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        sqlStatus: 0,
        errorStatus: err,
        data : undefined
      }
    }
  }else{
      return {
        result: 0,
        sqlResult: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.setContact = async function(contactDetails){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_setContact = `Insert Into table_contact Set email=?, subject=?, content=?, date=?, status=?`;

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql_setContact,contactDetails);
        return {
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getOrderAsGlobal = async function(username){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
   
    const sql_getOrder = `
      SELECT rank, realName, username, pictureSrc, userScore
      FROM (
        SELECT rank, realName, username, pictureSrc, userScore
        FROM (
          SELECT *, RANK() OVER (ORDER BY userScore DESC) AS rank
          FROM table_user
        ) AS t
        WHERE userScore > (SELECT userScore FROM table_user WHERE username = ?)
        ORDER BY userScore ASC 
        LIMIT 3
      ) AS t1
      UNION 
      SELECT rank, realName, username, pictureSrc, userScore
      FROM (
        SELECT *, RANK() OVER (ORDER BY userScore DESC) AS rank
        FROM table_user
        LIMIT 21
      ) AS t2
      WHERE userScore <= (SELECT userScore FROM table_user WHERE username = ?) OR username = ?
      ORDER BY userScore DESC;
      

      `;


    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql_getOrder,[username,username,username]);
        return {
          result: rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getOrderAsLocal = async function(username){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
   
    const value = await (await this.getUserInfos(username)).result
    const {school,userProvince} = value[0]
    const sql_getOrder = `
        SELECT rank, realName, username, pictureSrc, userScore
        FROM (
            SELECT rank, realName, username, pictureSrc, userScore
            FROM (
                SELECT *, RANK() OVER (ORDER BY userScore DESC) AS rank
                FROM table_user
            ) AS t
            WHERE userScore > (SELECT userScore FROM table_user WHERE username = ?)
            AND school = ? AND userProvince = ?
            ORDER BY userScore ASC
            LIMIT 3
        ) AS t1
        UNION 
        SELECT rank, realName, username, pictureSrc, userScore
        FROM (
            SELECT *, RANK() OVER (ORDER BY userScore DESC) AS rank
            FROM table_user
        ) AS t2
        WHERE userScore <= (SELECT userScore FROM table_user WHERE username = ?)
        AND school = ? AND userProvince = ? OR username = ?
        ORDER BY userScore DESC 
        LIMIT 21;
    
      `;


    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql_getOrder,[username,school,userProvince,username,school,userProvince,username]);
        
        return {
          result: rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getNots = async function(username){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_getOrder = `
      Select notContent as Content, notDate as Date From table_nots Where usernameID=(Select id From table_user Where username = ?)
      `;


    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql_getOrder,[username]);
        return {
          result: rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getChat = async function(username){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_getChat = `
      
      SELECT
      user.realName as realname,
      user.username as username,
      user.pictureSrc as picture,
      c.chatContent as lastContent,
      MAX(c.chatTime) AS lastChatTime,
      CASE 
          WHEN c.sender_username = user.id THEN 1
          ELSE 0
      END AS lastMessageSentByUser,
      c.readStatus as isRead

      FROM table_chat c
      JOIN table_user user
        ON user.id = c.sender_username OR user.id = c.receiver_username
      WHERE user.username <> ? OR (
        c.sender_username = (SELECT id FROM table_user WHERE username = ?) 
        OR c.receiver_username = (SELECT id FROM table_user WHERE username = ?)
      )
      
      GROUP BY user.username
      ORDER BY lastChatTime DESC
      `;


    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql_getChat,[username,username,username]);
        return {
          result: rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getChatMessages = async function(nowUsername,toUsername){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_getChat = `
        
    (SELECT
      chatContent AS content,
      chatTime AS date,
      CASE WHEN sender_username = (SELECT id FROM table_user WHERE username = ?) THEN 1 ELSE 0 END AS isUserSentMessage
      FROM table_chat
      WHERE (sender_username = (SELECT id FROM table_user WHERE username = ?) AND receiver_username = (SELECT id FROM table_user WHERE username = ?))
      OR (receiver_username = (SELECT id FROM table_user WHERE username = ?) AND sender_username = (SELECT id FROM table_user WHERE username = ?) )
      ORDER BY chatTime ASC);
      `;


    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql_getChat,[nowUsername,nowUsername, toUsername,nowUsername,toUsername]);
        return {
          result: rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getChatMessagesBySchool = async function(username,schoolName){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_getChat = `
        
    SELECT 
    (SELECT username FROM table_user WHERE id = sender_username) AS sender,
    chatContent AS content,
    chatTime AS date,
    CASE WHEN sender_username = (SELECT id FROM table_user WHERE username = ?) THEN 1 ELSE 0 END AS isUserSentMessage
    FROM table_chat 
    WHERE
    receiver_username = ?
      `;


    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql_getChat,[username,schoolName]);
        return {
          result: rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result: 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.setReadStatus = async function(nowUsername,toUsername){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_setReadStatus = `
        UPDATE table_chat 
        SET 
        readStatus=1
        WHERE
        (sender_username = (SELECT id FROM table_user WHERE username = ?) AND receiver_username = (SELECT id FROM table_user WHERE username = ?))
        OR 
        (receiver_username = (SELECT id FROM table_user WHERE username = ?) AND sender_username = (SELECT id FROM table_user WHERE username = ?) )
      `;


    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql_setReadStatus,[nowUsername, toUsername, nowUsername, toUsername]);
        return {
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.newMessage = async function(styledData,type){
  
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let sql_newMessage;
    if(type === 'personel'){
      sql_newMessage = `
      INSERT INTO table_chat SET chatContent = ?, sender_username = (SELECT id FROM table_user WHERE username = ?), receiver_username = (SELECT id FROM table_user WHERE username = ?), chatTime = ?, readStatus = ?
    `;
    }else{
      sql_newMessage = `
      INSERT INTO table_chat SET chatContent = ?, sender_username = (SELECT id FROM table_user WHERE username = ?), receiver_username = ?, chatTime = ?, readStatus = ?
    `;
    }
    
    

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql_newMessage,styledData);
        return {
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getSchoolName = async function(username){
  
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    const sql_getSchoolName = `
        SELECT school FROM table_user WHERE username = ?
      `;


    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql_getSchoolName,[username]);
        return {
          result : rows[0].school,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.actionProfile = async function({utp,upto,date},type){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let sql_actionProfile;
    if(type === 'like'){
      
      sql_actionProfile = `
        INSERT INTO 
        table_likeprofile 
        SET 
        processerUsername= (SELECT id FROM table_user WHERE username = ?), 
        processedUsername = (SELECT id FROM table_user WHERE username = ?), 
        processDate = ?
      `;
    }else{
      sql_actionProfile = `
        INSERT INTO 
        table_followprofile 
        SET 
        followingUser= (SELECT id FROM table_user WHERE username = ?), 
        followedUser = (SELECT id FROM table_user WHERE username = ?), 
        date = ?
      `
    }
    


    try {
      const connection = await pool.promise().getConnection();

      if(type === 'like'){
        const likeTestSQL = 'SELECT * FROM table_likeprofile WHERE processerUsername = (SELECT id FROM table_user WHERE username = ?) AND processedUsername = (SELECT id FROM table_user WHERE username = ?)'
        const [rows,fields] = await connection.execute(likeTestSQL,[upto,utp]);
        if(rows.length !== 0){
          return {
            result : 0,
            sqlStatus: 0,
            errorStatus: 'You already like this profile.'
          }
        }
      }else{
        const followTestSQL = 'SELECT * FROM table_followprofile WHERE followingUser = (SELECT id FROM table_user WHERE username = ?) AND followedUser = (SELECT id FROM table_user WHERE username = ?)'
        const [rows,fields] = await connection.execute(followTestSQL,[upto,utp]);
        if(rows.length !== 0){
          return {
            result : 0,
            sqlStatus: 0,
            errorStatus: 'You already followed this profile.'
          }
        }
      }
      
      try {
        
        const [rows,fields] = await connection.execute(sql_actionProfile,[upto,utp,date]);
        return {
          result : 1,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getProfileScores = async function(username,type){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let sql_getProfileScore,sqlData;

    if(type === 'like'){
      sqlData = [
        username
      ]
      sql_getProfileScore = ` 
      SELECT COUNT(*) as count FROM table_likeprofile
      WHERE processedUsername = (SELECT id FROM table_user WHERE username = ?)
      `
    }
    else if(type === 'orderInSchool')
    {
      sqlData = [
        username,
        username,
        username
      ]
      sql_getProfileScore = ` 
      SELECT ranked_users.rank 
      FROM (
        SELECT username,RANK() OVER (ORDER BY userScore DESC) AS rank 
        FROM table_user
        WHERE school = (SELECT school FROM table_user WHERE username = ?)
      	AND 
        userProvince = (SELECT userProvince FROM table_user WHERE username = ?)
      ) AS ranked_users
      WHERE username = ?
      `
    }
    else if(type === 'orderInProvince')
    {
      sqlData = [
        username,
        username
      ]
      sql_getProfileScore = ` 
      SELECT ranked_users.rank
      FROM (
        SELECT username,RANK() OVER (ORDER BY userScore DESC) AS rank 
        FROM table_user
      	WHERE userProvince = (SELECT userProvince FROM table_user WHERE username = ?)
          
      ) AS ranked_users
      WHERE username = ?
      `
    }
    else if(type === 'lastTenDayScore')
    {
      sqlData = [
        username
      ]
      sql_getProfileScore = ` 
      SELECT COUNT(*) * 100 AS score 
      FROM table_lessonresult 
      WHERE username = (SELECT id FROM table_user WHERE username = ?) 
      AND DATE_SUB(CURDATE(), INTERVAL 10 DAY) <= lessonDate;

      `
    }

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows,fields] = await connection.execute(sql_getProfileScore,sqlData);
        return {
          result : rows[0],
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getFollow = async function(username,type){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let sql_getFollow,sqlData;

    if(type === 'follower'){
      sqlData = [
        username
      ]
      sql_getFollow = ` 
      SELECT IFNULL(NULLIF(user.pictureSrc, ''), '/assest/img/userIcons/unknown.png') as pictureSrc, user.realName AS realname, user.username
      FROM table_followprofile fp
      INNER JOIN table_user user
      ON user.id = fp.followingUser
      WHERE followedUser = (SELECT id FROM table_user WHERE username = ?)

      
      `
    }
    else if(type === 'followed')
    {
      sqlData = [
        username
      ]
      sql_getFollow = ` 
      SELECT IFNULL(NULLIF(user.pictureSrc, ''), '/assest/img/userIcons/unknown.png') as pictureSrc, user.realName AS realname, user.username
      FROM table_followprofile fp
      INNER JOIN table_user user
      ON user.id = fp.followedUser
      WHERE followingUser = (SELECT id FROM table_user WHERE username = ?)
      `
    }

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows,fields] = await connection.execute(sql_getFollow,sqlData);
        return {
          result : rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getFollowCount = async function(username){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){

    const sql_getFollowCount = `
    SELECT 
    (SELECT COUNT(*) FROM table_followprofile WHERE followedUser = (SELECT id FROM table_user WHERE username = ?)) AS follower, 
    (SELECT COUNT(*) FROM table_followprofile WHERE followingUser = (SELECT id FROM table_user WHERE username = ?)) AS followed
    `

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows,fields] = await connection.execute(sql_getFollowCount,[username,username]);
        return {
          result : rows[0],
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getSecurity = async function(username){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){

    const sql_getSecurity = `
    SELECT verified FROM table_security WHERE UID = (SELECT id FROM table_user WHERE username = ?)
    `

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows,fields] = await connection.execute(sql_getSecurity,[username]);
        return {
          result : rows[0],
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.setReport = async function({utp,upto,date},reportContent){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){

    const sql_getFollowCount = `
      INSERT INTO table_report SET 
      complainingUser = (SELECT id FROM table_user WHERE username = ?),
      complainedUser = (SELECT id FROM table_user WHERE username = ?),
      reportContent = ?,
      date = ?
    `

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows,fields] = await connection.execute(sql_getFollowCount,[upto,utp,reportContent,date]);
        return {
          result : rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.setVerify = async function({username,type}){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let sql_setVerify;
    if(type){
      sql_setVerify = `
      UPDATE table_security 
      SET 
      verified = 1 
      WHERE
      UID = (SELECT id FROM table_user WHERE username = ?)
    `
    }else{
      sql_setVerify = `
      UPDATE table_security 
      SET 
      phoneVerified = 1 
      WHERE
      UID = (SELECT id FROM table_user WHERE username = ?)
    `
    }
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows,fields] = await connection.execute(sql_setVerify,[username]);
        return {
          result : 1,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.saveThemeChanges = async function(username,{title,content}){
  
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    
    const sql_save = `
    UPDATE table_profile SET
    biographyTitle = ?,
    biographyContent = ?
    WHERE username = (SELECT id FROM table_user WHERE username = ?)
    `
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows,fields] = await connection.execute(sql_save,[title,content,username]);
        return {
          result : 1,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.savePassword = async function(username,hashPassword){
  
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    
    const sql_save = `
    UPDATE table_user SET
    password = ?
    WHERE username = ?
    `
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows,fields] = await connection.execute(sql_save,[hashPassword,username]);
        return {
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.savePicture = async function(username,publicUrl){
  
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    
    const sql_save = `
    UPDATE table_user SET
    pictureSrc = ?
    WHERE username = ?
    `
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows,fields] = await connection.execute(sql_save,[publicUrl,username]);
        return {
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getSettingValues = async function(username){  
  const resultTest = await testConnect()
  if(resultTest.dbStatus){

    const sql_getUserValues = `
    SELECT 
    realName as rn, 
    user.username as un, 
    school, 
    IFNULL(NULLIF(pictureSrc, ''), '/assest/img/userIcons/unknown.png') as src,
    userScore as score,
    userEducation as eduLevel,
    userProvince as province,
    security.verified as v,
    security.phoneNumber as pn,
    security.phoneVerified as pv,
    profile.biographyTitle as bt,
    profile.biographyContent as btc
    FROM table_user user
    INNER JOIN table_security security
    ON user.id = security.UID
    INNER JOIN table_profile profile
    ON user.id = profile.username
    WHERE user.username = ?
    `

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows,fields] = await connection.execute(sql_getUserValues,[username]);
        return {
          result : {...rows[0]},
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.deleteAccount = async function(username) {
  const resultTest = await testConnect();
  if (resultTest.dbStatus) {
    const sql_deleteFromProfile = `
      DELETE FROM table_profile WHERE username = (SELECT id FROM table_user WHERE username = ?)
    `;
    const sql_deleteFromResult = `
      DELETE FROM table_lessonresult WHERE username = (SELECT id FROM table_user WHERE username = ?)
    `;
    const sql_deleteFromFollow = `
      DELETE FROM table_followprofile WHERE followingUser = (SELECT id FROM table_user WHERE username = ?) OR followedUser = (SELECT id FROM table_user WHERE username = ?)
    `;
    const sql_deleteFromLike = `
      DELETE FROM table_likeprofile WHERE processerUsername = (SELECT id FROM table_user WHERE username = ?) OR processedUsername = (SELECT id FROM table_user WHERE username = ?)
    `;
    const sql_deleteFromChat = `
      DELETE FROM table_chat WHERE sender_username = (SELECT id FROM table_user WHERE username = ?) OR receiver_username = (SELECT id FROM table_user WHERE username = ?)
    `;
    const sql_deleteFromNote = `
      DELETE FROM table_nots WHERE usernameID = (SELECT id FROM table_user WHERE username = ?)
    `;
    const sql_deleteFromReport = `
      DELETE FROM table_report WHERE complainingUser = (SELECT id FROM table_user WHERE username = ?) OR complainedUser = (SELECT id FROM table_user WHERE username = ?)
    `;
    const sql_deleteFromSecurity = `
      DELETE FROM table_security WHERE UID = (SELECT id FROM table_user WHERE username = ?)
    `;
    const sql_deleteFromUser = `
      DELETE FROM table_user WHERE username = ?
    `;

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        await connection.execute(sql_deleteFromProfile, [username]);
        await connection.execute(sql_deleteFromResult, [username]);
        await connection.execute(sql_deleteFromFollow, [username, username]);
        await connection.execute(sql_deleteFromLike, [username, username]);
        await connection.execute(sql_deleteFromChat, [username, username]);
        await connection.execute(sql_deleteFromNote, [username]);
        await connection.execute(sql_deleteFromReport, [username, username]);
        await connection.execute(sql_deleteFromSecurity, [username]);
        await connection.execute(sql_deleteFromUser, [username]);
        
        return {
          sqlStatus: 1,
          errorStatus: false
        };
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
    return {
      sqlStatus: 0,
      errorStatus: err
    };
  }
  } else {
    return {
      sqlStatus: 0,
      errorStatus: 'DB isn\'t working'
    };
  }
};
module.exports.getLessonByNameClassAndID = async function(name,lesClass,id){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let data,sql;
    if(name === 'math'){
      data = [name,lesClass,id]
      sql = `
        SELECT 
        id,
        lessonSubject as subject,
        lessonQuestionCount as question
        FROM table_lesson 
        WHERE
        lessonName = ? AND
        lessonClass = ? AND
        lessonOrder = ?
      `;
    }
    else{
      data = [name,id]
      sql = `
        SELECT 
        id,
        lessonSubject as subject,
        lessonQuestionCount as question
        FROM table_lesson 
        WHERE
        lessonName = ? AND
        lessonOrder = ?
      `;
    }
    

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql,data);
        return {
          result : rows[0],
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getLessonQuestion = async function(id){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let data,sql;
    data = [id]
    sql = `
    SELECT
    questionContent as content,
    level as questionLevel,
    optionA as A,
    optionB as B,
    optionC as C,
    optionD as D,
    answer as questionAnswer,
    questionType as type
    FROM table_question
    WHERE 
    lessonID = ?
    `
    

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql,data);
        return {
          result : rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getLessonInformation = async function(id){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let data,sql;
    data = [id]
    sql = `
    SELECT
    informationVideo as video,
    informationXML as xml
    FROM table_information
    WHERE 
    lessonID = ?
    `
    

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql,data);
        return {
          result : rows[0],
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.testLessonAlreadyTested = async function(name,id){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let data,sql;
    data = [id,name]
    sql = `
    SELECT
    CASE WHEN EXISTS (
        SELECT 1 FROM table_lessonresult
        WHERE lessonID = ? 
        AND username = (SELECT id FROM table_user WHERE username = ?)
    ) THEN 1 ELSE 0 END AS result

    `
    

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql,data);
        return {
          result : rows[0].result,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.setLessonResult = async function(unm,lesID,result,date){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let sql;
    sql = `
    INSERT INTO table_lessonresult (username, lessonID, lessonResult, lessonDate)
    SELECT table_user.id, ?, ?, ?
    FROM table_user
    WHERE username = ?;
    `;
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows,fields] = await connection.execute(sql,[lesID,JSON.stringify(result).toString(),date,unm]);
        return {
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.updateLesson = async function(unm,lessonName,addedScore){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let sql;
    
    if(lessonName === 'math'){
      sql = `
      UPDATE table_user 
      SET 
      userScore = userScore + ?,
      userMathLesson = userMathLesson + 1
      WHERE username = ?
    `;
    }else{
      sql = `
      UPDATE table_user 
      SET 
      userScore = userScore + ?,
      userPyLesson = userPyLesson + 1
      WHERE username = ?
    `;
    }
    
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows,fields] = await connection.execute(sql,[addedScore,unm]);
        return {
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.setPython = async function(unm,status = 0){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let sql,data;
    data = [status,unm]
      sql = `
      UPDATE table_user 
      SET 
      userPython = 'processed',
      userPyLesson = ?
      WHERE username = ?
    `;
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        const [rows,fields] = await connection.execute(sql,data);
        return {
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getQuestionsForPythonTest = async function(id){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let sql;
    sql = `
    SELECT
      DISTINCT table_lesson.lessonOrder AS questionID,
      table_question.questionContent AS content,
      table_question.level AS questionLevel,
      table_question.optionA AS A,
      table_question.optionB AS B,
      table_question.optionC AS C,
      table_question.optionD AS D,
      table_question.answer AS questionAnswer,
      table_question.questionType AS type
    FROM
      table_question
    LEFT JOIN
      table_lesson ON table_lesson.id = table_question.lessonID
    WHERE
      table_lesson.lessonName = 'python'  
    GROUP BY
      questionID
    ORDER BY questionID ASC;
    `
    

    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql);
        return {
          result : rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getQuestionsForTrial = async function(eduLevel,pyLevel){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    let sql;
    if(parseInt(pyLevel)){  
      sql = `
        SELECT
            table_lesson.lessonOrder AS questionID,
            table_lesson.lessonClass AS class,
            table_question.questionContent AS content,
            table_question.level AS questionLevel,
            table_question.optionA AS A,
            table_question.optionB AS B,
            table_question.optionC AS C,
            table_question.optionD AS D,
            table_question.answer AS questionAnswer,
            table_question.questionType AS type
          FROM
            table_question
          LEFT JOIN
            table_lesson ON table_lesson.id = table_question.lessonID
      WHERE
          table_lesson.lessonName = 'math' AND table_lesson.lessonClass = ? OR table_lesson.lessonClass = 0
          ORDER BY RAND() 
          LIMIT 20;
        `
    }else{
      sql = `
            SELECT
            table_lesson.lessonOrder AS questionID,
            table_lesson.lessonClass AS class,
            table_question.questionContent AS content,
            table_question.level AS questionLevel,
            table_question.optionA AS A,
            table_question.optionB AS B,
            table_question.optionC AS C,
            table_question.optionD AS D,
            table_question.answer AS questionAnswer,
            table_question.questionType AS type
          FROM
            table_question
          LEFT JOIN
            table_lesson ON table_lesson.id = table_question.lessonID
      WHERE
          table_lesson.lessonName = 'math' AND table_lesson.lessonClass = ?
          ORDER BY RAND() 
          LIMIT 20;
        `
    }
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql,[eduLevel]);
        return {
          result : rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.getQuestionAsRandom = async function(eduLevel,pyLevel){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    sql = `
    SELECT
      DISTINCT table_lesson.lessonOrder AS questionID,
      table_question.questionContent AS content,
      table_question.level AS questionLevel,
      table_question.optionA AS A,
      table_question.optionB AS B,
      table_question.optionC AS C,
      table_question.optionD AS D,
      table_question.answer AS questionAnswer,
      table_question.questionType AS type
    FROM
      table_question
    LEFT JOIN
      table_lesson ON table_lesson.id = table_question.lessonID
    WHERE
      table_lesson.lessonName = 'python'  
    GROUP BY
      questionID
    ORDER BY questionID ASC;
    `
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql,[eduLevel]);
        return {
          result : rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
module.exports.setNoteForLesson = async function(unm,notContent,notDate){
  const resultTest = await testConnect()
  if(resultTest.dbStatus){
    sql = `
    INSERT INTO table_nots (usernameID, notContent, notDate)
    SELECT table_user.id, ?, ?
    FROM table_user
    WHERE username = ?;
    `
    try {
      const connection = await pool.promise().getConnection();
      
      try {
        
        const [rows,fields] = await connection.execute(sql,[notContent,notDate,unm]);
        return {
          result : rows,
          sqlStatus: 1,
          errorStatus: false
        }
      } finally {
        if (connection) connection.release();
      }
    } catch (err) {
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: err
      }
    }
  }else{
      return {
        result : 0,
        sqlStatus: 0,
        errorStatus: 'DB isn\'t working'
      }
  }
}
