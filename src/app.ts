import { startJobs } from "#jobs/index.js";
import { migrate, seed } from "#postgres/knex.js";

await migrate.latest();
await seed.run();

startJobs();

console.log("All migrations and seeds have been run");