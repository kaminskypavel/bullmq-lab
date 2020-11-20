import {createQueue, createWorker, Message, randomMessage} from "../commons";
import {Job} from "bullmq";

const INTERVAL = 2 * 1000;

const queue = createQueue("queue-01")

setInterval(async () => {
    const message = randomMessage();
    const {name} = message
    await queue.add(name, message)
}, INTERVAL);


const worker = createWorker("queue", async (job: Job<Message, void>) => {
    console.log("worker processing", job.name);
    return "ok"
});
