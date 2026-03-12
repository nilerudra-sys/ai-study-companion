export const getAuthToken = () => {
  return localStorage.getItem('retro_auth_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('retro_auth_token', token);
  } else {
    localStorage.removeItem('retro_auth_token');
  }
};

export const getUserData = () => {
  const data = localStorage.getItem('retro_user_data');
  try {
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setUserData = (user) => {
  if (user) {
    localStorage.setItem('retro_user_data', JSON.stringify(user));
  } else {
    localStorage.removeItem('retro_user_data');
  }
};

export const logout = () => {
  setAuthToken(null);
  setUserData(null);
};
