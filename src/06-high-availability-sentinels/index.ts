import {Job, QueueScheduler} from "bullmq";
import {createQueue, createWorker, Message, randomMessage, sleep} from "../commons";
import Redis from "ioredis";

const MPS = 0.5;
const QUEUE_NAME = "queue-06"
const CONCURRENT_ADDERS = 1;
const CONCURRENT_WORKERS = 100;

// https://github.com/luin/ioredis#sentinel
const connection = new Redis({
    // https://hub.docker.com/r/bitnami/redis-sentinel
    // REDIS_MASTER_SET: Name of the set of Redis instances to monitor. Default: mymaster.
    name: "mymaster",

    // sentinels: [
    //     {host: "127.0.0.1", port: 26379}
    // ],
    host: "127.0.0.1",
    password: "str0ng_passw0rd",
    port: 6379

});

// connection.get("foo", function (err, result) {
//     if (err) {
//         console.error(1111111, err);
//     } else {
//         console.log(11111111111, result); // Promise resolves to "bar"
//     }
// });

const queue = createQueue(QUEUE_NAME, {connection});

const queueScheduler = new QueueScheduler(QUEUE_NAME, {connection});

const createWorkerTask = () =>
    createWorker(QUEUE_NAME, async (job: Job<Message>) => {
        console.time(`${job.name}`);
        await sleep(5 * 1000);
        console.timeEnd(`${job.name}`);
        return "ok"
    }, {concurrency: CONCURRENT_WORKERS, connection});


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
