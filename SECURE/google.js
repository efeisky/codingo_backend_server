const {google} = require('googleapis')
const {bufferToStream} = require('./stream')

const findFileID = async (auth, username ) => {
  const fileName = username;
  const driveService = google.drive({ version: "v3", auth });
  const response = await driveService.files.list({
    q: `name = '${fileName}' and mimeType contains 'image/'`,
    fields: 'files(id, name)',
  });

  const files = response.data.files;
  return files[0].id;
   
}

module.exports.authenticateGoogle = () => {
    const auth = new google.auth.GoogleAuth({
      keyFile: `${__dirname}/../KEY/codingonode-82064a92a024.json`,
      scopes: "https://www.googleapis.com/auth/drive",
    });
    return auth;
  };

module.exports.uploadToGoogleDrive = async (file, auth,username) => {
    const fileMetadata = {
      name: username,
      parents: ["15pXBicNZJcmr18wV9kv4WG4p0bmskw-P"]
    };
  
    const media = {
      mimeType: file.mimetype,
      body: bufferToStream(file.buffer),
    };
  
    const driveService = google.drive({ version: "v3", auth });
  
    const response = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",  
    });

    const publicKey = await this.createPublicKey(auth,username)
    return {
      response,
      publicKey
    };
  };

module.exports.editToGoogleDrive = async (file, auth,username) => {
  const fileID = await findFileID(auth,username)

  const media = {
    mimeType: file.mimetype,
    body: bufferToStream(file.buffer),
  };
  
  const driveService = google.drive({ version: "v3", auth });
  
  const response = await driveService.files.update({
    fileId: fileID,
    media: media
  });

  const publicKey = await this.createPublicKey(auth, username)
  return {
    response,
    publicKey
  };
};
module.exports.deleteToGoogleDrive = async (auth,username) => {
  const fileID = await findFileID(auth,username)

  const driveService = google.drive({ version: 'v3', auth });

  const response = await driveService.files.delete({
    fileId: fileID
  });
};

module.exports.createPublicKey = async (auth,username) => {
    try {
      const fileName = username;
      const driveService = google.drive({ version: "v3", auth });
      const response = await driveService.files.list({
        q: `name = '${fileName}' and mimeType contains 'image/'`,
        fields: 'files(id, name)',
      });

      const files = response.data.files;
      if (files.length) {
        const fileId = files[0].id;
        
        await driveService.permissions.create({
          fileId,
          requestBody:{
            role: 'reader',
            type: 'anyone'
          }
        })

        const result = await driveService.files.get({
          fileId,
          fields: 'webViewLink, webContentLink'
        })
        return result.data.webContentLink;
      } else {
        return `"${fileName}" adında bir resim bulunamadı.`;
}
    } catch (error) {
      return error;
    }
  };