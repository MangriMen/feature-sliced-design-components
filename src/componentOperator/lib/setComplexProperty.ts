export const setComplexProperty = (
  obj: Record<string, any>,
  path: string,
  value: unknown,
  divider: string = '.'
) => {
  let schema = obj;
  const pList = path.split(divider);
  const len = pList.length;
  for (let i = 0; i < len - 1; i++) {
    const elem = pList[i];
    if (!schema[elem]) {
      schema[elem] = {};
    }
    schema = schema[elem];
  }

  schema[pList[len - 1]] = value;
};
