from PIL import Image, ImageDraw, ImageFont
import os, math, subprocess, json
ROOT=os.path.dirname(__file__)
MEDIA=os.path.join(ROOT,'media')
os.makedirs(MEDIA,exist_ok=True)
FONT_R='/usr/share/fonts/opentype/inter/InterDisplay-Regular.otf'
FONT_B='/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf'
if not os.path.exists(FONT_R): FONT_R='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
if not os.path.exists(FONT_B): FONT_B='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
W,H=1280,720

def font(size,bold=False): return ImageFont.truetype(FONT_B if bold else FONT_R,size)
def wrap(text,f,maxw,draw):
    words=text.split(); lines=[]; current=''
    for word in words:
        trial=(current+' '+word).strip()
        if draw.textbbox((0,0),trial,font=f)[2] <= maxw or not current: current=trial
        else: lines.append(current); current=word
    if current: lines.append(current)
    return lines

def rr(draw,box,r,fill,outline=None,width=1): draw.rounded_rectangle(box,radius=r,fill=fill,outline=outline,width=width)
def draw_grid(draw,box,spacing=36,alpha='#d9e5e7'):
    x0,y0,x1,y1=box
    for x in range(x0,x1+1,spacing): draw.line((x,y0,x,y1),fill=alpha,width=1)
    for y in range(y0,y1+1,spacing): draw.line((x0,y,x1,y),fill=alpha,width=1)
def base(title,subtitle,idx,total):
    im=Image.new('RGB',(W,H),'#d7f1f8'); d=ImageDraw.Draw(im)
    # sky and distant hills
    for y in range(H):
        t=y/H
        c=(int(91*(1-t)+224*t),int(190*(1-t)+245*t),int(237*(1-t)+234*t))
        d.line((0,y,W,y),fill=c)
    # soft clouds
    for cx,cy,s in [(170,150,1),(1010,112,.7),(1120,320,.5),(350,325,.45)]:
        d.ellipse((cx-54*s,cy-10*s,cx+57*s,cy+24*s),fill='#f5fdff')
        d.ellipse((cx-28*s,cy-34*s,cx+17*s,cy+25*s),fill='#f5fdff')
        d.ellipse((cx+4*s,cy-39*s,cx+46*s,cy+25*s),fill='#f5fdff')
    d.polygon([(0,510),(140,400),(280,495),(420,380),(570,505),(710,405),(890,510),(1050,390),(1280,485),(1280,720),(0,720)],fill='#77c59d')
    d.polygon([(0,590),(180,510),(360,575),(540,490),(750,580),(960,485),(1130,560),(1280,505),(1280,720),(0,720)],fill='#3e9a72')
    # header bar
    rr(d,(34,28,1246,122),22,'#073b2c')
    d.text((62,43),title,font=font(35,True),fill='#ffffff')
    d.text((64,88),subtitle,font=font(19),fill='#cde9dc')
    # progress and slide idx
    d.text((1185,48),f'{idx:02d}/{total:02d}',font=font(18,True),fill='#ffd166',anchor='ra')
    # small bottom footer
    rr(d,(34,665,1246,698),12,'#073b2c')
    d.text((54,673),'GRAPHMATH  •  BELAJAR · JELAJAH · PECAHKAN',font=font(13,True),fill='#d2ecdf')
    return im,d

def chart(draw,box,func=None,points=None,highlight=None):
    x0,y0,x1,y1=box
    rr(draw,box,14,'#ffffffeb','#9db8bf',2); draw_grid(draw,box,30,'#dce6e8')
    # map range x[-2,7],y[-2,12]
    def sx(x): return x0+20+(x+2)/9*(x1-x0-40)
    def sy(y): return y1-20-(y+2)/14*(y1-y0-40)
    ox,oy=sx(0),sy(0)
    draw.line((x0+16,oy,x1-13,oy),fill='#334c54',width=3)
    draw.line((ox,y1-13,ox,y0+14),fill='#334c54',width=3)
    draw.polygon([(x1-13,oy),(x1-23,oy-6),(x1-23,oy+6)],fill='#334c54')
    draw.polygon([(ox,y0+14),(ox-6,y0+24),(ox+6,y0+24)],fill='#334c54')
    draw.text((x1-25,oy+8),'x',font=font(15,True),fill='#334c54');draw.text((ox+8,y0+10),'y',font=font(15,True),fill='#334c54')
    if func:
        m,b=func; path=[]
        for i in range(181):
            x=-2+i/20
            y=m*x+b
            if -2<=y<=12: path.append((sx(x),sy(y)))
        if len(path)>1: draw.line(path,fill='#1761ad',width=5,joint='curve')
    if points:
        for x,y,label in points:
            r=8;draw.ellipse((sx(x)-r,sy(y)-r,sx(x)+r,sy(y)+r),fill='#ffd166',outline='#125b88',width=3)
            draw.text((sx(x)+11,sy(y)-26),f'{label} ({x},{y})',font=font(15,True),fill='#154d77')
    return sx,sy

