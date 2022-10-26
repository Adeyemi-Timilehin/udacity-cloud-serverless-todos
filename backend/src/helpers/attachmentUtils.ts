import * as AWS from 'aws-sdk'
const AWSXRay=require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
// TODO: Implement the fileStogare logic 


// const docClient = new XAWS.DynamoDB.DocumentClient()
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
const  bucketName=process.env.ATTACHMENT_S3_BUCKET

export function getUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    })
  }
  