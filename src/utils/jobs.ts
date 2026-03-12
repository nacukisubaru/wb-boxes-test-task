import knex from "#postgres/knex.js";

/**
 * Inserts a new job run record or updates the last_run timestamp
 * if a record with the same job_name already exists.
 * @param jobName Name of the job
 * @param date Date and time of the job run (defaults to now)
 */
export async function upsertJobRun(jobName: string, date: Date = new Date()) {
  return knex('jobs_log')
    .insert({ job_name: jobName, last_run: date })
    .onConflict('job_name')
    .merge();
}

/**
 * Retrieves the last run timestamp of a given job.
 * @param jobName Name of the job
 * @returns Date of the last run, or null if the job has never run
 */
export async function getLastJobRun(jobName: string) {
  const row = await knex('jobs_log')
    .where({ job_name: jobName })
    .first();
  return row?.last_run ? new Date(row.last_run) : null;
}