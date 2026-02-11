const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const readline = require('readline');
const fs = require('fs');

// Palette Warna & Emoji
const R = "\x1b[31m", G = "\x1b[32m", Y = "\x1b[33m", B = "\x1b[34m", P = "\x1b[35m", C = "\x1b[36m", W = "\x1b[37m", RESET = "\x1b[0m";
const ICON_USER = "👤", ICON_MSG = "💬", ICON_EDIT = "✏️", ICON_TRASH = "🗑️", ICON_HISTORY = "📜", ICON_BOOKMARK = "🔖", ICON_CLOCK = "🕒", ICON_WARN = "⚠️";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// --- SISTEM PENYIMPANAN BOOKMARK PERMANEN ---
const BOOKMARK_FILE = './bookmarks.json';
let bookmarks = [];

function loadBookmarks() {
    if (fs.existsSync(BOOKMARK_FILE)) {
        try { bookmarks = JSON.parse(fs.readFileSync(BOOKMARK_FILE, 'utf8')); } catch (e) { bookmarks = []; }
    }
}
function saveBookmarks() { fs.writeFileSync(BOOKMARK_FILE, JSON.stringify(bookmarks, null, 2)); }
function getWIBTime() {
    return new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta", hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
}

loadBookmarks();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        executablePath: '/data/data/com.termux/files/usr/bin/chromium-browser', 
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote']
    }
});

let nomorAktif = '';
let currentHistory = [];

// --- SISTEM LOGIN (3 PILIHAN) ---
console.clear();
console.log(`${G}╭──────────────────────────────────────────╮${RESET}`);
console.log(`${G}│        ✨ WHATSAPP TERMUX PREMIUM ✨     │${RESET}`);
console.log(`${G}│             Halo, Fitunnel!              │${RESET}`);
console.log(`${G}╰──────────────────────────────────────────╯${RESET}`);
console.log(`${W}Pilih Metode Login:${RESET}`);
console.log(`${G}1. Scan QR Code${RESET}`);
console.log(`${Y}2. Pakai Nomor HP (Pairing Code)${RESET}`);
console.log(`${C}3. Sudah Login Sebelumnya (Masuk Langsung)${RESET}`);

rl.question(`\n${C}Pilihan (1/2/3): ${RESET}`, (jawaban) => {
    if (jawaban === '3') {
        console.clear();
        console.log(`${G}[*] Memuat sesi lama... Mohon tunggu...${RESET}`);
        client.initialize();
    } else {
        client.initialize();
        client.on('qr', (qr) => {
            if (jawaban === '1') {
                console.clear();
                console.log(`${G}${ICON_WARN} SCAN QR BERIKUT UNTUK LOGIN:${RESET}`);
                qrcode.generate(qr, {small: true});
            } else if (jawaban === '2') {
                console.clear();
                console.log(`${Y}[*] Menyiapkan Pairing Code (Tunggu 10 detik)...${RESET}`);
                setTimeout(() => {
                    rl.question(`${W}${ICON_USER} Masukkan nomor WA (628xxx): ${RESET}`, async (num) => {
                        try {
                            const code = await client.requestPairingCode(num.replace(/\D/g, ''));
                            console.clear();
                            console.log(`\n${G}╔════════════════════════════════════╗${RESET}`);
                            console.log(`${G}║     KODE PAIRING:  ${Y}${code}     ${G}║${RESET}`);
                            console.log(`${G}╚════════════════════════════════════╝${RESET}`);
                            console.log(`${W}Tautkan di WhatsApp HP Anda sekarang!${RESET}\n`);
                        } catch (e) { 
                            console.log(`${R}Gagal mendapatkan kode!${RESET}`);
                            process.exit(); 
                        }
                    });
                }, 10000);
            }
        });
    }
});

client.on('ready', () => {
    console.clear();
    console.log(`${G}✅ BERHASIL TERHUBUNG, FITUNNEL!${RESET}`);
    menuUtama();
});

client.on('auth_failure', () => {
    console.clear();
    console.log(`${R}[!] Sesi tidak ditemukan atau kedaluwarsa.${RESET}`);
    console.log(`${W}Silakan jalankan ulang dan pilih menu 1 atau 2.${RESET}`);
    process.exit();
});

