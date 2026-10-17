# GraphMath — Tahap 3 Revisi

GraphMath adalah game pembelajaran matematika berbasis web untuk eksplorasi koordinat Kartesius, fungsi, fungsi linear, gradien, dan grafik fungsi. Game dibuat dengan HTML, CSS, dan JavaScript; tidak membutuhkan akun atau server untuk fitur inti.

## Fitur versi revisi

- Halaman identitas pengembang sebelum Lobby: Maulana Syihab Al Muiz, NIM 250311617964, Offering C, mata kuliah Media Pembelajaran Matematika.
- Lobby, materi, tutorial, peta enam level, permainan, checkpoint, skor, progres lokal, dan pengaturan.
- Menu Tentang Media berisi ringkasan CP terkait, tujuan pembelajaran (TP), deskripsi media, dan alur penggunaan.
- Video Materi dan Tutorial berupa video visual tanpa narasi suara. Audio narasi sintetis dihapus atas permintaan pengembang.
- Penjelasan materi tertulis untuk koordinat dan fungsi, serta satu bagian terpadu **Gradien dan Persamaan Garis**: menghitung `m = (y₂ − y₁) / (x₂ − x₁)`, lalu menyusun `y = mx + b` dengan substitusi titik.
- Enam level dengan variasi membaca koordinat, menentukan nilai fungsi, menghitung gradien, menyusun persamaan dari dua titik, membaca grafik, dan misi kontekstual jalur menurun.
- Backsound diganti menggunakan file MP3 yang disediakan pengembang, dengan kontrol hidup/mati dan volume awal yang lebih rendah (15%).
- Tes akhir 10 soal pilihan ganda setelah Level 6, skor 0–100, umpan balik dan pembahasan jawaban.
- Animasi dunia 2D, grid koordinat, karakter, platform, grafik jalur, dan portal tetap dipertahankan.

## Cara menjalankan di laptop

1. Ekstrak file ZIP.
2. Buka VS Code, pilih **File → Open Folder**, lalu buka folder `GraphMath_Tahap3`.
3. Gunakan ekstensi **Live Server** di VS Code dan klik **Go Live**; ini cara yang direkomendasikan.
4. Buka `index.html` melalui server lokal. Pastikan folder `css`, `js`, dan `media` tetap berada sejajar dengan `index.html`.

## Struktur folder

```text
GraphMath_Tahap3/
├── index.html
├── README.md
├── IMPLEMENTASI_TAHAP_3.txt
├── make_videos.py
├── make_bgm.py
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── levels.js
│   ├── revisions.js
│   └── world.js
└── media/
    ├── materi-dasar.mp4
    ├── materi-poster.jpg
    ├── tutorial-gameplay.mp4
    ├── tutorial-poster.jpg
    └── backsound-petualangan-v3.mp3
```

## Tentang audio

Kedua MP4 berisi video tanpa track audio narasi. Backsound game menggunakan file MP3 yang diberikan pengembang dan diputar terpisah hanya di Lobby/area permainan; musik dapat dimatikan dan volumenya bisa diatur. File menggunakan nama baru agar tidak tertukar dengan backsound lama di cache browser.

Skrip `make_videos.py` untuk membuat ulang MP4 visual tanpa suara membutuhkan Python, Pillow, dan FFmpeg. Untuk memainkan game, seluruh file hasil jadi sudah tersedia; pengguna tidak perlu memasang perangkat pembuat media.

## CP, TP, dan keselarasan pembelajaran

Bagian CP di dalam media ditulis sebagai ringkasan CP Matematika Fase D yang relevan dengan relasi/fungsi dan pemecahan masalah kontekstual, bukan kutipan lengkap. Rumusan TP merupakan operasionalisasi tujuan media dan harus disesuaikan lagi dengan ATP yang dipakai dosen/sekolah.

Misi Level 6 menggunakan konteks jalur landai dengan titik A(0, 5) dan B(5, 0), sehingga siswa menerapkan gradien negatif dan membentuk persamaan `y = −x + 5`.

