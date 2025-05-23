import axios from 'axios';
import { IParamsProducts } from '@js/typescript/interfaces';
import updateUrlParams from '@js/utils/update-url-params';

export const fetchFilterMeta = (params?: IParamsProducts) => {
  // @ts-ignore
  const apiUrl = import.meta.env.API_URL || '';

  return axios
    .get(`${apiUrl}/filter-meta?${updateUrlParams(params)}`)
    .then(response => response.data)
    .catch(error => {
      console.error(error);
    });
};