// --- MENU UTAMA ---
function menuUtama() {
    console.clear(); 
    const jamSekarang = getWIBTime();
    console.log(`\n${B}╔════════════════════════════════════════╗${RESET}`);
    console.log(`${B}║         ${Y}✨ TERMUX WA BY ALFI ✨${B}        ║${RESET}`);
    console.log(`${B}╠════════════════════════════════════════╣${RESET}`);
    console.log(`${B}║ ${ICON_CLOCK} Waktu (WIB): ${W}${jamSekarang}              ${B}║${RESET}`);
    console.log(`${B}╠════════════════════════════════════════╣${RESET}`);
    console.log(`${B}║ ${W}1. Chat / Kirim Pesan                  ${B}║${RESET}`);
    console.log(`${B}║ ${W}2. Lihat Riwayat Chat (Custom)         ${B}║${RESET}`);
    console.log(`${B}║ ${W}3. Edit Pesan (Typo)                   ${B}║${RESET}`);
    console.log(`${B}║ ${W}4. Tarik Pesan (Delete Everyone)       ${B}║${RESET}`);
    console.log(`${B}║ ${G}5. Daftar Bookmark (Permanen)          ${B}║${RESET}`);
    console.log(`${B}║ ${R}6. Logout & Ganti Akun (RESET)         ${B}║${RESET}`);
    console.log(`${B}║ ${R}0. Keluar / Stop                      ${B}║${RESET}`);
    console.log(`${B}╚════════════════════════════════════════╝${RESET}`);

    rl.question(`${C}Pilih Menu (0-6): ${RESET}`, async (pilih) => {
        switch (pilih) {
            case '1': inputNomor(); break;
            case '2': lihatRiwayat(); break;
            case '3': fiturEdit(); break;
            case '4': fiturTarik(); break;
            case '5': menuBookmark(); break;
            case '6': fiturResetAkun(); break;
            case '0': process.exit(); break;
            default: menuUtama(); break;
        }
    });
}

// --- FUNGSI CORE ---
async function inputNomor() {
    console.clear();
    if (bookmarks.length > 0) {
        console.log(`\n${Y}Kontak Bookmark:${RESET}`);
        bookmarks.forEach((b, i) => console.log(`${i + 1}. ${b.nama}`));
        rl.question(`${C}Pilih (1-${bookmarks.length}) atau 'n' (Nomor Baru): ${RESET}`, (opt) => {
            if (opt.toLowerCase() === 'n') {
                console.clear();
                mintaNomorManual();
            } else {
                const i = parseInt(opt) - 1;
                if (bookmarks[i]) { 
                    nomorAktif = `${bookmarks[i].nomor}@c.us`; 
                    console.clear();
                    console.log(`${G}Chatting dengan: ${Y}${bookmarks[i].nama}${RESET}`);
                    tanyaPesan(); 
                } else {
                    console.clear();
                    mintaNomorManual();
                }
            }
        });
    } else {
        mintaNomorManual();
    }
}

function mintaNomorManual() {
    rl.question(`\n${W}Masukkan nomor tujuan (628xxx): ${RESET}`, (num) => {
        nomorAktif = `${num.replace(/\D/g, '')}@c.us`;
        console.clear();
        console.log(`${G}Chatting dengan: ${Y}${nomorAktif}${RESET}`);
        tanyaPesan();
    });
}

function tanyaPesan() {
    rl.question(`${G}${ICON_MSG} PESAN (ketik 'm' ke menu): ${RESET}`, async (p) => {
        if (p.toLowerCase() === 'm') return menuUtama();
        try {
            const chat = await client.getChatById(nomorAktif);
            await chat.sendStateTyping();
            await client.sendMessage(nomorAktif, p);
            process.stdout.moveCursor(0, -1);
            process.stdout.clearLine();
            console.log(`${G}[SAYA]: ${W}${p}${RESET}`);
            tanyaPesan();
        } catch (e) { 
            console.log(`${R}Gagal mengirim! Pastikan nomor terdaftar.${RESET}`); 
            tanyaPesan(); 
        }
    });
}

