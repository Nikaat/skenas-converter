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
  return new Promise<Uint8Array>((resolve, reject) => {
    waitingQueue.push({ job, resolve, reject });
    processQueue();
  });
}

function processQueue(): void {
  if (runningJobs >= config.maxConcurrent || waitingQueue.length === 0) {
    return;
  }

  runningJobs++;
  const { job, resolve, reject } = waitingQueue.shift()!;

  job()
    .then(resolve)
    .catch(reject)
    .finally(() => {
      runningJobs--;
      processQueue();
    });
}
