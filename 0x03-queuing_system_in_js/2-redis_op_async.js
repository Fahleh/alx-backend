import { promisify } from 'util';
import { createClient, print } from 'redis';

const client = createClient();

client
  .on('error', (err) =>
    console.log(`Redis client not connected to the server: ${err}`)
  )
  .on('connect', () => {
    console.log('Redis client connected to the server');
  });

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print());
}

const displaySchoolValue = async (schoolName) => {
  const asyncClientGet = promisify(client.get).bind(client);
  console.log(await asyncClientGet(schoolName));
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
