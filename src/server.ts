import express, { Request, Response } from 'express'
import {Pool} from "pg";
import dotenv from 'dotenv';
import path from 'path';
// Load .env from project root (no accidental leading space)
dotenv.config();

// Safe debug: show parsed DB host (do NOT print full connection string in logs)
const _conn = process.env.CONNECTION_STATUS || '';
try {
  const _url = new URL(_conn);
  console.log('DB host:', _url.hostname);
} catch (e) {
  console.log('DB connection string not set or invalid (preview):', _conn.slice(0,60));
}

// DEBUG: list environment keys that include 'CON' or 'DB' or 'PG' to find hidden keys
const envKeys = Object.keys(process.env || {});
console.log('ENV keys count:', envKeys.length);
envKeys.filter(k => /CON|DB|PG|BASE/i.test(k)).forEach(k => {
  const v = process.env[k] || '';
  console.log(`ENV-DEBUG ${k}: ${v.toString().slice(0,80)}`);
});

const app = express()
const port = 5000

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
