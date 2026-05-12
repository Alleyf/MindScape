import resourcesRaw from '../../content/config/resources.yaml?raw';
import learningRoutesRaw from '../../content/config/learning-routes.yaml?raw';
import yaml from 'js-yaml';

const resourcesData = yaml.load(resourcesRaw) as Record<string, any>;
const learningRoutesData = yaml.load(learningRoutesRaw) as Record<string, any>;

export const RESOURCE_CATEGORIES = resourcesData.categories || [];
export const LEARNING_ROUTES = learningRoutesData.routes || [];

export const MICROLINK_API_URL = import.meta.env.VITE_MICROLINK_API_URL || 'https://api.microlink.io/?url=';
export const FAVICON_YANDEX_URL = import.meta.env.VITE_FAVICON_YANDEX_URL || 'https://favicon.yandex.net/favicon/';
