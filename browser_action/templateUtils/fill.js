export const fill = (items, filler = null) => {
  return Array.from({length: items}).fill(filler);
};
