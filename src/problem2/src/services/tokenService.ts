import axios from 'axios';
import { Token, TokenResponse } from '@/types';
import { removeDuplicates } from '@/utils';

const API_URL = 'https://interview.switcheo.com/prices.json';

export const getTokens = async (): Promise<Token[]> => {
  const response = await axios.get(API_URL);

  return removeDuplicates(response.data.map((token: TokenResponse) => ({
    symbol: token.currency,
    name: token.currency, 
    price: token.price
  })), 'symbol');
};