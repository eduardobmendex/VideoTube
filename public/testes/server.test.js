 
import fetch from 'node-fetch';
import { getYoutubeResults, fetchAllYoutubeResults } from '../../server/server.mjs';

jest.mock('node-fetch'); 
describe('getYoutubeResults', () => {
  beforeEach(() => {
    fetch.mockClear();  
  });

  it('fetches YouTube data correctly', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ items: [{ id: { videoId: 'mockVideoId' }, snippet: { title: 'Mock Video', description: 'Mock Description', thumbnails: { default: { url: 'https://mock.thumbnail.url' } } } }] }),
    };
    fetch.mockResolvedValue(mockResponse);

    const data = await getYoutubeResults('test', 10, 'token');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('key=YOUR_API_KEY'));
    expect(data.items.length).toBe(1);
    expect(data.items[0].id.videoId).toBe('mockVideoId');
  });

  it('handles YouTube API error', async () => {
    const mockErrorResponse = {
      ok: false,
      json: () => Promise.resolve({ error: { message: 'API error' } }),
    };
    fetch.mockResolvedValue(mockErrorResponse);

    await expect(getYoutubeResults('error', 10, 'token')).rejects.toThrow('YouTube API error: API error');
  });
});

describe('fetchAllYoutubeResults', () => {
  it('fetches all YouTube results correctly', async () => {
     jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [{ id: { videoId: 'mockVideoId' }, snippet: { title: 'Mock Video', description: 'Mock Description', thumbnails: { default: { url: 'https://mock.thumbnail.url' } } } }] }),
    });

    const results = await fetchAllYoutubeResults('test', 3);
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Mock Video');
    expect(results[0].videoUrl).toBe('https://www.youtube.com/embed/mockVideoId');
  });

  it('handles no items in YouTube data', async () => {
     jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    });

    const results = await fetchAllYoutubeResults('test', 3);
    expect(results.length).toBe(0);
  });

  it('handles YouTube API error in fetchAll', async () => {
     jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: { message: 'API error' } }),
    });

    await expect(fetchAllYoutubeResults('error', 3)).rejects.toThrow('YouTube API error: API error');
  });
});