async function lihatRiwayat() {
    console.clear();
    if (!nomorAktif) {
        console.log(`${R}Pilih nomor dulu di menu 1!${RESET}`);
        return setTimeout(menuUtama, 2000);
    }
    rl.question(`${W}Jumlah pesan yang ingin ditampilkan: ${RESET}`, async (limit) => {
        console.clear();
        try {
            const chat = await client.getChatById(nomorAktif);
            currentHistory = await chat.fetchMessages({ limit: parseInt(limit) || 10 });
            console.log(`\n${B}--- RIWAYAT CHAT ---${RESET}`);
            currentHistory.forEach((msg, i) => {
                console.log(`${msg.fromMe ? G : P}[${i}] ${msg.fromMe ? 'SAYA' : 'DIA'}: ${W}${msg.body}${RESET}`);
            });
            rl.question(`\n${Y}Tekan Enter untuk kembali ke menu...${RESET}`, () => menuUtama());
        } catch (e) { menuUtama(); }
    });
}

async function fiturEdit() {
    console.clear();
    if (currentHistory.length === 0) {
        console.log(`${R}Lihat riwayat dulu (Menu 2) agar pesan terdeteksi!${RESET}`);
        return setTimeout(menuUtama, 2500);
    }
    rl.question(`${W}Masukkan Indeks pesan (angka) yang mau diedit: ${RESET}`, (i) => {
        const msg = currentHistory[i];
        if (msg && msg.fromMe) {
            rl.question(`${C}Teks Baru: ${RESET}`, async (txt) => { 
                await msg.edit(txt); 
                console.log(`${G}Pesan berhasil diperbarui!${RESET}`);
                setTimeout(menuUtama, 1500);
            });
        } else { 
            console.log(`${R}Gagal! Hanya bisa edit pesan milik sendiri.${RESET}`);
            setTimeout(menuUtama, 2000);
        }
    });
}

async function fiturTarik() {
    console.clear();
    if (currentHistory.length === 0) {
        console.log(`${R}Lihat riwayat dulu (Menu 2) agar pesan terdeteksi!${RESET}`);
        return setTimeout(menuUtama, 2500);
    }
    rl.question(`${R}Masukkan Indeks pesan (angka) yang mau ditarik: ${RESET}`, async (i) => {
        const msg = currentHistory[i];
        if (msg && msg.fromMe) { 
            await msg.delete(true); 
            console.log(`${G}Pesan berhasil ditarik untuk semua orang!${RESET}`);
        } else {
            console.log(`${R}Gagal! Tidak bisa menarik pesan ini.${RESET}`);
        }
        setTimeout(menuUtama, 1500);
    });
}

function menuBookmark() {
    console.clear();
    console.log(`\n${G}── DAFTAR BOOKMARK (KONTAK SAVED) ──${RESET}`);
    if (bookmarks.length === 0) console.log(`${W} (Belum ada kontak disimpan) ${RESET}`);
    bookmarks.forEach((b, i) => console.log(`${W}${i + 1}. ${b.nama} (${b.nomor})${RESET}`));
    rl.question(`\n${W}a:Tambah | d:Hapus | m:Menu Utama: ${RESET}`, (opt) => {
        if (opt.toLowerCase() === 'a') {
            console.clear();
            rl.question("Nama Kontak: ", (nama) => rl.question("Nomor (628xxx): ", (nomor) => {
                bookmarks.push({ nama, nomor: nomor.replace(/\D/g, '') });
                saveBookmarks(); 
                menuBookmark();
            }));
        } else if (opt.toLowerCase() === 'd') {
            rl.question("Hapus nomor urutan ke: ", (idx) => {
                const i = parseInt(idx) - 1;
                if (bookmarks[i]) bookmarks.splice(i, 1);
                saveBookmarks(); 
                menuBookmark();
            });
        } else {
            menuUtama();
        }
    });
}

async function fiturResetAkun() {
    console.clear();
    rl.question(`\n${R}⚠️ PERINGATAN: Logout akan menghapus sesi login! (y/n): ${RESET}`, async (ans) => {
        if (ans.toLowerCase() === 'y') {
            if (fs.existsSync('./.wwebjs_auth')) { 
                fs.rmSync('./.wwebjs_auth', { recursive: true, force: true }); 
            }
            console.clear();
            console.log(`${G}Sesi berhasil dihapus. Silakan jalankan ulang script.${RESET}`);
            process.exit();
        } else {
            menuUtama();
        }
    });
}

// Listener Pesan Masuk Otomatis
client.on('message', async (msg) => {
    try {
        await client.sendSeen(msg.from); 
        if (msg.from === nomorAktif) {
            console.log(`\n${P}[DIA]: ${W}${msg.body}${RESET}`);
            process.stdout.write(`${G}${ICON_MSG} PESAN: ${RESET}`);
        }
    } catch (e) {}
});
