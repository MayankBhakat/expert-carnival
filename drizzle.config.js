/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://ai-interview-mocker_owner:s0UK9nLgcxXQ@ep-empty-forest-a19g8zd9.ap-southeast-1.aws.neon.tech/ai-interview-mocker?sslmode=require',
    }
  };