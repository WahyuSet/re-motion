// Tema visual global & font.
// Menggunakan font family string standar dengan fallback sistem agar render offline/lokal
// tidak bergantung pada unduhan jaringan gstatic yang rentan timeout.
export const theme = {
  fontTitle: 'Playfair Display, Georgia, serif',
  fontBody: 'Inter, system-ui, -apple-system, sans-serif',
  /** Tag, label anotasi, sumber: gaya "jurnalisme visual" */
  fontMono: 'IBM Plex Mono, Menlo, monospace',
  /** Tahun & nama dalam huruf kapital berjarak: gaya "sketsa vintage" */
  fontYear: 'Cinzel, Georgia, serif',
  bg: '#14110d',
  paper: '#f3ead7',
  ink: '#1d1812',
  gold: '#e3a93c',
  /** Stabilo kata kunci */
  highlight: 'rgba(242, 196, 64, 0.92)',
  /** Anotasi & stempel */
  red: '#d9412f',
  muted: 'rgba(243, 234, 215, 0.7)',
};
