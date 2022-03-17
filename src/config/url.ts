import { IS_PRODUCTION } from './env';

export const basePath = IS_PRODUCTION ? 'https://chepi-front-allohamora.cloud.okteto.net/' : 'http://localhost:3000';
