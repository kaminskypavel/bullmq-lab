import {createQueue, createWorker, randomMessage} from "../commons";

const INTERVAL = 2 * 1000;
const queue = createQueue("queue")

setInterval(async () => {
    const message = randomMessage();
    const {name} = message
    await queue.add(name, message)
}, INTERVAL);


const worker = createWorker("queue", async (job) => {
    console.log("worker processing", job.asJSON());
    return "ok"
});
