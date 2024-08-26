import { createQueue } from 'kue';
import { describe, it } from 'mocha';
import createPushNotificationsJobs from './8-job';

const queue = createQueue();

describe('does something cool', () => {
  before(() => {
    queue.testMode.enter();
  });

  afterEach(() => {
    queue.testMode.clear();
  });

  after(() => {
    queue.testMode.exit();
  });

  it('core test part', () => {
    const data = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 12345 to verify your account',
      },
    ];

    createPushNotificationsJobs(data, queue);

    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[0].data).to.eql({
      phoneNumber: '4153518780',
      message: 'This is the code 1234 to verify your account',
    });
    expect(queue.testMode.jobs[1].data).to.eql({
      phoneNumber: '4153518781',
      message: 'This is the code 12345 to verify your account',
    });
  });
});
