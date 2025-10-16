import { wordlist } from '@scure/bip39/wordlists/english.js';

export const generateUnsafeBip39Name = (words: number = 3, separator: string = '-'): string => {
  return [...crypto.getRandomValues(new Uint32Array(words))]
    .map((value) => wordlist[value % wordlist.length])
    .join(separator);
};

export const isUnsafeBip39Name = (
  name: string,
  words: number = 3,
  separator: string = '-',
): boolean => {
  const parts = name.split(separator);
  if (parts.length !== words) return false;
  return parts.every((part) => wordlist.includes(part));
};
