export const removeDuplicates = <T, O extends keyof T >(array: T[], key: O) => {
  return array.reduce((accumulator, current: T) => {
    if (!accumulator.find((item) => item[key] === current[key])) {
      accumulator.push(current);
    }
    return accumulator;
  }, [] as T[]);
};
