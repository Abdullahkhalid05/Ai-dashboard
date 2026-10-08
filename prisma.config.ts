import path from 'node:path'
import { defineConfig } from 'prisma/config'

process.env.DATABASE_URL = "postgresql://postgres.msdugzygracfmdlytofm:Km%40sood9481@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL,
  },
})


// import path from "node:path";
// import { defineConfig } from "prisma/config";

// export default defineConfig({
//   schema: path.join("prisma", "schema.prisma"),
//   datasource: {
//     url: process.env.DATABASE_URL,
//   },
// });