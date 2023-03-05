/**
 * @FileName        index
 * @CreatedTime     Thu, Mar 02, 2023 13:33
 * @LastModified    Thu, Mar 02, 2023 13:33
 * @Author          QuanQuan <millionfor@apache.org>
 * @Description     index
 */

import { producerInitial, producerPost, $logger } from './producer';
import { handlerConsumer } from './consumer';

export const logger = $logger

export { producerInitial, producerPost, handlerConsumer };
