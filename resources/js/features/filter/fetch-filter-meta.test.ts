import { describe, it, expect, vi, beforeEach, Mock, Mocked } from 'vitest';
import axios from 'axios';
import { fetchFilterMeta } from '@js/features/filter/fetch-filter-meta';
import updateUrlParams from '@js/utils/update-url-params';

vi.mock('axios');
vi.mock('@js/utils/update-url-params');

describe('fetch-filter-meta feature', () => {
  const mockedAxios = axios as Mocked<typeof axios>;
  const mockedUpdateUrlParams = updateUrlParams as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    import.meta.env.API_URL = 'http://localhost:3000';
  });

  it('should call axios.get with params when provided', async () => {
    mockedUpdateUrlParams.mockReturnValue('foo=bar');
    mockedAxios.get.mockResolvedValue({ data: { success: true } });

    const result = await fetchFilterMeta({ foo: 'bar' });

    expect(mockedUpdateUrlParams).toHaveBeenCalledWith({ foo: 'bar' });
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/filter-meta?foo=bar');
    expect(result).toEqual({ success: true });
  });

  it('should call axios.get without params when none provided', async () => {
    mockedAxios.get.mockResolvedValue({ data: { empty: true } });

    const result = await fetchFilterMeta();

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/filter-meta?');
    expect(result).toEqual({ empty: true });
  });

  it('should log error and return undefined when axios throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    const result = await fetchFilterMeta({ test: 1 });

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });
});
