import {Processor, Queue, QueueOptions, Worker,} from 'bullmq';
import {WorkerOptions} from "bullmq/src/interfaces/index";
import * as faker from "faker";
import express from "express";

const bullMaster = require("bull-master");

export type Message = {
    name: string,
    createdAt: Date
}

export const createQueue = (queueName: string, opts?: QueueOptions) => {
    const queue = new Queue<Message>(queueName, opts)
    attachUI(queue);
    return queue;
};

export const createWorker = (queueName: string, processor: Processor, opts?: WorkerOptions) =>
    new Worker<Message>(queueName, processor, opts);

export const randomMessage = (): Message => ({
    name: faker.internet.userName(),
    createdAt: new Date()
})

export const attachUI = (queue: Queue) => {
    const app = express()

    const bullMasterApp = bullMaster({
        queues: [queue]
    });

    app.use('/', bullMasterApp)
    app.listen(8080, async () => {
        console.log(`open http://localhost:8080`);
        // await open('http://localhost:8080', {wait: true});
    });
}


export const sleep = (milliseconds:number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
