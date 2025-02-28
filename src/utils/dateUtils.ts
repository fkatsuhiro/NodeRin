export const getCurrentJSTTime = (): string => {
  const now = new Date();
  //const jstOffset = 9 * 60; // JSTはUTC+9時間
  const jstTime = new Date(now.getTime() /*+ jstOffset * 60 * 1000*/);
  return jstTime.toISOString()
};