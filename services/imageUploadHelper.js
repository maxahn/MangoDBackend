const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { uuid } = require('uuidv4');
require('dotenv').config();

/** Adapted from https://github.com/badunk/multer-s3 , https://www.youtube.com/watch?v=ASuU4km3VHE, and
 *  https://stackoverflow.com/questions/40494050/uploading-image-to-amazon-s3-using-multer-s3-nodejs */

const s3Configuration = new aws.S3({
  accessKeyId: process.env.AWS_IAM_USER_KEY,
  secretAccessKey: process.env.AWS_IAM_USER_SECRET,
  region: process.env.AWS_REGION
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/svg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
};

const multerS3Configuration = multerS3({
  s3: s3Configuration,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    console.log(file);
    let newID = uuid();
    cb(null, newID + '-' + file.originalname);
  }
});


const imageUpload = multer({
  storage: multerS3Configuration,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 // only allow images under 1 MB
  }
});

module.exports = imageUpload;