export const formatUrl = (url: string, searchParams: Record<string, string>): string => {
  const params = new URLSearchParams(searchParams);
  return `${url}?${params.toString()}`;
};
