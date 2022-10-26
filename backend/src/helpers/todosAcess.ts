import * as AWS from 'aws-sdk'
//  import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
// const logger = createLogger('TodosAccess')
const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX

const docClient: DocumentClient = createDynamoDBClient()
// TODO: Implement the dataLayer logic 
//DataLogic to create todos 
export async function createTodo(todo: TodoItem): Promise<TodoItem> {
  await docClient.put({
    TableName: todosTable,
    Item: todo
  }).promise()

  return todo
}


//data logic to add attachment
export   async function addAttachmentUrl(todo: TodoItem):Promise<TodoItem>  {
 

  const result=await docClient.update({
    TableName: todosTable,
    Key: {
      todoId: todo.todoId,
      userId: todo.userId
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',

    ExpressionAttributeValues: {
      ':attachmentUrl': todo.attachmentUrl
    }
  }).promise();
  return result.Attributes as TodoItem
}

//data logic to fetch todos by userId
export async function getAllTodosByUserId(userId: string)
  : Promise<TodoItem[]> {
  const result = await docClient.query({
    TableName: todosTable,
    IndexName: index,
    KeyConditionExpression: 'userId = :userId',
    // ExpressionAttributeNames:{
    //   '#userId':'userId'
    // }
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()
  const items = result.Items
  return items as TodoItem[]
}

//data logic to fetch todos by todoId 
export async function getTodoById(todoId: string)
  : Promise<TodoItem> {
  const result = await docClient.query({
    TableName: todosTable,
    IndexName: index,
    KeyConditionExpression: 'todoId = :todoId',
    // ExpressionAttributeNames:{
    //   '#userId':'userId'
    // }
    ExpressionAttributeValues: {
      ':todoId': todoId
    }
  }).promise()
  const items = result.Items
  if (items.length !== 0)
    return result.Items[0] as TodoItem
  return null
}
//datalogic to update
export async function updateTodoDB(todoId: string, todoUpdate: TodoUpdate, userId: string): Promise<TodoUpdate> {
  await docClient.update({
    TableName: todosTable,
    Key: {
      todoId: todoId,
      userId: userId
    },
    UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': todoUpdate.name,
      ':dueDate': todoUpdate.dueDate,
      ':done': todoUpdate.done
    }
  }).promise();
  return todoUpdate;
}

//datalogic to delete todos
export async function deleteTodo(todoId: string, userId: string) {
  await docClient.delete({
    TableName: todosTable,
    Key: {
      todoId: todoId,
      userId: userId
    }
  }).promise();

}

//connect to DynamoDBClient
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8005'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}