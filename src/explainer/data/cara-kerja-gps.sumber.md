# Sumber Fakta: Bagaimana GPS Tahu Lokasi Kita? (cara-kerja-gps)

Catatan riset dan fakta ilmiah terverifikasi untuk naskah explainer `cara-kerja-gps`:

1. **Penerima Pasif (One-way Communication) & Bebas Internet:**
   - Smartphone dan receiver GPS komersial bersifat 100% penerima pasif (*downlink only* pada frekuensi radio L1/L5).
   - Ponsel tidak pernah memancarkan sinyal radio balik ke orbit satelit karena daya pancar HP (orde miliwatt) mustahil menembus 20.200 km ke antariksa.
   - Sinyal seluler / kuota internet hanya digunakan untuk mengunduh gambar peta grafis (Google Maps / Apple Maps) dan Assisted GPS (A-GPS) untuk mengunduh almanak orbit lebih cepat. Chip GPS tetap berfungsi normal saat ponsel offline / mode pesawat.
   - Sumber:
     - NASA Space Place: https://spaceplace.nasa.gov/gps/en/
     - US Official GPS Information: https://www.gps.gov/systems/gps/

2. **Konstelasi Satelit & Jam Atom:**
   - Konstelasi GPS memiliki lebih dari 30 satelit operasional aktif di Medium Earth Orbit (MEO) pada ketinggian sekitar 20.200 km dengan periode orbit 12 jam.
   - Setiap satelit membawa beberapa jam atom (Rubidium dan Cesium) dengan tingkat akurasi hingga nanodetik (1 per 1 miliar detik).
   - Satelit terus-menerus memancarkan data efemeris (posisi orbit satelit) dan timestamp waktu transmisi sinyal.
   - Sumber:
     - US Government GPS Constellation: https://www.gps.gov/systems/gps/space/
     - FAA GNSS / GPS How It Works: https://www.faa.gov/about/office_org/headquarters_offices/ato/service_units/techops/navservices/gnss/gps/howitworks

3. **Prinsip Trilaterasi & Empat Satelit:**
   - Receiver menghitung jarak semu (*pseudorange*) ke satelit menggunakan rumus $d = c \times \Delta t$, di mana $c$ adalah kecepatan cahaya (~300.000 km/s) dan $\Delta t$ adalah selisih waktu tiba sinyal dikurangi waktu pemancaran.
   - Mengunci 3 satelit menentukan irisan 3 bola jarak di permukaan bumi.
   - Satelit ke-4 mutlak diperlukan untuk menyelesaikan 4 persamaan matematika: 3 dimensi koordinat ruang ($x, y, z$: lintang, bujur, ketinggian) ditambah 1 variabel koreksi selisih waktu jam kristal kuarsa ponsel terhadap jam atom satelit ($\Delta t_{\text{clock}}$).
   - Sumber:
     - U.S. National Geodetic Survey (NOAA): https://geodesy.noaa.gov/
