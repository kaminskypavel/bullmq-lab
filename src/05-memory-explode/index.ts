import {Job, QueueScheduler} from "bullmq";
import {createQueue, createWorker, Message, randomMessage, sleep} from "../commons";

const MPS = 10000;
const QUEUE_NAME = "queue-05"
const CONCURRENT_ADDERS = 1;
const CONCURRENT_WORKERS = 100;

const queue = createQueue(QUEUE_NAME)
const queueScheduler = new QueueScheduler(QUEUE_NAME);

const createWorkerTask = () =>
    createWorker(QUEUE_NAME, async (job: Job<Message>) => {
        console.time(`${job.name}`);
        await sleep(5*1000);
        console.timeEnd(`${job.name}`);
        return "ok"
    }, {concurrency: CONCURRENT_WORKERS});

const createQueueAddTask = () =>
    setInterval(async () => {
        const message = randomMessage();
        const {name} = message
        console.log("▶ Inserting ", name);
        await queue.add(name, message, {
            // removeOnComplete: true
        })
    }, 1000 / MPS);


for (let i = 0; i < CONCURRENT_ADDERS; i++) {
    createQueueAddTask();
}

for (let i = 0; i < CONCURRENT_WORKERS; i++) {
    createWorkerTask();
}
