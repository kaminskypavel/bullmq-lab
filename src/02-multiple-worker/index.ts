import {createQueue, createWorker, Message, randomMessage} from "../commons";
import {Job, QueueEvents} from "bullmq";


const INTERVAL = 5 * 10;
const QUEUE_NAME = "queue"


const queue = createQueue(QUEUE_NAME)
const queueEvents = new QueueEvents(QUEUE_NAME)

const worker1 = createWorker(QUEUE_NAME, async (job: Job<Message>) => {
    return "worker 1 : " + job.name
},);

const worker2 = createWorker(QUEUE_NAME, async (job: Job<Message>) => {
    return "worker 2 : " + job.name
});


setInterval(async () => {
    const message = randomMessage();
    const {name} = message
    await queue.add(name, message, {removeOnComplete: true})
}, INTERVAL);


queueEvents.on('completed', async (job) => {
    console.log(job.returnvalue, job.jobId);
});
