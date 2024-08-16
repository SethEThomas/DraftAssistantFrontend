import { Player } from "../interfaces/Player";

export function calculateMedian(arr: Player[]): number | undefined {
    if (arr.length === 0) {
      return undefined;
    }
  
    const length = arr.length;
    const middleIndex = Math.floor(length / 2);
  
    if (length % 2 === 0) {
      return (arr[middleIndex - 1].stats.totalProjectedPoints + arr[middleIndex].stats.totalProjectedPoints) / 2;
    } else {
      return arr[middleIndex].stats.totalProjectedPoints;
    }
  }