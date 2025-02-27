export function getTimeDifferenceInMinutes(date1: string, date2: string): number {
    const diff = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
    return Math.floor(diff / 1000 / 60);
  }