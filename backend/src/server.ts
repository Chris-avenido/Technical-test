import app from './app';
import { ENV } from './config/env';

const server = app.listen(ENV.PORT, () => {
  console.log(`=============================================`);
  console.log(` Food Finder Backend API running on port ${ENV.PORT}`);
  console.log(` Environment: ${ENV.NODE_ENV}`);
  console.log(` Client URL: ${ENV.CLIENT_URL}`);
  console.log(`=============================================`);
});

export default server;
