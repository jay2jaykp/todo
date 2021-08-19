import axios from "axios";

export const api = axios.create(
  {
    baseURL:
      process.env.NODE_ENV === "production"
        ? `${window.location.origin}/todo`
        : "http://localhost:5555/todo",
  }
  // baseURL: 'http://localhost:5000/todo',
  // }
);
