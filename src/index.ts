import {App} from './app';

// Launch the app
const app = new App();
app.start().then();

// Enable graceful stop
process.once('SIGINT', () => app.stop('SIGINT'));
process.once('SIGTERM', () => app.stop('SIGTERM'));