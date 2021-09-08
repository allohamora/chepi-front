import { join } from 'src/utils/url';
import { config } from '../config';
import { HttpRequest } from '../http';
import { Pizza } from './types';

const PIZZA_ENDPOINT = join(config.API_URL, '/pizza');

interface GetPizzasOptions {
  query: string;
  city: Pizza['city'];
  country: Pizza['country'];
  limit?: number;
  offset?: number;
}

interface GetPizzasResponse {
  value: Pizza[];
  total: number;
}

export const getPizzas = async (options: GetPizzasOptions) => {
  const { data } = await new HttpRequest(PIZZA_ENDPOINT)
    .post()
    .jsonBody(options)
    .returnType('json')
    .request<GetPizzasResponse>();

  return data;
};

export const getPizzasByIds = async (ids: string[]) => {
  const { data } = await new HttpRequest(join(PIZZA_ENDPOINT, '/ids'))
    .post()
    .jsonBody({ ids })
    .returnType('json')
    .request<{ value: Pizza[] }>();

  return data;
};
