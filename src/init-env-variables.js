// Configuration of the app is done via environment variables

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 80;
process.env.LOOP_INTERVAL = Number(process.env.LOOP_INTERVAL) || 1000;
