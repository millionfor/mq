const { producerInitial, producerPost, handlerConsumer } = require('../')

const CONNECTION_SETTING = 'amqp://xxx:5672'
const CHANNEL_NAME = 'wx_tasks'

producerInitial(CONNECTION_SETTING)

setInterval(() => {
  producerPost(CHANNEL_NAME, { time: new Date() })
}, 1000)

handlerConsumer(CONNECTION_SETTING, CHANNEL_NAME, (payload, channel, msg) => {
  console.log('logger-[payload]', payload)
  setTimeout(() => {
    channel.ack(msg)
  }, 3000)
})
