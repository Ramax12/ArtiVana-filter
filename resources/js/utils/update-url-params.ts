export default (params: Record<string, string | Array<string>>): string => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const sort = urlSearchParams.get('sort') ?? '';
  let url = new URLSearchParams();

  if ('sort' in params) {
    url = urlSearchParams;
    if (!Array.isArray(params.sort) && params.sort) {
      url.set('sort', params.sort);
    } else {
      url.delete('sort');
    }
  } else {
    if (sort) {
      url.set('sort', sort);
    }

    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach(v => url.append(key, v));
      } else if (typeof value === 'string' && value) {
        url.set(key, value);
      }
    }
  }

  url.delete('page');

  return url.toString();
};
