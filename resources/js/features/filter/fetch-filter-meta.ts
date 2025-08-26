import axios from 'axios';
import updateUrlParams from '@js/utils/update-url-params';

export const fetchFilterMeta = (params?: Record<string, any>) => {
  // @ts-ignore
  const apiUrl = import.meta.env.API_URL || '';

  return axios
    .get(`${apiUrl}/filter-meta?${params ? updateUrlParams(params) : ''}`)
    .then(response => response.data)
    .catch(error => {
      console.error(error);
    });
};
