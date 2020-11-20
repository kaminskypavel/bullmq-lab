import {Job} from "bullmq";
import {createQueue, createWorker, Message, randomMessage} from "../commons";

const INTERVAL = 0.2 * 1000;
const QUEUE_NAME = "queue-04"

const queue = createQueue(QUEUE_NAME)

const worker = createWorker(QUEUE_NAME, async (job: Job<Message>) => {
    if (Math.random() < 0.5)
        return "worker 1 : " + job.name
    else
        throw Error(job.id)
});

setInterval(async () => {
    const message = randomMessage();
    const {name} = message
    await queue.add(name, message)
}, INTERVAL);

