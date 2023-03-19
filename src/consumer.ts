/**
 * @FileName        consumer
 * @CreatedTime     Thu, Mar 02, 2023 13:42
 * @LastModified    Thu, Mar 02, 2023 13:42
 * @Author          QuanQuan <millionfor@apache.org>
 * @Description     consumer
 */

import { getLogger } from '@millionfor/logger';

const mqLib = require('amqplib');

const logger = getLogger();

export async function handlerConsumerNew<T>(connectionSetting: string, chName: string, numConsumers: number, handler: (arg: number) => Promise<T>) {
  const conn = await mqLib.connect(connectionSetting);
  const channel = await conn.createChannel();

  await channel.assertQueue(chName, { durable: true });
  await channel.prefetch(numConsumers);

  for (let i = 0; i < numConsumers; i++) {
    channel.consume(
      chName,
      async (msg: any) => {
        const content = msg.content.toString();
        
        logger.log(content);
        
        const res = await handler(content);

        logger.info(res)
        
        setTimeout(() => {
          channel.ack(msg);
        }, 100)
      },
      { noAck: false }
    );
  }
}

export const handlerConsumer = (connectionSetting: string, chName: string, callback: (payload: any, channel: any, msg: any) => void) => {
  new Promise((resolve, reject) => {
    mqLib.connect(connectionSetting, (err: any, connection: any) => {
      if (!!err) {
        reject(err);
      } else {
        connection.createChannel(async (err: any, channel: any) => {
          if (!!err) {
            reject(err);
          } else {
            channel.assertQueue(chName, { durable: true });

            channel.prefetch(1);
            channel.consume(
              chName,
              (msg: any) => {
                if (!!msg) {
                  const content = msg.content.toString();
                  logger.log(content);
                  callback(content, channel, msg);
                }
              },
              { noAck: false }
            );
            resolve(null);
          }
        });
      }
    });
  });
};
