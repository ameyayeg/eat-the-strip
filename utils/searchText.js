// Text for search matching only; never shown. Lowercases, removes accents
// (é -> e, ở -> o), maps đ to d (it has no accent mark to remove) and drops
// straight and curly apostrophes, so "cafe" finds Café, "pho" finds Phở and
// "sahara" finds Sa'hara or Sa’hara.
export function normalizeSearchText(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/['’‘`]/g, '')
}
