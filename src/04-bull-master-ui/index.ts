// https://github.com/hans-lizihan/bull-master

import express from "express";
import {Job} from "bullmq";
import open from "open";
import {createQueue, createWorker, Message, randomMessage} from "../commons";

const bullMaster = require("bull-master");


const INTERVAL = 0.2 * 1000;
const QUEUE_NAME = "queue-04"

const queue = createQueue(QUEUE_NAME)
const app = express()


const bullMasterApp = bullMaster({
    queues: [queue]
});

app.use('/', bullMasterApp)

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

app.listen(8080, async () => {
    await open('http://localhost:8080', {wait: true});
});