def slide_card(im,d,heading,body_lines,formula=None,chart_data=None,side_note=None):
    rr(d,(55,151,595,625),22,'#ffffffef','#d0e1e3',2)
    d.text((88,180),heading,font=font(29,True),fill='#0c5138')
    y=232
    for line in body_lines:
        d.ellipse((89,y+8,101,y+20),fill='#168553')
        f=font(21); lines=wrap(line,f,430,d)
        for ln in lines:
            d.text((118,y),ln,font=f,fill='#24443a');y+=30
        y+=13
    if formula:
        rr(d,(87,508,562,582),17,'#fff1c4','#e6c25f',2)
        d.text((324,526),formula,font=font(31,True),fill='#173d30',anchor='ma')
    if chart_data:
        chart(d,(630,158,1217,620),**chart_data)
    if side_note:
        rr(d,(665,545,1184,598),13,'#e9f8ee','#b4dfc0',1)
        d.text((686,561),side_note,font=font(16,True),fill='#156342')

def make_material_slides():
    slides=[]; total=6
    # 1 opening
    im,d=base('MATERI DASAR GRAPHMATH','Koordinat Kartesius · Fungsi · Gradien dan Persamaan Garis · Grafik',1,total)
    rr(d,(90,174,1190,610),26,'#ffffffeb','#c0dfe2',2)
    d.text((140,217),'Dari koordinat menuju portal',font=font(40,True),fill='#073b2c')
    d.text((142,282),'GraphMath menghubungkan tiga ide utama:',font=font(24),fill='#28483a')
    for i,(a,b) in enumerate([('KOORDINAT','menentukan posisi'),('FUNGSI','menyatakan hubungan x dan y'),('GRAFIK','memvisualisasikan fungsi')]):
        x=140+i*354
        rr(d,(x,358,x+300,505),20,['#e4f3ea','#e8f4ff','#fff2cb'][i],['#aad6b7','#bad7f2','#e9d28b'][i],2)
        d.text((x+24,382),a,font=font(22,True),fill='#0b5739')
        d.text((x+24,426),b,font=font(19),fill='#344e43')
    d.text((143,546),'Tujuan: memahami konsep, melihat grafik, dan memecahkan tantangan.',font=font(20,True),fill='#1761ad')
    slides.append(im)
    # 2 coordinates
    im,d=base('1. KOORDINAT KARTESIUS','Posisi titik ditulis sebagai pasangan terurut (x, y).',2,total)
    slide_card(im,d,'Cara membaca koordinat',['x dibaca lebih dahulu: bergerak ke kiri atau kanan.','y dibaca berikutnya: bergerak ke bawah atau atas.','Titik pusat berada pada O(0, 0).'],'(x, y)',{'points':[(3,2,'A')]})
    slides.append(im)
    # 3 function
    im,d=base('2. KONSEP FUNGSI','Input diproses oleh aturan fungsi untuk menghasilkan output.',3,total)
    rr(d,(83,195,566,570),22,'#ffffffee','#cfdfdd',2)
    d.text((116,225),'Contoh fungsi',font=font(27,True),fill='#0b5739')
    rr(d,(118,285,525,354),14,'#e6f2ff','#aed1f0',2);d.text((321,300),'f(x) = 2x + 1',font=font(30,True),fill='#174d91',anchor='ma')
    d.text((130,390),'Input: x = 3',font=font(24),fill='#25463a')
    d.text((130,433),'f(3) = 2(3) + 1',font=font(25,True),fill='#25463a')
    rr(d,(118,488,525,547),13,'#fff0bf','#e3c15c',2);d.text((321,500),'Output = 7',font=font(29,True),fill='#173f2d',anchor='ma')
    chart(d,(630,158,1217,620),func=(2,1),points=[(3,7,'A')])
    slides.append(im)
    # 4 one unified lesson: slope from two points + line equation
    im,d=base('3. GRADIEN DAN PERSAMAAN GARIS','Dua rumus yang digunakan berurutan untuk menentukan persamaan garis.',4,total)
    rr(d,(55,151,595,625),22,'#ffffffef','#d0e1e3',2)
    d.text((88,180),'Satu konsep, dua bentuk',font=font(27,True),fill='#0c5138')
    d.text((90,232),'Langkah 1 · hitung gradien dari dua titik',font=font(17,True),fill='#24443a')
    rr(d,(88,264,562,329),14,'#fff1c4','#e6c25f',2)
    d.text((325,282),'m = (y₂ − y₁) / (x₂ − x₁)',font=font(23,True),fill='#173d30',anchor='ma')
    d.text((90,354),'Langkah 2 · gunakan gradien pada persamaan',font=font(17,True),fill='#24443a')
    rr(d,(88,386,562,449),14,'#e4f3ea','#abd5b9',2)
    d.text((325,401),'y = mx + b',font=font(30,True),fill='#173d30',anchor='ma')
    d.text((90,474),'m = gradien · b = potong sumbu-Y',font=font(17,True),fill='#24443a')
    d.text((90,514),'Selesaikan berurutan: cari m, lalu b.',font=font(18,True),fill='#1761ad')
    chart(d,(630,158,1217,620),func=(2,-1),points=[(2,3,'A'),(6,11,'B')])
    slides.append(im)
    # 5 worked example as the continuation of the same unified lesson
    im,d=base('CONTOH TERPADU · DUA TITIK KE PERSAMAAN','Lanjutkan langkah gradien hingga memperoleh y = mx + b.',5,total)
    rr(d,(55,151,595,625),22,'#ffffffef','#d0e1e3',2)
    d.text((88,178),'Diketahui A(2, 3) dan B(6, 11)',font=font(23,True),fill='#0c5138')
    rr(d,(88,224,562,280),14,'#fff1c4','#e6c25f',2)
    d.text((325,240),'m = (11 − 3) / (6 − 2) = 2',font=font(21,True),fill='#173d30',anchor='ma')
    d.text((91,307),'Gunakan titik A pada y = mx + b:',font=font(17,True),fill='#24443a')
    d.text((91,344),'3 = 2(2) + b  →  b = −1',font=font(20,True),fill='#24443a')
    rr(d,(88,401,562,472),16,'#e4f3ea','#abd5b9',2);d.text((325,418),'y = 2x − 1',font=font(33,True),fill='#173d30',anchor='ma')
    d.text((90,500),'Periksa: kedua titik berada pada garis ini.',font=font(17,True),fill='#1761ad')
    chart(d,(630,158,1217,620),func=(2,-1),points=[(2,3,'A'),(6,11,'B')])
    slides.append(im)
    # 6 graph and game link
    im,d=base('4. GRAFIK MENJADI JALUR','Persamaan yang benar divisualisasikan pada bidang koordinat.',6,total)
    rr(d,(55,151,595,625),22,'#ffffffef','#d0e1e3',2)
    d.text((88,184),'Dari jawaban ke petualangan',font=font(27,True),fill='#0c5138')
    for i,line in enumerate(['Tulis fungsi secara manual.','Periksa apakah persamaan sudah benar.','Grafik muncul pada map permainan.','Ikuti jalur hingga mencapai portal.']):
        y=247+i*62;d.ellipse((91,y,119,y+28),fill='#168553');d.text((105,y+3),str(i+1),font=font(17,True),fill='#ffffff',anchor='ma');d.text((137,y+1),line,font=font(18),fill='#24443a')
    rr(d,(86,512,566,575),15,'#dff7e7','#9fd3b0',2);d.text((326,529),'KOORDINAT → FUNGSI → GRAFIK',font=font(19,True),fill='#12633c',anchor='ma')
    chart(d,(630,158,1217,620),func=(2,-1),points=[(2,3,'Pemain'),(6,11,'Portal')])
    slides.append(im)
    return slides

