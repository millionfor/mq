/**
 * @FileName        producer
 * @CreatedTime     Thu, Mar 02, 2023 12:40
 * @LastModified    Thu, Mar 02, 2023 12:40
 * @Author          QuanQuan <millionfor@apache.org>
 * @Description     MQ生产者
 */

import { getLogger } from '@millionfor/logger';

const mqLib = require('amqplib/callback_api');

const logger = getLogger({ 
  colour: true,
  timeStamp: true,
  prefix: true,
  logLevel: 'info'
});

const gContext: {
  connection: any;
  channel: any
} = {
  connection: null,
  channel: null
}

export const $logger = logger

export const producerInitial = (connectionSetting: string)=> {
  new Promise((resolve, reject) => {
    logger.info('[MQ] => ', 'Connecting to RabbitMQ service.');
    mqLib.connect(connectionSetting, (err: any, connection: any) => {
      if (!!err) {
        reject(err);
      } else {
        logger.info('[MQ] => ', 'Connect RabbitMQ service successful!');
        gContext.connection = connection;
        connection.createChannel((err: any, channel: any) => {
          if (!!err) {
            reject(err);
          } else {
            logger.info('[MQ] => ', 'Create Channel successful!');
            gContext.channel = channel;
            resolve(null);
          }
        });
      }
    });
  });
}

export const producerPost = (chName: string, payload: any) => {
  new Promise((resolve, reject) => {
    const { connection, channel } = gContext;
    if (!connection || !channel) {
      logger.error('[MQ] => ', 'Connection or channel is not ready');
      return reject('Connection or channel is not ready')
    };
    logger.log('[MQ] => ', payload);
    channel.assertQueue(chName, { durable: true });
    channel.sendToQueue(chName, Buffer.from(JSON.stringify(payload)), { persistent: true });
    resolve(null);
  });
}


