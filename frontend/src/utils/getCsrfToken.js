
export const getCsrfTokenFromCookie = () => {
  const cookieString = document.cookie;
  const match = cookieString.match(/XSRF-TOKEN=([^;]+)/);
  return match ? match[1] : null;
};