def make_tutorial_slides():
    slides=[];total=6
    im,d=base('TUTORIAL GAMEPLAY GRAPHMATH','Ikuti langkah misi hingga mencapai checkpoint.',1,total)
    rr(d,(78,165,1200,615),25,'#ffffffed','#c2dfd8',2)
    d.text((120,205),'Cara bermain',font=font(39,True),fill='#073b2c')
    d.text((122,267),'Amati koordinat. Temukan solusi. Buka portal.',font=font(25),fill='#1761ad')
    for i,(a,b) in enumerate([('Amati','Baca misi dan posisi.'),('Hitung','Gunakan matematika.'),('Periksa','Masukkan jawaban.'),('Jelajah','Ikuti jalur grafik.')]):
        x=118+i*270
        rr(d,(x,352,x+235,505),18,['#e3f2e9','#e6f3ff','#fff2cb','#e5f8fa'][i],['#abd5b9','#b9d9f4','#edd48d','#ade0e5'][i],2)
        d.text((x+20,374),f'{i+1}. {a}',font=font(24,True),fill='#0b5639')
        for j,line in enumerate(wrap(b,font(18),192,d)):d.text((x+20,424+j*27),line,font=font(18),fill='#354c41')
    slides.append(im)
    im,d=base('LANGKAH 1 · AMATI KOORDINAT','Perhatikan titik awal dan titik tujuan pada map.',2,total)
    slide_card(im,d,'Baca peta',['Pemain berada pada koordinat awal.','Portal tujuan memiliki koordinat berbeda.','Untuk membaca titik, sebutkan x lalu y.'],'(x, y)',{'points':[(-2,1,'P'),(4,6,'Portal')]})
    slides.append(im)
    im,d=base('LANGKAH 2 · ANALISIS MISI','Jenis pertanyaan berbeda pada setiap level.',3,total)
    slide_card(im,d,'Pilih strategi',['Koordinat: tentukan posisi titik.','Nilai fungsi: substitusikan nilai x.','Gradien: hitung perubahan y dibagi perubahan x.'],'m = Δy / Δx',{'func':(1,2),'points':[(-1,1,'A'),(3,5,'B')]})
    slides.append(im)
    im,d=base('LANGKAH 3 · MASUKKAN JAWABAN','Ketik jawaban secara manual, bukan menebak pilihan ganda.',4,total)
    rr(d,(65,174,590,610),24,'#ffffffed','#d0e1e3',2)
    d.text((100,205),'Contoh kolom jawaban',font=font(26,True),fill='#0b5639')
    d.text((105,270),'Titik awal: A(2, 3)',font=font(21),fill='#2b483b')
    d.text((105,311),'Titik tujuan: B(6, 11)',font=font(21),fill='#2b483b')
    rr(d,(104,376,546,449),13,'#f4f7f5','#9eafa6',2);d.text((128,393),'y = 2x − 1',font=font(28,True),fill='#1761ad')
    rr(d,(104,475,288,536),12,'#073b2c');d.text((196,492),'PERIKSA',font=font(21,True),fill='#ffffff',anchor='ma')
    d.text((105,558),'Periksa langkah sebelum mengirim jawaban.',font=font(16),fill='#68776d')
    chart(d,(630,158,1217,620),func=(2,-1),points=[(2,3,'A'),(6,11,'B')])
    slides.append(im)
    im,d=base('LANGKAH 4 · PELAJARI FEEDBACK','Jawaban salah memberi kesempatan untuk memperbaiki strategi.',5,total)
    rr(d,(70,180,605,365),22,'#fcebec','#efbec3',2);d.ellipse((100,209,150,259),fill='#cf3d49');d.text((125,211),'×',font=font(36,True),fill='#ffffff',anchor='ma');d.text((172,215),'Belum tepat',font=font(27,True),fill='#a12b36');d.text((105,278),'Periksa lagi gradien dan konstanta.',font=font(19),fill='#7b3d43')
    rr(d,(70,396,605,584),22,'#e7f7ec','#b9e0c5',2);d.ellipse((100,425,150,475),fill='#198450');d.text((125,426),'✓',font=font(32,True),fill='#ffffff',anchor='ma');d.text((172,433),'Jawaban benar!',font=font(27,True),fill='#12633c');d.text((105,495),'Grafik muncul dan jalur terbuka.',font=font(19),fill='#305746')
    chart(d,(650,158,1217,620),func=(2,-1),points=[(2,3,'A'),(6,11,'B')])
    slides.append(im)
    im,d=base('LANGKAH 5 · IKUTI GRAFIK KE PORTAL','Selesaikan misi untuk membuka checkpoint dan level berikutnya.',6,total)
    rr(d,(62,163,592,614),22,'#ffffffed','#d0e1e3',2)
    d.text((95,201),'Siklus satu level',font=font(28,True),fill='#0b5639')
    for i,line in enumerate(['Pemain memasukkan fungsi.','Sistem memberi feedback.','Garis grafik terbentuk.','Karakter bergerak ke portal.','Checkpoint menyimpan progres.']):
        y=258+i*59;d.ellipse((98,y,129,y+31),fill='#1761ad');d.text((113,y+2),str(i+1),font=font(17,True),fill='#ffffff',anchor='ma');d.text((146,y+3),line,font=font(18),fill='#2c493b')
    rr(d,(97,553,551,592),11,'#fff1c4','#e6c25f',1);d.text((324,561),'LEVEL SELESAI · CHECKPOINT',font=font(17,True),fill='#6d5814',anchor='ma')
    chart(d,(630,158,1217,620),func=(2,-1),points=[(2,3,'Pemain'),(6,11,'Portal')])
    slides.append(im)
    return slides

