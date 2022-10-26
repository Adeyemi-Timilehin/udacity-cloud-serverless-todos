import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getTodoById, addAttachmentUrl } from '../../helpers/todosAcess'
import { getUploadUrl } from '../../helpers/attachmentUtils'

//import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
//import { getUserId } from '../utils'
const  bucketName=process.env.ATTACHMENT_S3_BUCKET
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const todo=await getTodoById(todoId)
todo.attachmentUrl=`https://${bucketName}.s3.amazonaws.com/${todoId}`
await addAttachmentUrl(todo);
const url=await getUploadUrl(todoId)
    return {
      statusCode:201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body:JSON.stringify({
        UploadUrl:url
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )