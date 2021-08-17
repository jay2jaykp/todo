import { Response, Request, NextFunction } from 'express';
import { knex } from '../../knex';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const api_res = await knex('todo').select('*').returning('*');
    res.status(200).send(api_res);
  } catch (error) {
    console.log(error);
  }
};

export const addTask = async (req: Request, res: Response) => {
  try {
    // console.log(req.body);
    const api_res = await knex('todo').insert(req.body);
    res.status(201).send(api_res);
  } catch (error) {
    res.status(500).send('Error in adding task');
    console.log(error);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    // console.log(req.params);
    const api_res = await knex('todo').where(req.params).delete();
    res.status(200).send('Task Deleted');
  } catch (error) {
    res.status(500).send('Error deleting task');
    console.log(error);
  }
};

export const doneTask = async (req: Request, res: Response) => {
  try {
    // console.log(req.params);
    const api_res = await knex('todo').where(req.params).update({ done: true });
    res.status(200).send('Task Done');
  } catch (error) {
    res.status(500).send('Error Updating task');
    console.log(error);
  }
};
