import {Processor, Queue, QueueOptions, Worker,} from 'bullmq';
import {WorkerOptions} from "bullmq/src/interfaces/index";
import * as faker from "faker";

export type Message = {
    name: string,
    createdAt: Date
}

export const createQueue = (queueName: string, opts?: QueueOptions) => new Queue<Message>(queueName, opts);

export const createWorker = (queueName: string, processor: Processor, opts?: WorkerOptions) =>
    new Worker<Message>(queueName, processor, opts);

export const randomMessage = (): Message => ({
    name: faker.internet.userName(),
    createdAt: new Date()
})
