type Credits = Record<string, {credit: string}>;

// Ambil path foto + teks kredit dari credits.json hasil scripts/cari-foto.mjs,
// supaya kredit tidak perlu disalin manual dan tidak mungkin lupa.
export const fotoDari = (slug: string, credits: Credits) => (file: string) => {
  const entry = credits[file];
  if (!entry) {
    throw new Error(`Foto "${file}" tidak ada di public/photos/${slug}/credits.json`);
  }
  return {photo: `photos/${slug}/${file}`, credit: entry.credit};
};

// Ambil path footage video + teks kredit dari credits.json hasil scripts/cari-video.mjs.
export const videoDari = (slug: string, credits: Credits) => (file: string) => {
  const entry = credits[file];
  if (!entry) {
    throw new Error(`Video "${file}" tidak ada di public/videos/${slug}/credits.json`);
  }
  return {video: `videos/${slug}/${file}`, credit: entry.credit};
};
