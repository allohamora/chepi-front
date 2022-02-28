import { join } from 'src/utils/url';
import { config } from '../config';
import { HttpRequest } from '../http';
import { Pizza } from './types';

const PIZZA_ENDPOINT = join(config.API_URL, '/pizza');

export interface GetPizzasOptions {
  query: string;
  city: Pizza['city'];
  country: Pizza['country'];
  limit?: number;
  offset?: number;
  orderBy?: {
    target: 'weight' | 'size' | 'price';
    cause: 'asc' | 'desc';
  } | null;
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

interface GetPizzasByIdsResult {
  value: Pizza[];
}

export const getPizzasByIds = async (ids: string[]) => {
  if (ids.length === 0) return { value: [] };

  const { data } = await new HttpRequest(join(PIZZA_ENDPOINT, '/ids'))
    .post()
    .jsonBody({ ids })
    .returnType('json')
    .request<GetPizzasByIdsResult>();

  return data;
};

interface PizzasStats {
  updatedAt: number;
  count: number;
}

export const getPizzasStats = async () => {
  const { data } = await new HttpRequest(join(PIZZA_ENDPOINT, '/stats'))
    .get()
    .returnType('json')
    .request<PizzasStats>();

  return data;
};
