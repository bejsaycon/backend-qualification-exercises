export type DowntimeLogs = [Date, Date][];

export function merge(...args: DowntimeLogs[]): DowntimeLogs {
  /**
   * insert your code here
   */
  const mergedLogs: DowntimeLogs = [];
    
  const allLogs = args.flat();

  allLogs.sort((a, b) => a[0].getTime() - b[0].getTime());
    
  let [currentStart, currentEnd] = allLogs[0];
    
  for (let i = 1; i < allLogs.length; i++) {
    const [start, end] = allLogs[i];
      if (start <= currentEnd) {
          if (end > currentEnd) currentEnd = end 
      } else {
          mergedLogs.push([currentStart, currentEnd]);
          [currentStart, currentEnd] = [start, end];
      }
  }
    
  mergedLogs.push([currentStart, currentEnd]);
    
  return mergedLogs;

}