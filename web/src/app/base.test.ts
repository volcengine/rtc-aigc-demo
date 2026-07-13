import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { requestPostMethod } from './base';

describe('AIGC API client', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('posts the selected scene to the allowlisted VoiceChat proxy action', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({ json: async () => ({}) } as Response);
    const start = requestPostMethod({
      action: 'StartVoiceChat',
      apiPath: '/proxy',
    });

    await start({ SceneID: 'default' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:3001/proxy?Action=StartVoiceChat',
      expect.objectContaining({
        method: 'post',
        body: JSON.stringify({ SceneID: 'default' }),
      })
    );
  });
});
