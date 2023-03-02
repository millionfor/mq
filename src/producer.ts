/**
 * @FileName        producer
 * @CreatedTime     Thu, Mar 02, 2023 12:40
 * @LastModified    Thu, Mar 02, 2023 12:40
 * @Author          QuanQuan <millionfor@apache.org>
 * @Description     MQ生产者
 */

import { getLogger } from '@millionfor/logger';

const mqLib = require('amqplib/callback_api');

const logger = getLogger();

const gContext: {
  connection: any;
  channel: any
} = {
  connection: null,
  channel: null
}

export const producerInitial = (connectionSetting: string)=> {
  new Promise((resolve, reject) => {
    logger.info('MQ init +');
    mqLib.connect(connectionSetting, (err: any, connection: any) => {
      if (!!err) {
        reject(err);
      } else {
        gContext.connection = connection;
        connection.createChannel((err: any, channel: any) => {
          if (!!err) {
            reject(err);
          } else {
            gContext.channel = channel;
            resolve(null);
          }
        });
      }
    });
    logger.info('MQ init -');
  });
}

export const producerPost = (chName: string, payload: any) => {
  new Promise((resolve, reject) => {
    const { connection, channel } = gContext;
    if (!connection || !channel) reject(new Error('Connection or channel is not ready'));
    logger.log('JSON', payload);
    channel.assertQueue(chName, { durable: true });
    channel.sendToQueue(chName, Buffer.from(JSON.stringify(payload)), { persistent: true });
    resolve(null);
  });
}


