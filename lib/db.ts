import fs from 'fs';
import path from 'path';


export interface User {
  id: number
  email: string
  password: string
  name: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface Task {
  id: number
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed'
  userId: number
  deadline?: string
  createdAt: string
}

interface DB {
  users: User[]
  tasks: Task[]
}


const dbPath = path.join(process.cwd(), 'data', 'db.json');

export function readDB(): DB {
    const data = fs.readFileSync(dbPath, 'utf-8');

    return JSON.parse(data)
}

export function writeDB(data: DB) {
    fs.writeFileSync(dbPath , JSON.stringify(data, null, 2))
}

export function getUsers() {
    const db = readDB();
    return db.users
}

export function getTasks() {
    const db: DB = readDB();
    return db.tasks
}

export function findUserByMail(email: string) {
    const users = getUsers();

    return users.find(user => user.email === email)
}


export function createUser(userData: Omit<User, 'id'  | 'role' | 'createdAt'>): User {
    const db = readDB();

    const newUser: User = {
        id: Date.now(),
        ...userData,
        role: 'user',
        createdAt: new Date().toISOString(),
  }

  db.users.push(newUser)
  writeDB(db);
  return newUser;
}

export function createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Task {
    const db = readDB();
    const newTask: Task = {
        id: Date.now(),
        ...taskData,
        status: taskData.status || 'pending',
        createdAt: new Date().toISOString(),
    }
    db.tasks.push(newTask)
    writeDB(db)
    return newTask;
}
