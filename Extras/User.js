const { hashPlain } = require('./../KEY/crypto');

module.exports.User = class User {

    realName;
    #username;
    #email;
    #password;
    #school;
    #pictureSrc;
    #userEducation;
    #userPython;
    #userProvince;
    registerStatus = false;
    userScore;
    userMathLesson;
    userPyLesson;

    constructor(
        realName,
        username,
        email,
        password,
        school,
        userEducation,
        userPython,
        userProvince,
        pictureSrc = '',
    ){
        this.realName  = realName
        this.#username = username;
        this.#email = email;
        this.#password = password;
        this.#school = school;
        this.#userEducation = userEducation;
        this.#userPython = userPython;
        this.#userProvince = userProvince;
        this.#pictureSrc = pictureSrc;
        this.registerStatus = true;
        this.userScore = 0;
        this.userMathLesson = 0;
        this.userPyLesson = 0;
    }
    getStatus() {
        return this.status;
    }
    
    getUserDetails(){
        return {
            realName : this.realName || '',
            username : this.#username || null,
            email : this.#email || null,
            password : this.#password || null,
            school : this.#school || '',
            pictureSrc : this.#pictureSrc || '',
            userScore : this.userScore || 0,
            userEducation : this.#userEducation || '',
            userPython : this.#userPython || '',
            userProvince : this.#userProvince || '',
            userMathLesson : this.userMathLesson || 0,
            userPyLesson : this.userPyLesson || 0
        }
    }
    getUserDetailsAsList(){
        return [
            this.realName,
            this.#username,
            this.#email,
            this.#password || '',
            this.#school || '',
            this.#pictureSrc,
            this.userScore,
            this.#userEducation || '',
            this.#userPython || 'unknowed',
            this.#userProvince || '',
            this.userMathLesson,
            this.userPyLesson 
        ]
    }
    getUsername(){
        return this.#username;
    }
    getEmail(){
        return this.#email;
    }
    getPass(){
        return this.#password
    }
}