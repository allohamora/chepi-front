const isProd = process.env.NODE_ENV === 'production';

export const basePath = isProd ? 'https://chepi-front-allohamora.cloud.okteto.net/' : 'http://localhost:3000';
