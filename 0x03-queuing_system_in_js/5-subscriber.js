import { createClient } from 'redis';

const client = createClient();

client
  .on('connect', () => {
    console.log('Redis client connected to the server');
  })
  .on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err}`);
  });

client.subscribe('holberton school channel');

client.on('message', (channel, message) => {
  if (channel !== 'holberton school channel') {
    return;
  }

  if (message === 'KILL SERVER') {
    client.unsubscribe('holberton school channel');
    console.log(message);
    client.quit();

    return;
  }

  console.log(message);
});
