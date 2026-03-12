
import { HOUR } from "#constants/jobs.js";
import { fetchAndSaveTariffs } from "#services/tariffs.js";

import { scheduleJob } from "./schedule-job.js";

export function startJobs() {
  scheduleJob('tariffs_fetch', HOUR, fetchAndSaveTariffs);
}