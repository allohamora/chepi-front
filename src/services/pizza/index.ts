import { NotFoundException } from 'src/exceptions/not-found.exception';
import { config } from '../config';
import { HttpRequest } from '../http';
import { Pizza } from './types';

const PIZZA_ENDPOINT = `${config.API_URL}/pizzas`;

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  messages: string[];
}

interface MetaResponse<T> extends SuccessResponse<T> {
  meta: { total: number; count: number };
}

type Response<T> = SuccessResponse<T> | ErrorResponse;
type ResponseMany<T> = MetaResponse<T> | ErrorResponse;

export interface GetPizzasOptions {
  query?: string;
  city?: Pizza['city'];
  country?: Pizza['country'];
  limit?: number;
  offset?: number;
  ids?: string[];
  sort?: string;
  fields?: string;
}

export const getPizzas = async (options: GetPizzasOptions) => {
  const { data } = await new HttpRequest(PIZZA_ENDPOINT)
    .get()
    .query({ ...options }) // fix ts issue: https://stackoverflow.com/questions/37006008/typescript-index-signature-is-missing-in-type
    .returnType('json')
    .request<ResponseMany<Pizza[]>>();

  if (!data.success) {
    throw new Error(data.messages.join('\n'));
  }

  return data;
};

interface PizzaStats {
  updatedAt: number;
  count: number;
}

export const getPizzaStats = async () => {
  const { data: res } = await new HttpRequest(`${PIZZA_ENDPOINT}/stats`)
    .get()
    .returnType('json')
    .request<Response<PizzaStats>>();

  if (!res.success) {
    throw new Error(res.messages.join('\n'));
  }

  return res.data;
};

export const getPizzaById = async (id: string) => {
  const { data: res, status } = await new HttpRequest(`${PIZZA_ENDPOINT}/${id}`)
    .get()
    .returnType('json')
    .request<Response<Pizza>>();

  if (status === 404) {
    throw new NotFoundException(`Pizza not found`);
  }

  if (!res.success) {
    throw new Error(res.messages.join('\n'));
  }

  return res.data;
};

export const getPizzaIds = async () => {
  const {
    meta: { total },
  } = await getPizzas({ limit: 1, fields: 'id' });

  const { data } = await getPizzas({ limit: total, fields: 'id' });

  return data.map(({ id }) => id);
};
