const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3();

const uploadFile = (fileName, bucketName) => {
  const fileContent = fs.readFileSync(fileName);

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file:', err);
    } else {
      console.log(`File uploaded successfully. ${data.Location}`);
    }
  });
};

// Usage
uploadFile('step2_side_mar7(2).mp4', 'pace-concussion-videos');
