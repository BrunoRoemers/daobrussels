const units = ['b', 'kb', 'mb', 'gb'];

export const toBytes = (input: string): number => {
  const match = input.match(/^(\d+([.,]\d+)?)(.*)$/i);
  if (!match || match.length !== 4) {
    throw new Error(`Invalid input: ${input}`);
  }

  const num = parseFloat(match[1].replace(',', '.'));
  if (isNaN(num)) {
    throw new Error(`Invalid number from '${input}'`);
  }

  const unit = match[3].trim().toLowerCase() || 'b';
  const exp = units.indexOf(unit);
  if (exp < 0) {
    throw new Error(`Invalid unit '${unit}' from '${input}'`);
  }

  const bytes = num * 1000 ** exp;
  if (!Number.isInteger(bytes)) {
    throw new Error(`Invalid output '${bytes}' from '${input}'`);
  }

  return bytes;
};
