# Sumber Fakta: Penyadapan LIMS di Indonesia

## Ringkasan Fakta
1. **Definisi LIMS:**
   LIMS (Lawful Interception Management System) adalah sistem perangkat lunak dan infrastruktur manajemen intersepsi yang dipasang di operator telekomunikasi seluler untuk memenuhi kewajiban hukum (lawful interception). Sistem ini digunakan oleh lembaga penegak hukum yang berwenang (seperti KPK, Polri, Kejaksaan, BIN) sesuai amanat perundang-undangan.
   - Sumber: Kompas Tekno / CNN Indonesia (Analisis Pakar Keamanan Siber Alfons Tanujaya & Pratama Persadha).
   - https://www.cnnindonesia.com/teknologi/20240905141523-185-1141253/mengenal-lims-alat-sadap-yang-ramai-disorot-di-kasus-penyadapan
   - https://www.cnbcindonesia.com/tech/20240906112045-37-569612/apa-itu-lims-alat-sadap-yang-bikin-heboh-begini-cara-kerjanya

2. **Mekanisme Kerja:**
   - Penyadapan dilakukan di level inti jaringan (core network) dan menara BTS operator seluler, bukan dengan menanam malware ke perangkat pengguna.
   - Ponsel target tidak menunjukkan gejala khas peretasan (tidak boros baterai, tidak panas, tidak ada aplikasi asing).
   - Data yang dapat disadap mencakup panggilan seluler konvensional (circuit-switched), SMS reguler, dan estimasi lokasi berdasarkan Cell ID / BTS.

3. **Batasan Teknis Enkripsi:**
   - LIMS tidak dapat mendekripsi lalu lintas data yang dilindungi enkripsi ujung ke ujung (end-to-end encryption / E2EE) seperti panggilan dan pesan di WhatsApp atau Signal, karena kunci kriptografi hanya disimpan di perangkat pengirim dan penerima.

4. **Isu Penyalahgunaan di Indonesia:**
   - Isu yang viral berkaitan dengan dugaan penyalahgunaan otorisasi oleh oknum, di mana nomor target dimasukkan ke sistem pemantauan tanpa izin pengadilan atau surat tugas penyidikan resmi.
   - Masalah utama terletak pada tata kelola otorisasi dan celah pengawasan internal (internal misuse), bukan pada kegagalan teknis alatnya sendiri.
