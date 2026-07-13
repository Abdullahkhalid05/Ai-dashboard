import path from 'node:path'
import { defineConfig } from 'prisma/config'

process.env.DATABASE_URL = "postgresql://postgres:Km%40sood9481@db.msdugzygracfmdlytofm.supabase.co:5432/postgres"

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL,
  },
})

//this join prisma to prisma schema and the database
// prisma orm object relation mapping connects orm connect apps written in oop to a database 

//