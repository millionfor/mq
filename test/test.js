const { producerInitial, producerPost, handlerConsumerNew } = require('../');

const CONNECTION_SETTING = 'amqp://123.249.0.192:5672';
const CHANNEL_NAME = 'wx_tasks';

producerInitial(CONNECTION_SETTING);

setInterval(() => {
  producerPost(CHANNEL_NAME, { time: new Date() });
}, 1000);

// handlerConsumer(CONNECTION_SETTING, CHANNEL_NAME, (payload, channel, msg) => {
//   console.log('logger-[payload]', payload)
//   setTimeout(() => {
//     channel.ack(msg)
//   }, 3000)
// })
//

const myPromise = (val) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("logger-[val]", val);
      resolve('okokok');
    }, 3000);
  });
};

handlerConsumerNew(CONNECTION_SETTING, CHANNEL_NAME, 3, myPromise);

