import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  createStyles,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import { Delete, Done } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import './App.css';
import { api } from './services/api';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    felxbox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    container: {
      height: '100vh',
    },
    card: {
      minWidth: 400,
    },
    listitems: {
      width: 360,
    },
  })
);

type tasks = {
  id?: number;
  task_title: string;
  done: boolean;
};

export const App: React.FC = () => {
  const [taskName, setTaskName] = useState('');

  const [taskList, setTaskList] = useState<tasks[]>([]);

  const updateTask = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setTaskName(e.target.value);
  };

  const addTask = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (taskName !== '') {
      // setTaskList([...taskList, taskName]);
      postTask(taskName);
      setTaskName('');
    }
  };

  const deleteTask = async (id?: number) => {
    const api_res = await api.delete(`/task/delete/${id}`);
    if (api_res.status === 200) getTasks();
  };

  const handleDone = async (id?: number) => {
    const api_res = await api.post(`task/done/${id}`);
    if (api_res.status === 200) getTasks();
  };

  const getTasks = async () => {
    const api_res = await api.get('/tasks');
    setTaskList(api_res.data);
  };

  const postTask = async (taskName: string) => {
    const api_res = await api.post('/task/add', { task_title: taskName });
    if (api_res.status === 201) getTasks();
  };

  useEffect(() => {
    getTasks();
  }, []);

  const styles = useStyles();
  return (
    <Box
      className={styles.container}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card className={styles.card}>
        <CardHeader title="To Do List"></CardHeader>
        <CardContent>
          <form className={styles.felxbox} onSubmit={addTask}>
            <TextField
              label="Add Task"
              variant="outlined"
              size="small"
              className={styles.listitems}
              value={taskName}
              onChange={updateTask}
              autoFocus
            />
            <IconButton aria-label="delete" onClick={addTask}>
              <Done />
            </IconButton>
          </form>
          <Box className={clsx(styles.listitems)}>
            <List>
              {taskList.map((value: tasks, index: number) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                return (
                  <ListItem key={index} button className={styles.felxbox}>
                    <ListItemIcon>
                      <Checkbox
                        edge="end"
                        onChange={() => handleDone(value.id)}
                        checked={value.done}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>

                    <ListItemText id={labelId} primary={value.task_title} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => deleteTask(value?.id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
