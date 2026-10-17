/* GraphMath: data tantangan. Urutan 6 level mengikuti dokumen Materi GraphMath. */
window.GRAPHMATH_LEVELS = [
  {
    id: 1, title: "Mengenal Koordinat", subtitle: "Koordinat Kartesius", topic: "Bab 1 · Koordinat Kartesius", difficulty: "MUDAH", kind: "coordinate",
    description: "Baca posisi titik pada bidang Kartesius.",
    story: "Portal bercahaya muncul pada peta. Amati posisinya terhadap sumbu X dan sumbu Y, lalu masukkan koordinat portal dalam urutan <strong>(x, y)</strong>.",
    facts: [{label:"Posisi pemain",value:"(-4, -1)"},{label:"Koordinat portal",value:"Cari pada grid"}],
    start:{x:-4,y:-1}, goal:{x:4,y:4}, answerPrefix:"(x, y)", answerLabel:"Koordinat portal", answerPlaceholder:"contoh: 4,4", answerHelp:"Urutan koordinat adalah (x, y): sebutkan x terlebih dahulu, lalu y.",
    successText:"Tepat! Kamu membaca koordinat portal dengan benar. Rute eksplorasi sekarang terbuka.",
    hint:"Mulai dari titik pusat (0,0). Baca posisi mendatar untuk x, lalu posisi tegak untuk y.",
    solution:{m:5/8,b:1.5}, showEquation:false, instructions:["Amati posisi portal pada grid.","Baca nilai x terlebih dahulu.","Baca nilai y berikutnya.","Masukkan koordinat dalam format (x, y)."]
  },
  {
    id: 2, title: "Mengenal Fungsi", subtitle: "Input dan Output", topic: "Bab 2 · Fungsi", difficulty: "MUDAH", kind: "functionValue",
    description: "Memahami aturan yang menghubungkan input dan output.",
    story: "Mesin fungsi membuka jalur jika kamu menemukan keluarannya. Diketahui <strong>f(x) = x + 2</strong>. Jika inputnya <strong>x = 2</strong>, tentukan nilai f(2).",
    facts:[{label:"Fungsi",value:"f(x) = x + 2"},{label:"Input x",value:"2"}], start:{x:-4,y:-2},goal:{x:2,y:4}, answerPrefix:"f(2) =",answerLabel:"Nilai output",answerPlaceholder:"masukkan nilai y",answerHelp:"Substitusikan x = 2 ke dalam f(x) = x + 2.", expected:4,
    solution:{m:1,b:2}, showEquation:true, successText:"Benar! Output fungsi adalah 4. Grafik fungsi kini terlihat pada map.", hint:"Ganti x dengan 2: f(2) = 2 + 2.", instructions:["Baca aturan fungsi.","Masukkan nilai x ke rumus.","Hitung nilai output.","Periksa jawabanmu."]
  },
  {
    id: 3, title: "Fungsi Linear", subtitle: "Mengenal Gradien", topic: "Bab 3 · Fungsi Linear", difficulty: "SEDANG", kind: "slope",
    description: "Mengenali kemiringan garis berdasarkan dua titik.",
    story: "Jalur penghubung melewati dua titik. Tentukan <strong>gradien (m)</strong> untuk mengetahui seberapa miring jalur tersebut.",
    facts:[{label:"Titik A",value:"(-2, 1)"},{label:"Titik B",value:"(2, 5)"}], start:{x:-2,y:1},goal:{x:2,y:5}, answerPrefix:"m =",answerLabel:"Nilai gradien",answerPlaceholder:"contoh: 2",answerHelp:"Gunakan m = (y₂ − y₁) / (x₂ − x₁).", expected:1,
    solution:{m:1,b:3}, showEquation:true, successText:"Tepat! Gradiennya 1. Garis naik satu satuan secara vertikal untuk setiap satu satuan mendatar.", hint:"m = (5 − 1) / (2 − (−2)). Hitung selisih y lalu bagi dengan selisih x.", instructions:["Baca koordinat A dan B.","Hitung perubahan nilai y.","Bagi dengan perubahan nilai x.","Masukkan gradiennya."]
  },
  {
    id: 4, title: "Fungsi dari Dua Titik", subtitle: "Menyusun Persamaan", topic: "Bab 4 · Menentukan Fungsi dari Dua Titik", difficulty: "SEDANG", kind: "equation",
    description: "Mencari gradien dan konstanta untuk menyusun fungsi linear.",
    story: "Karakter berada pada titik awal dan portal berada pada titik tujuan. Tentukan persamaan fungsi linear yang melalui kedua titik tersebut dalam bentuk <strong>y = mx + b</strong>.",
    facts:[{label:"Titik awal A",value:"(2, 3)"},{label:"Portal B",value:"(6, 11)"}], start:{x:2,y:3},goal:{x:6,y:11}, answerPrefix:"y =",answerLabel:"Persamaan fungsi",answerPlaceholder:"contoh: 2*x-1",answerHelp:"Masukkan fungsi linear. Contoh: 2*x-1 atau 2x-1.",
    expectedFunction:{m:2,b:-1}, solution:{m:2,b:-1}, showEquation:true, successText:"Benar! Fungsi y = 2x − 1 melalui titik A dan B. Grafik menjadi jalur menuju portal.", hint:"Hitung m = (11 − 3) / (6 − 2), lalu substitusikan titik A(2,3) ke dalam y = mx + b.", instructions:["Hitung gradien m.","Tulis bentuk y = mx + b.","Gunakan titik A untuk mencari b.","Masukkan persamaan lengkap."]
  },
  {
    id: 5, title: "Grafik Fungsi Linear", subtitle: "Persamaan ke Titik", topic: "Bab 5 · Grafik Fungsi Linear", difficulty: "SEDANG", kind: "functionValue",
    description: "Menghubungkan fungsi yang diketahui dengan titik pada grafik.",
    story: "Jalur pada peta mengikuti fungsi <strong>y = −x + 5</strong>. Untuk koordinat dengan <strong>x = 2</strong>, tentukan nilai y agar karakter dapat menandai titik pada jalur.",
    facts:[{label:"Fungsi",value:"y = −x + 5"},{label:"Nilai x",value:"2"}], start:{x:-3,y:8},goal:{x:2,y:3}, answerPrefix:"y =",answerLabel:"Nilai y",answerPlaceholder:"masukkan nilai y",answerHelp:"Substitusikan x = 2 ke fungsi y = −x + 5.", expected:3,
    solution:{m:-1,b:5}, showEquation:true, successText:"Tepat! Saat x = 2, nilai y adalah 3. Titik (2,3) berada pada grafik fungsi.", hint:"Masukkan x = 2: y = −2 + 5.", instructions:["Baca persamaan fungsi.","Tentukan nilai x yang diberikan.","Hitung y dengan substitusi.","Cocokkan titik dengan grafik."]
  },
  {
    id: 6, title: "Tantangan Gabungan", subtitle: "Misi Jalur Menurun", topic: "Bab 6 · Hubungan Koordinat, Fungsi, dan Grafik", difficulty: "LANJUTAN", kind: "storyEquation",
    description: "Menerapkan koordinat, gradien negatif, fungsi, dan grafik dalam konteks jalur landai.",
    story: "Sebuah jalur landai menghubungkan bagian atas bukit dengan permukaan tanah. Pada peta koordinat, jalur melewati titik A <strong>(0, 5)</strong> dan B <strong>(5, 0)</strong>. Anggap x sebagai jarak mendatar dan y sebagai ketinggian. Tentukan fungsi linear jalur tersebut.",
    facts:[{label:"Atas bukit · A",value:"(0, 5)"},{label:"Tanah · B",value:"(5, 0)"}], start:{x:0,y:5},goal:{x:5,y:0}, answerPrefix:"y =",answerLabel:"Persamaan jalur",answerPlaceholder:"contoh: -x+5",answerHelp:"Hitung gradien dari dua titik. Karena jalur menurun, periksa tanda gradiennya.",
    expectedFunction:{m:-1,b:5}, solution:{m:-1,b:5}, showEquation:true, successText:"Tepat! Persamaan y = −x + 5 menunjukkan jalur menurun dari ketinggian 5 ke permukaan tanah.", hint:"m = (0 − 5) / (5 − 0) = −1. Karena titik A(0,5) berada pada sumbu-Y, nilai b = 5.", instructions:["Baca konteks dan koordinat A serta B.","Hitung perubahan y dibagi perubahan x.","Tentukan konstanta b dengan salah satu titik.","Periksa persamaan lalu ikuti jalur menuju portal."]
  }
];