## Tes dan batasan

Tes akhir memiliki 10 soal tetap, setiap soal bernilai 10 poin. Nilai menunjukkan hasil pada tes di browser tersebut dan tidak dikirim ke server/dosen secara otomatis. Progres game disimpan di browser/perangkat yang sama. Untuk mengumpulkan nilai dari banyak siswa diperlukan alur pengumpulan data terpisah, yang tidak termasuk versi offline ini.

## Pembaruan ke GitHub Pages

- Paket proyek utama mempertahankan susunan folder `css/`, `js/`, dan `media/` untuk penggunaan di VS Code.
- Jika repository GitHub yang sudah ada memuat file-file secara datar di halaman utama (misalnya `style.css`, `app.js`, `materi-dasar.mp4` sejajar dengan `index.html`), gunakan paket **GraphMath_Update_GitHubPages.zip**. Paket tersebut dibuat khusus untuk mengganti aset website yang sedang online tanpa merujuk ke folder `css/`, `js/`, dan `media/`.
- Sebelum mengganti file website aktif, simpan/unduh salinan repository yang lama. Setelah unggah, tunggu deployment GitHub Pages selesai lalu uji menu, video visual tanpa narasi, backsound pilihan pengembang, Level 6, dan tes akhir di laptop serta HP.

## Intro sinematik

Sesudah menekan **Masuk ke GraphMath**, pemain melihat video pembuka 8 detik dengan grafik koordinat bercahaya dan portal. Audio intro memakai 8 detik pertama dari berkas `media/backsound-petualangan-v3.mp3`; setelah intro selesai, backsound permainan berlanjut dari posisi musik yang sama. Tombol **Lewati intro** tersedia untuk pemain yang ingin langsung ke Lobby.

### Intro cinematic dinamis (8 detik)
Video pembuka `media/intro-graphmath.mp4` memiliki rangkaian adegan petualangan, peta koordinat, lompatan di jalur grafik, portal bercahaya, visual matematika, dan reveal logo GraphMath. Backsound MP3 yang dipilih pengguna disematkan langsung ke dalam MP4, tanpa narasi. Saat video berakhir atau tombol “Lewati intro” dipilih, permainan berpindah ke halaman utama/Lobby. Untuk uji lokal, buka `index.html` melalui browser; tidak perlu mengubah atau mengunggah GitHub sebelum versi final disetujui.


## Efek suara jawaban dan tes akhir

Efek suara sudah terpasang pada salinan proyek ini dan disimpan sebagai file terpisah di folder `media/`:

- `sound-answer-correct.mp3`: diputar ketika jawaban misi benar.
- `sound-answer-incorrect.mp3`: diputar ketika jawaban misi salah.
- `sound-test-aww.mp3`: diputar setelah tes akhir dengan 0–4 jawaban benar.
- `sound-test-ding.mp3`: diputar setelah tes akhir dengan 5–7 jawaban benar.
- `sound-test-applause.mp3`: diputar setelah bunyi ding selesai; file tepuk tangan tetap terpisah.
- `sound-test-yay.mp3`: diputar setelah tes akhir dengan 8–10 jawaban benar.

Efek suara tes akhir dipicu setelah hasil ditampilkan. Jika pemain memperoleh 5–7 jawaban benar, ding dan tepuk tangan dimainkan berurutan, bukan sebagai satu file gabungan. Backsound utama tetap terpisah dari efek suara.

### Catatan lisensi audio

Lisensi publikasi untuk efek suara yang diunduh dari sumber luar dan backsound utama **belum terverifikasi**. Nama file atau judul unggahan seperti “no copyright” bukan bukti izin yang cukup. Sebelum memublikasikan proyek secara publik, periksa halaman sumber dan ketentuan lisensi masing-masing audio, simpan bukti lisensi/atribusi bila diwajibkan, atau ganti audio yang izinnya tidak jelas. Integrasi teknis pada proyek ini tidak menyatakan bahwa audio tersebut telah dipastikan bebas royalti.
