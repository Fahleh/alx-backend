import { createClient, print } from 'redis';

const client = createClient();

client
  .on('error', (err) =>
    console.log(`Redis client not connected to the server: ${err}`)
  )
  .on('connect', () => {
    console.log('Redis client connected to the server');
  });

const data = {
  Portland: '50',
  Seattle: '80',
  'New York': '20',
  Bogota: '20',
  Cali: '40',
  Paris: '2',
};

for (const [key, value] of Object.entries(data)) {
  client.hset('HolbertonSchools', key, value, print());
}

client.hgetall('HolbertonSchools', (err, value) => {
  if (err) {
    console.error('error');
    return;
  }

  console.log(value);
});