# Narasi diperlambat dan diberi jeda agar tidak terasa terburu-buru.
MATERIAL_NARRATION = [
    "Selamat datang di GraphMath. Kita akan menghubungkan koordinat, fungsi, dan grafik untuk memecahkan tantangan matematika.",
    "Koordinat ditulis sebagai pasangan x dan y. Baca x untuk arah mendatar, lalu y untuk arah tegak. Titik pusatnya adalah nol, nol.",
    "Fungsi memasangkan setiap input dengan tepat satu output. Contohnya, fungsi dua x tambah satu menghasilkan tujuh saat x bernilai tiga.",
    "Bentuk persamaan garis adalah y sama dengan m x tambah b. m adalah gradien, sedangkan b adalah titik potong dengan sumbu Y. Jika diketahui dua titik, hitung m dengan rumus y dua dikurangi y satu, dibagi x dua dikurangi x satu.",
    "Misalnya titik A dua, tiga dan B enam, sebelas. Selisih y adalah delapan, dan selisih x adalah empat, jadi gradiennya dua. Masukkan ke persamaan, lalu gunakan titik A untuk memperoleh b sama dengan negatif satu. Persamaannya y sama dengan dua x dikurangi satu.",
    "Persamaan yang benar menjadi garis pada bidang koordinat. Dalam GraphMath, garis itu menjadi jalur yang mengarahkan karakter menuju portal dan checkpoint.",
]
TUTORIAL_NARRATION = [
    "Selamat datang di GraphMath. Selesaikan misi matematika dengan membentuk grafik sebagai jalur menuju portal.",
    "Baca koordinat titik awal dan portal dengan urutan x terlebih dahulu, lalu y. Perhatikan tanda positif dan negatif.",
    "Jenis soal akan berbeda pada setiap level. Kamu akan membaca koordinat, menghitung nilai fungsi, menentukan gradien, dan menyusun persamaan garis.",
    "Ketik jawaban pada kolom yang disediakan. Gunakan rumus pada materi, periksa perhitungan, lalu tekan tombol Periksa Jawaban.",
    "Jika jawaban belum tepat, baca umpan balik di layar. Periksa lagi selisih y, selisih x, atau konstanta, lalu coba kembali.",
    "Saat jawaban benar, grafik akan terbentuk dan karakter bergerak mengikuti jalur. Capai portal untuk membuka level berikutnya. Progres tersimpan di perangkatmu.",
]

