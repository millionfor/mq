/**
 * @FileName        consumer
 * @CreatedTime     Thu, Mar 02, 2023 13:42
 * @LastModified    Thu, Mar 02, 2023 13:42
 * @Author          QuanQuan <millionfor@apache.org>
 * @Description     consumer
 */

import { getLogger } from '@millionfor/logger';

const mqLib = require('amqplib/callback_api');

const logger = getLogger();

export const handlerConsumer = (connectionSetting: string, chName: string, callback: (payload: any, channel: any, msg: any) => void) => {
  new Promise((resolve, reject) => {
    mqLib.connect(connectionSetting, (err: any, connection: any) => {
      if (!!err) {
        reject(err);
      } else {
        connection.createChannel((err: any, channel: any) => {
          if (!!err) {
            reject(err);
          } else {
            channel.assertQueue(chName, { durable: true });
            channel.prefetch(1);
            channel.consume(
              chName,
              (msg: any) => {
                if (!!msg) {
                  const content = msg.content.toString()
                  logger.log(content)
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

