import express, { Request, Response } from 'express'
import {Pool} from "pg";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.join(process.cwd(),' .env')});

const app = express()
const port = 5000

console.log('server: starting (begin)')

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
})

//DB Connection
const pool = new Pool({
  connectionString:`${process.env.CONNECTION_STATUS}`
})

const initDB = async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    created_at TIMESTAMP DEFAULT  NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`)

  await pool.query(`CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )
    `);
}

// Initialize DB and log any errors so failures are visible
initDB().catch((err) => {
  console.error('initDB error:', err);
  process.exit(1);
});


// parse JSON bodies (application/json)
app.use(express.json())
// parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }))

// app.get("/", (req:Request, res:Response) => {
//   console.log(req)
//     res.send("Hello brother")
// })


app.get('/', (req: Request, res: Response) => {
  console.log('GET / hit, headers:', req.headers)
  res.send("hellow world from bejoy")
})

app.post('/', (req: Request, res: Response) => {
  console.log('POST / body:', req.body)

  res.status(201).json({
    message: 'hay i am bejoy',
    success: true,
    received: req.body,
  })
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