def _wav_duration(path):
    import wave
    with wave.open(path, 'rb') as w:
        return w.getnframes() / float(w.getframerate())

def make_voiceover(narrations, output_wav, temp_dir):
    """Buat narasi Indonesia lebih lambat, dengan normalisasi dan jeda antarslide."""
    os.makedirs(temp_dir, exist_ok=True)
    chunks=[]
    slide_durations=[]
    speech_durations=[]
    for idx, text in enumerate(narrations):
        raw=os.path.join(temp_dir, f'voice-{idx:02d}-raw.wav')
        clean=os.path.join(temp_dir, f'voice-{idx:02d}-clean.wav')
        chunk=os.path.join(temp_dir, f'voice-{idx:02d}-padded.wav')
        # Pitch and tempo stay in a conversational range; previous build was too fast.
        subprocess.run(['espeak','-v','id+f2','-s','148','-p','48','-a','125','-w',raw,text],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        # Slight filtering and dynamics control make the level easier to listen to.
        af='highpass=f=90,lowpass=f=7500,acompressor=threshold=-22dB:ratio=2:attack=15:release=180:makeup=2,loudnorm=I=-16:TP=-2:LRA=7'
        subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',raw,'-af',af,'-ar','44100','-ac','2','-c:a','pcm_s16le',clean],check=True)
        speech_duration=_wav_duration(clean)
        # A full pause at the end of the narration lets students process each idea.
        slide_duration=max(9.0, round((speech_duration+1.3)*2)/2)
        pad=max(0.1, slide_duration-speech_duration)
        subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',clean,'-af',f'apad=pad_dur={pad:.3f},atrim=duration={slide_duration:.3f}','-ar','44100','-ac','2','-c:a','pcm_s16le',chunk],check=True)
        chunks.append(chunk); slide_durations.append(slide_duration); speech_durations.append(speech_duration)
    concat=os.path.join(temp_dir,'audio-concat.txt')
    with open(concat,'w',encoding='utf-8') as f:
        for path in chunks: f.write("file '"+path.replace("'", "'\\''")+"'\n")
    subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',concat,'-c:a','pcm_s16le',output_wav],check=True)
    return output_wav, slide_durations, speech_durations

def write_vtt(narrations, output_vtt, slide_durations, speech_durations):
    def stamp(seconds):
        ms=round(seconds*1000)
        h=ms//3600000; ms%=3600000; m=ms//60000; ms%=60000; sec=ms//1000; ms%=1000
        return f'{h:02d}:{m:02d}:{sec:02d}.{ms:03d}'
    cursor=0.0
    with open(output_vtt,'w',encoding='utf-8') as f:
        f.write('WEBVTT\n\n')
        for i,text in enumerate(narrations):
            f.write(f'{i+1}\n{stamp(cursor)} --> {stamp(cursor+speech_durations[i]-0.08)}\n{text}\n\n')
            cursor += slide_durations[i]

def render_video(slides,outfile,posterfile,narrations=None):
    """Render video edukasi visual tanpa narasi/audio."""
    frame_dir=os.path.join(MEDIA,os.path.splitext(os.path.basename(outfile))[0]+'_frames')
    os.makedirs(frame_dir,exist_ok=True)
    # Keep each slide visible long enough to read without spoken narration.
    slide_durations=[12.0 for _ in slides]
    slides[0].save(posterfile,quality=90)
    listfile=os.path.join(frame_dir,'concat.txt')
    lines=[]
    for i,im in enumerate(slides):
        png=os.path.join(frame_dir,f'slide-{i:02d}.png')
        im.save(png,optimize=True)
        lines.append(f"file '{png}'\nduration {slide_durations[i]:.3f}\n")
    last=os.path.join(frame_dir,f'slide-{len(slides)-1:02d}.png')
    lines.append(f"file '{last}'\nduration 0.04\n")
    with open(listfile,'w',encoding='utf-8') as f:
        f.writelines(lines)
    tmp=outfile+'.silent.tmp.mp4'
    cmd=['ffmpeg','-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',listfile,'-vf','fps=24,format=yuv420p','-c:v','libx264','-preset','medium','-crf','24','-movflags','+faststart','-an',tmp]
    subprocess.run(cmd,check=True)
    os.replace(tmp,outfile)
    import shutil
    shutil.rmtree(frame_dir,ignore_errors=True)


if __name__=='__main__':
    render_video(make_material_slides(),os.path.join(MEDIA,'materi-dasar.mp4'),os.path.join(MEDIA,'materi-poster.jpg'),MATERIAL_NARRATION)
    render_video(make_tutorial_slides(),os.path.join(MEDIA,'tutorial-gameplay.mp4'),os.path.join(MEDIA,'tutorial-poster.jpg'),TUTORIAL_NARRATION)
    print('Videos created')
