const Multer = require('multer')

module.exports.multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
