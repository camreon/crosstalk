const API_BASE = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Users API
export const usersApi = {
  createOrLogin: (username: string, displayName?: string, blogUrl?: string) =>
    request<import('../interfaces').User>('/users', {
      method: 'POST',
      body: JSON.stringify({ 
        username, 
        display_name: displayName, 
        blog_url: blogUrl 
      }),
    }),

  getByUsername: (username: string) =>
    request<import('../interfaces').User>(`/users/${username}`),

  update: (username: string, data: { display_name?: string; blog_url?: string }) =>
    request<import('../interfaces').User>(`/users/${username}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  list: () =>
    request<import('../interfaces').User[]>('/users'),
};

// Topics API
export const topicsApi = {
  list: () =>
    request<import('../interfaces').Topic[]>('/topics'),

  getWithQuestions: (topicId: number) =>
    request<import('../interfaces').TopicWithQuestions>(`/topics/${topicId}/questions`),

  getProgress: (topicId: number, userId: number) =>
    request<import('../interfaces').TopicProgress>(`/topics/${topicId}/progress/${userId}`),
};

// Responses API
export const responsesApi = {
  save: (responses: import('../interfaces').SaveResponseInput[]) =>
    request<{ success: boolean; count: number }>('/responses', {
      method: 'POST',
      body: JSON.stringify(responses),
    }),

  getByUser: (userId: number) =>
    request<import('../interfaces').ResponseWithQuestion[]>(`/responses/user/${userId}`),

  getByUserAndTopic: (userId: number, topicId: number) =>
    request<import('../interfaces').ResponseWithQuestion[]>(`/responses/user/${userId}/topic/${topicId}`),
};

// Compare API
export const compareApi = {
  compare: (user1Id: number, user2Id: number) =>
    request<import('../interfaces').CompareResult>('/compare', {
      method: 'POST',
      body: JSON.stringify({ user1_id: user1Id, user2_id: user2Id }),
    }),
};
