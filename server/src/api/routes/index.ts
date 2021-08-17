import express from 'express';
import { addTask, deleteTask, doneTask, getTasks } from '../controllers';

export const Todo = express.Router();

Todo.get('/tasks', getTasks);

Todo.post('/task/add', addTask);

Todo.delete('/task/delete/:id', deleteTask);

Todo.post('/task/done/:id', doneTask);
