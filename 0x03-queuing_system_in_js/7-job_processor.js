import { createQueue } from 'kue';

const queue = createQueue();

const blacklist = ['4153518780', '4153518781'];

function sendNotification(phoneNumber, message, job, done) {
  if (blacklist.includes(job.data.phoneNumber)) {
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  job.progress(0, 50);
  job.progress(50, 100);

  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );
  return done();
}

queue.process('push_notification_code_2', 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});
