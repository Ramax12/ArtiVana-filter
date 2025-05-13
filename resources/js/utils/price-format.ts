export default (value: string | null): string | null => {
  if (value === null) {
    return null;
  }

  const numberValue = Number(value);
  if (isNaN(numberValue)) {
    return null;
  }

  const result = new Intl.NumberFormat('ru-RU').format(numberValue);
  return result;
};
