/**
 * 現在の日時をJST（日本標準時）で取得し、ISO 8601形式の文字列として返す関数
 */
export const getCurrentJSTTime = (): string => {
  const now = new Date();
  const jstOffset = 9 * 60; // JSTはUTC+9時間
  const jstTime = new Date(now.getTime() + jstOffset * 60 * 1000);
  return jstTime.toISOString().replace('Z', '+09:00');
};