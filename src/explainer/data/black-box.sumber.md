# Sumber Fakta: Fungsi Black Box Pesawat

Catatan riset dan rujukan resmi untuk naskah explainer `black-box`:

1. **Dua Perangkat Terpisah di dalam Black Box**:
   - Black box sebenarnya bukan satu kotak tunggal, melainkan gabungan dua unit perangkat perekam elektronik tahan banting (CSMU - Crash Survivable Memory Unit):
     - **FDR (Flight Data Recorder)**: Merekam parameter teknis penerbangan (kecepatan udara, ketinggian, akselerasi vertikal/lateral, sudut kemudi sirip sayap/aileron/rudder, putaran turbin mesin, dan status autopilot) minimal 88 parameter wajib (pada pesawat modern hingga ribuan parameter) selama minimal 25 jam penerbangan.
     - **CVR (Cockpit Voice Recorder)**: Merekam 4 saluran audio di ruang kemudi (suara mikrofon pilot, kopilot, teknisi penerbangan, serta mikrofon kokpit umum yang menangkap bunyi saklar, alarm peringatan, dan deru mesin) selama minimal 2 jam terakhir.
   - **Sumber:**
     - FAA - Flight Data Recorders and Cockpit Voice Recorders Overview: https://www.faa.gov/regulations_policies/handbooks_manuals/aircraft/amt_airframe_handbook
     - ICAO Annex 6 - Operation of Aircraft (Flight Recorders): https://www.icao.int/safety/airnavigation/Pages/Flight-Recorders.aspx

2. **Underwater Locator Beacon (ULB) / Pinger Bawah Air**:
   - Setiap unit black box dilengkapi silinder pemancar akustik ultrasonik (37,5 kHz) yang aktif otomatis saat mendeteksi air laut/tawar (water switch).
   - Memancarkan sinyal ketukan sonik ("ping") setiap 1 detik selama minimal 30 hingga 90 hari, dapat dideteksi hydrophone hingga kedalaman 6.000 meter (20.000 kaki).
   - **Sumber:**
     - NTSB - How the Black Box Works & Locator Beacons: https://www.ntsb.gov/investigations/process/Pages/blackbox.aspx
     - KNKT (Komite Nasional Keselamatan Transportasi) - Panduan Investigasi Kecelakaan Udara: http://knkt.dephub.go.id/

3. **Tujuan Hakiki Black Box**:
   - Bukan untuk mencegah kecelakaan saat pesawat sedang mengudara, melainkan sebagai "saksi bisu" pasca-kejadian.
   - Setiap temuan dari data black box digunakan untuk merombak prosedur pelatihan pilot, memperbarui software autopilot, atau memperbaiki desain komponen pesawat agar insiden yang sama tidak pernah terulang lagi di dunia penerbangan.
