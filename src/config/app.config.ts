import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3100,
  url: process.env.PUBLIC_URL || 'http://localhost:3000',
  serverUrl: process.env.PUBLIC_SERVER_URL || 'http://localhost:3100',
}));
