const processDB = require('./../DataAccessLayer/processDB')
const {multer} = require('./../SECURE/multer')
const {authenticateGoogle,uploadToGoogleDrive,editToGoogleDrive,deleteToGoogleDrive} = require('./../SECURE/google')
const { hashPlain } = require('./../KEY/crypto');


module.exports = (app) => {
    app.all('/imageActions',multer.single("file"),async (req,res) => {
        const {type,name} = req.query
        const auth = authenticateGoogle();
        if(type === 'add'){
            const pictureStatus = await (await processDB.getUserInfos(name)).result[0].pictureSrc
            if(pictureStatus === ''){
                
                const response = await uploadToGoogleDrive(req.file,auth, hashPlain(name));
                const picturePublic = response.publicKey;

                const savePicture = await processDB.savePicture(name,picturePublic);

                res.send({
                    postStatus : savePicture.sqlStatus,
                    errorID : savePicture.sqlStatus ? (0) : (2)
                })
            }
            else{
                res.send({
                    postStatus : 0,
                    errorID : 1
                })
            }

        }
        else if(type === 'change'){
            const pictureStatus = await (await processDB.getUserInfos(name)).result[0].pictureSrc

            if(pictureStatus !== ''){
                const response = await editToGoogleDrive(req.file,auth,hashPlain(name))                
                const picturePublic = response.publicKey;
                
                const savePicture = await processDB.savePicture(name,picturePublic);
                res.send({
                    postStatus : savePicture.sqlStatus,
                    errorID : savePicture.sqlStatus ? (0) : (2)
                })
            }
            else{
                res.send({
                    postStatus : 0,
                    errorID : 1
                })
            }
        }
        else{
            const pictureStatus = await (await processDB.getUserInfos(name)).result[0].pictureSrc
            if(pictureStatus !== ''){
                await deleteToGoogleDrive(auth,hashPlain(name))
                const savePicture = await processDB.savePicture(name,'');
                res.send({
                    postStatus : savePicture.sqlStatus,
                    errorID : savePicture.sqlStatus ? (0) : (2)
                })
            }
            else{
                res.send({
                    postStatus : 0,
                    errorID : 1
                })
            }
        }
    })
}
