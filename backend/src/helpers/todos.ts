//  import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'

 import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// import * as createError from 'http-errors'

// // TODO: Implement businessLogic
 export function todoBuilder(todoRequest: CreateTodoRequest, userId: string ):TodoItem{
    const itemId = uuid.v4()
    const todo={
      userId: userId,
      todoId:itemId,
  "createdAt": new Date().toISOString(),
 "done": false,
 "attachmentUrl": "",
...todoRequest
}
return todo as TodoItem
 }

