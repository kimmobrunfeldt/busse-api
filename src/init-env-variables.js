// Configuration of the app is done via environment variables

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 80;
process.env.LOOP_INTERVAL = Number(process.env.LOOP_INTERVAL) || 1000;

// Ensure API keys
if (!process.env.MTA_API_KEY) {
    console.log('Environment variables are not set.');
    console.log('Before starting the server, you should run source local-env.sh');
    throw new Error('MTA_API_KEY variable is not set!');
}
