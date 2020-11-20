import {createQueue, createWorker, Message, randomMessage} from "../commons";
import {Job, QueueEvents, QueueScheduler} from "bullmq";

const QUEUE_NAME = "queue-03"

const queue = createQueue(QUEUE_NAME)
const queueEvents = new QueueEvents(QUEUE_NAME)
const queueScheduler = new QueueScheduler(QUEUE_NAME);

const worker1 = createWorker(QUEUE_NAME, async (job: Job<Message>) => {
    console.log("throwing", job.name);
    throw new Error(job.name)
},);


const message = randomMessage();
const {name} = message;

queue.add(name, message, {
        attempts: 3,
        backoff:
            {
                type: 'exponential',
                delay: 2 * 1000
            }
    },
).then(() => console.log("inserting", name));


queueEvents.on('completed', async (job) => {
    console.log('completed',new Date(), job.returnvalue, job.jobId);
});

queueEvents.on('failed', async (job) => {
    console.log('failed',new Date(), job.failedReason, job.jobId);
});
