const cron = require('node-cron');
const axios = require('axios');

const initScheduler = (port = 3001) => {
  // Run every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('[Scheduler] Initiating periodic alert check...');
    try {
      // Trigger the internal check route
      await axios.post(`http://localhost:${port}/api/alerts/check`);
      console.log('[Scheduler] Alert check completed successfully.');
    } catch (e) {
      console.error('[Scheduler] Alert check trigger failed:', e.message);
    }
  });
  
  console.log('[Scheduler] Background alerting tasks initialized (Interval: 6h)');
};

module.exports = initScheduler;
