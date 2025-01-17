export const tokenService = {
    getAccessToken: () => localStorage.getItem('accessToken'),
    setAccessToken: token => localStorage.setItem('accessToken', token),
    getRefreshToken: () => localStorage.getItem('refreshToken'),
    setRefreshToken: token => localStorage.setItem('refreshToken', token),
    clearTokens: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  };