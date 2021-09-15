import { basePath } from 'src/config/url';
import { join } from './url';

const IMAGES_DIR = '/images';

export const absolute = (path: string) => join(basePath, path);
export const image = (imageName: string) => join(IMAGES_DIR, imageName);
export const absoluteImage = (imageName: string) => absolute(image(imageName));
