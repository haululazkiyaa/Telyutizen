export function TimeDifference(date: Date): number {
  let date1: any = new Date();
  let date2: any = new Date(date);
  console.log(date1);
  console.log(date2);
  let difference = Math.floor(
    (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)
  );
  return difference;
}
