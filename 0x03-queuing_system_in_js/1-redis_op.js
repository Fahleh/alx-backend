import { createClient, print } from 'redis';

const client = createClient();

client
  .on('connect', () => {
    console.log('Redis client connected to the server');
  })
  .on('error', (err) =>
    console.log(`Redis client not connected to the server: ${err}`)
  );

const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, print());
};

const displaySchoolValue = (schoolName) => {
  client.get(schoolName, (err, value) => {
    if (err) {
      console.error('error');
      return;
    }

    console.log(value);
  });
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
