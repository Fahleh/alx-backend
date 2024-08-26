import express from 'express';
import { promisify } from 'util';
import { createClient } from 'redis';
import { createQueue } from 'kue';

const app = express();
const client = createClient({ name: 'reserve_seat' });
const PORT = 1245;
let reservationEnabled = true;
const queue = createQueue();

client
  .on('connect', () => {})
  .on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err}`);
  });

async function reserveSeat(number) {
  const asyncClientGet = promisify(client.set).bind(client);
  return asyncClientGet('available_seats', number);
}

reserveSeat(50);

async function getCurrentAvailableSeats() {
  const asyncClientGet = promisify(client.get).bind(client);
  return asyncClientGet('available_seats');
}

app.get('/available_seats', async (_, res) => {
  res.json({ numberOfAvailableSeats: await getCurrentAvailableSeats() }).end();
});

app.get('/reserve_seat', (_, res) => {
  if (reservationEnabled === false) {
    res.json({ status: 'Reservation are blocked' }).end();
    return;
  }

  const reserve = queue.create('reserve_seat').save((error) => {
    if (error) {
      res.json({ status: 'Reservation failed' }).end();
      return;
    }

    res.json({ status: 'Reservation in process' });
  });

  reserve
    .on('complete', () => {
      console.log(`Seat reservation job ${reserve.id} completed`);
    })
    .on('failed', () => {
      console.log(`Seat reservation job ${reserve.id} failed: ERROR_MESSAGE`);
    });
});

app.get('/process', (_, res) => {
  res.json({ status: 'Queue processing' }).end();

  queue.process('reserve_seat', async (job, done) => {
    const currentlyAvailable = await getCurrentAvailableSeats();

    const availableSeats = parseInt(currentlyAvailable);

    if (availableSeats === 0) {
      done(new Error('Not enough seats available'));
      return;
    }

    const seatsLeft = availableSeats - 1;

    if (seatsLeft === 0) {
      reservationEnabled = false;
    }

    reserveSeat(seatsLeft);

    done();
  });
});

app.listen(PORT);
