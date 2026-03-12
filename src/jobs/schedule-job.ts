import { getLastJobRun, upsertJobRun } from "#utils/jobs.js";

const MAX_RETRY_COUNT = process.env.MAX_RETRY_COUNT ? Number(process.env.MAX_RETRY_COUNT) : 5;

/**
 * Schedules a recurring job that runs at a specified interval.
 * If the job fails, it will retry up to MAX_RETRY_COUNT times with a 1-minute delay.
 *
 * @param jobName Name of the job
 * @param intervalMs Interval in milliseconds between job runs
 * @param jobFn Async function that performs the job
 */
export function scheduleJob(jobName: string, intervalMs: number, jobFn: () => Promise<void>) {
  async function planNextRun() {
    const lastRun = await getLastJobRun(jobName);

    const now = Date.now();

    let delay = 0;

    if (!lastRun) {
      delay = 0;
    } else {
      const nextRun = new Date(lastRun).getTime() + intervalMs;
      
      delay = Math.max(nextRun - now, 0);
    }

    setTimeout(run, delay);
  }

  /**
   * Executes the job function and handles retries on failure.
   * Updates the last run timestamp on success.
   *
   * @param retryCount Current retry attempt count
   */
  async function run(retryCount = 0) {
    try {
      await jobFn();
      await upsertJobRun(jobName);
    } catch (err) {
      console.error(`${jobName} failed`, err);
      
      if (retryCount < MAX_RETRY_COUNT) {
        console.log(`Retrying ${jobName} in 1 min (attempt ${retryCount + 1})`);

        setTimeout(() => run(retryCount + 1), 60_000);
        
        return;
      }
    }

    planNextRun();
  }

  planNextRun();
}