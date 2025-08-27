import config from "./config";

export interface QueueItem {
  job: () => Promise<Uint8Array>;
  resolve: (value: Uint8Array) => void;
  reject: (error: Error) => void;
}

// Simple queue to limit concurrent jobs
let runningJobs = 0;
const waitingQueue: QueueItem[] = [];

export async function addToQueue(
  job: () => Promise<Uint8Array>
): Promise<Uint8Array> {
  console.log(
    `[${new Date().toISOString()}] Queue: Adding job to queue. Current queue length: ${
      waitingQueue.length
    }, Running jobs: ${runningJobs}`
  );

  return new Promise<Uint8Array>((resolve, reject) => {
    waitingQueue.push({ job, resolve, reject });
    console.log(
      `[${new Date().toISOString()}] Queue: Job added. New queue length: ${
        waitingQueue.length
      }`
    );
    processQueue();
  });
}

function processQueue(): void {
  if (runningJobs >= config.maxConcurrent) {
    console.log(
      `[${new Date().toISOString()}] Queue: Max concurrent jobs reached (${runningJobs}/${
        config.maxConcurrent
      })`
    );
    return;
  }

  if (waitingQueue.length === 0) {
    console.log(`[${new Date().toISOString()}] Queue: No jobs in queue`);
    return;
  }

  console.log(
    `[${new Date().toISOString()}] Queue: Starting job. Running: ${
      runningJobs + 1
    }/${config.maxConcurrent}, Queue: ${waitingQueue.length - 1}`
  );

  runningJobs++;
  const { job, resolve, reject } = waitingQueue.shift()!;

  job()
    .then((result) => {
      console.log(
        `[${new Date().toISOString()}] Queue: Job completed successfully`
      );
      resolve(result);
    })
    .catch((error) => {
      console.error(`[${new Date().toISOString()}] Queue: Job failed:`, error);
      reject(error);
    })
    .finally(() => {
      runningJobs--;
      console.log(
        `[${new Date().toISOString()}] Queue: Job finished. Running: ${runningJobs}/${
          config.maxConcurrent
        }, Queue: ${waitingQueue.length}`
      );
      processQueue();
    });
}
