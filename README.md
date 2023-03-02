# @millionfor/mq

A portable function based on mq

## Installation

```bash
$ npm i @millionfor/mq
```

## Usage

```js
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

```

## APIs

```ts
export declare const handlerConsumer: (connectionSetting: string, chName: string, callback: (payload: any, channel: any, msg: any) => void) => void;

export declare const producerInitial: (connectionSetting: string) => void;
export declare const producerPost: (chName: string, payload: any) => void;

```

## License

MIT
