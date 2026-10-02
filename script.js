// ======================================================
// KONFIGURASI SUPABASE
// ======================================================

const SUPABASE_URL = "https://fmgemouvabopxagtuuje.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_uv-BWSOCGWvlh4NJRwSRCA_l-aILwuH";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ======================================================
// ELEMENT
// ======================================================

const halamanLogin = document.getElementById("halamanLogin");
const halamanDaftar = document.getElementById("halamanDaftar");
const aplikasi = document.getElementById("aplikasi");

const usernameLogin = document.getElementById("usernameLogin");
const passwordLogin = document.getElementById("passwordLogin");

const usernameDaftar = document.getElementById("usernameDaftar");
const passwordDaftar = document.getElementById("passwordDaftar");

const tombolLogin = document.getElementById("tombolLogin");
const tombolDaftar = document.getElementById("tombolDaftar");

const tombolTampilDaftar =
    document.getElementById("tombolTampilDaftar");

const tombolTampilLogin =
    document.getElementById("tombolTampilLogin");

const tombolLogout =
    document.getElementById("tombolLogout");

const pesanLogin =
    document.getElementById("pesanLogin");

const pesanDaftar =
    document.getElementById("pesanDaftar");

const formAbsensi =
    document.getElementById("formAbsensi");

const tanggal =
    document.getElementById("tanggal");

const hari =
    document.getElementById("hari");

const nama =
    document.getElementById("nama");

const keterangan =
    document.getElementById("keterangan");

const tombolSimpan =
    document.getElementById("tombolSimpan");

const tombolBatal =
    document.getElementById("tombolBatal");

const pesanForm =
    document.getElementById("pesanForm");

const daftarAbsensi =
    document.getElementById("daftarAbsensi");

const filterNama =
    document.getElementById("filterNama");

const filterTanggal =
    document.getElementById("filterTanggal");

const filterKeterangan =
    document.getElementById("filterKeterangan");

const tombolResetFilter =
    document.getElementById("tombolResetFilter");

const tombolHariIni =
    document.getElementById("tombolHariIni");

const tombolCetakData =
    document.getElementById("tombolCetakData");

const infoAkun =
    document.getElementById("infoAkun");

const pilihanPeriode =
    document.getElementById("pilihanPeriode");

const customTanggal =
    document.getElementById("customTanggal");

const tanggalMulaiRekap =
    document.getElementById("tanggalMulaiRekap");

const tanggalAkhirRekap =
    document.getElementById("tanggalAkhirRekap");

const tombolBuatRekap =
    document.getElementById("tombolBuatRekap");

const tombolCetakRekap =
    document.getElementById("tombolCetakRekap");

const infoPeriodeRekap =
    document.getElementById("infoPeriodeRekap");

const hasilRekap =
    document.getElementById("hasilRekap");


// ======================================================
// STATE
// ======================================================

let semuaDataAbsensi = [];
let dataRekapSaatIni = [];
let userSekarang = null;
let idSedangDiedit = null;


// ======================================================
// UTILITAS
// ======================================================

function escapeHtml(teks) {

    return String(teks ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function formatTanggal(tanggalString) {

    if (!tanggalString) return "-";

    const [tahun, bulan, hari] =
        tanggalString.split("-");

    return `${hari}-${bulan}-${tahun}`;
}


function formatTanggalPanjang(tanggalString) {

    if (!tanggalString) return "-";

    const date = new Date(
        `${tanggalString}T00:00:00`
    );

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}


function tanggalHariIni() {

    const sekarang = new Date();

    const tahun = sekarang.getFullYear();

    const bulan = String(
        sekarang.getMonth() + 1
    ).padStart(2, "0");

    const tanggal = String(
        sekarang.getDate()
    ).padStart(2, "0");

    return `${tahun}-${bulan}-${tanggal}`;
}


function getNamaHari(tanggalString) {

    if (!tanggalString) return "";

    const date = new Date(
        `${tanggalString}T00:00:00`
    );

    return date.toLocaleDateString(
        "id-ID",
        {
            weekday: "long"
        }
    );
}


function ubahTanggalKeDate(tanggalString) {

    return new Date(
        `${tanggalString}T00:00:00`
    );
}


function dateKeString(date) {

    const tahun = date.getFullYear();

    const bulan = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const tanggal = String(
        date.getDate()
    ).padStart(2, "0");

    return `${tahun}-${bulan}-${tanggal}`;
}


// ======================================================
// LOGIN / REGISTER
// ======================================================

function usernameKeEmail(username) {

    return `${username.trim().toLowerCase()}@auth.absensiku.invalid`;
}


tombolTampilDaftar.addEventListener(
    "click",
    () => {

        halamanLogin.classList.add("hidden");
        halamanDaftar.classList.remove("hidden");

        pesanLogin.textContent = "";
    }
);


tombolTampilLogin.addEventListener(
    "click",
    () => {

        halamanDaftar.classList.add("hidden");
        halamanLogin.classList.remove("hidden");

        pesanDaftar.textContent = "";
    }
);


tombolDaftar.addEventListener(
    "click",
    async () => {

        const username =
            usernameDaftar.value.trim();

        const password =
            passwordDaftar.value;

        if (!username || !password) {

            pesanDaftar.textContent =
                "Username dan password wajib diisi.";

            return;
        }

        if (username.length < 3) {

            pesanDaftar.textContent =
                "Username minimal 3 karakter.";

            return;
        }

        if (password.length < 6) {

            pesanDaftar.textContent =
                "Password minimal 6 karakter.";

            return;
        }

        tombolDaftar.disabled = true;
        pesanDaftar.textContent =
            "Sedang membuat akun...";

        try {

            const email =
                usernameKeEmail(username);

            const { error } =
                await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username
                        }
                    }
                });

            if (error) {
                throw error;
            }

            pesanDaftar.textContent =
                "Akun berhasil dibuat. Silakan login.";

            usernameDaftar.value = "";
            passwordDaftar.value = "";

        } catch (error) {

            console.error(error);

            pesanDaftar.textContent =
                error.message ||
                "Gagal membuat akun.";

        } finally {

            tombolDaftar.disabled = false;
        }
    }
);


tombolLogin.addEventListener(
    "click",
    login
);


passwordLogin.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            login();
        }
    }
);


async function login() {

    const username =
        usernameLogin.value.trim();

    const password =
        passwordLogin.value;

    if (!username || !password) {

        pesanLogin.textContent =
            "Username dan password wajib diisi.";

        return;
    }

    tombolLogin.disabled = true;

    pesanLogin.textContent =
        "Sedang masuk...";

    try {

        const email =
            usernameKeEmail(username);

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            throw error;
        }

        userSekarang = data.user;

        await masukKeAplikasi();

    } catch (error) {

        console.error(error);

        pesanLogin.textContent =
            "Username atau password salah.";

    } finally {

        tombolLogin.disabled = false;
    }
}


tombolLogout.addEventListener(
    "click",
    async () => {

        await supabaseClient.auth.signOut();

        userSekarang = null;

        aplikasi.classList.add("hidden");
        halamanLogin.classList.remove("hidden");

        usernameLogin.value = "";
        passwordLogin.value = "";
    }
);


// ======================================================
// SESSION
// ======================================================

async function cekSession() {

    const { data } =
        await supabaseClient.auth.getSession();

    if (data.session) {

        userSekarang =
            data.session.user;

        await masukKeAplikasi();

    } else {

        halamanLogin.classList.remove("hidden");
        aplikasi.classList.add("hidden");
    }
}


async function masukKeAplikasi() {

    halamanLogin.classList.add("hidden");
    halamanDaftar.classList.add("hidden");
    aplikasi.classList.remove("hidden");

    const username =
        userSekarang?.user_metadata?.username ||
        userSekarang?.email?.split("@")[0] ||
        "Pengguna";

    infoAkun.textContent =
        `Login sebagai: ${username}`;

    tanggal.value =
        tanggalHariIni();

    updateHari();

    await ambilDataAbsensi();

    buatRekap();
}


supabaseClient.auth.onAuthStateChange(
    async (event, session) => {

        if (session) {

            userSekarang =
                session.user;

        } else {

            userSekarang = null;
        }
    }
);


// ======================================================
// TANGGAL & HARI
// ======================================================

tanggal.addEventListener(
    "change",
    updateHari
);


function updateHari() {

    hari.value =
        getNamaHari(tanggal.value);
}


// ======================================================
// AMBIL DATA ABSENSI
// ======================================================

async function ambilDataAbsensi() {

    if (!userSekarang) return;

    const { data, error } =
        await supabaseClient
            .from("absensi")
            .select("*")
            .eq("user_id", userSekarang.id)
            .order("tanggal", {
                ascending: false
            });

    if (error) {

        console.error(error);

        daftarAbsensi.innerHTML = `
            <div class="empty">
                Gagal mengambil data absensi.
            </div>
        `;

        return;
    }

    semuaDataAbsensi =
        data || [];

    tampilkanData();
    buatRekap();
}


// ======================================================
// TAMBAH / EDIT ABSENSI
// ======================================================

formAbsensi.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        if (!userSekarang) return;

        const dataAbsensi = {

            hari: hari.value,

            tanggal: tanggal.value,

            nama: nama.value.trim(),

            keterangan: keterangan.value,

            user_id: userSekarang.id
        };

        if (
            !dataAbsensi.tanggal ||
            !dataAbsensi.nama ||
            !dataAbsensi.keterangan
        ) {

            pesanForm.textContent =
                "Semua data wajib diisi.";

            return;
        }

        tombolSimpan.disabled = true;

        try {

            let error;

            if (idSedangDiedit) {

                const hasil =
                    await supabaseClient
                        .from("absensi")
                        .update(dataAbsensi)
                        .eq("id", idSedangDiedit)
                        .eq("user_id", userSekarang.id);

                error = hasil.error;

            } else {

                const hasil =
                    await supabaseClient
                        .from("absensi")
                        .insert(dataAbsensi);

                error = hasil.error;
            }

            if (error) {
                throw error;
            }

            pesanForm.textContent =
                idSedangDiedit
                    ? "Data berhasil diperbarui."
                    : "Absensi berhasil disimpan.";

            resetForm();

            await ambilDataAbsensi();

        } catch (error) {

            console.error(error);

            pesanForm.textContent =
                "Gagal menyimpan data.";

        } finally {

            tombolSimpan.disabled = false;
        }
    }
);


function resetForm() {

    idSedangDiedit = null;

    tanggal.value =
        tanggalHariIni();

    updateHari();

    nama.value = "";

    keterangan.value = "";

    tombolSimpan.textContent =
        "Simpan Absensi";

    tombolBatal.classList.add("hidden");

    document.getElementById("judulForm").textContent =
        "Tambah Absensi";
}


tombolBatal.addEventListener(
    "click",
    resetForm
);


// ======================================================
// TAMPIL DATA
// ======================================================

function tampilkanData() {

    const namaFilter =
        filterNama.value
            .trim()
            .toLowerCase();

    const tanggalFilter =
        filterTanggal.value;

    const keteranganFilter =
        filterKeterangan.value;

    const data =
        semuaDataAbsensi.filter(item => {

            const cocokNama =
                !namaFilter ||
                item.nama
                    .toLowerCase()
                    .includes(namaFilter);

            const cocokTanggal =
                !tanggalFilter ||
                item.tanggal === tanggalFilter;

            const cocokKeterangan =
                !keteranganFilter ||
                item.keterangan === keteranganFilter;

            return (
                cocokNama &&
                cocokTanggal &&
                cocokKeterangan
            );
        });

    if (data.length === 0) {

        daftarAbsensi.innerHTML = `
            <div class="empty">
                Tidak ada data absensi.
            </div>
        `;

        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Hari</th>
                    <th>Tanggal</th>
                    <th>Nama</th>
                    <th>Keterangan</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach((item, index) => {

        const badgeClass =
            item.keterangan === "Alfa"
                ? "badge-alfa"
                : item.keterangan === "Izin"
                    ? "badge-izin"
                    : "badge-sakit";

        html += `
            <tr>

                <td>${index + 1}</td>

                <td>
                    ${escapeHtml(item.hari)}
                </td>

                <td>
                    ${formatTanggal(item.tanggal)}
                </td>

                <td>
                    ${escapeHtml(item.nama)}
                </td>

                <td>
                    <span class="badge ${badgeClass}">
                        ${escapeHtml(item.keterangan)}
                    </span>
                </td>

                <td>
                    <div class="aksi">

                        <button
                            class="btn-small btn-secondary"
                            onclick="editAbsensi(${item.id})"
                        >
                            Edit
                        </button>

                        <button
                            class="btn-small btn-danger"
                            onclick="hapusAbsensi(${item.id})"
                        >
                            Hapus
                        </button>

                    </div>
                </td>

            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    daftarAbsensi.innerHTML =
        html;
}


// ======================================================
// EDIT
// ======================================================

window.editAbsensi =
    function(id) {

        const item =
            semuaDataAbsensi.find(
                data => data.id === id
            );

        if (!item) return;

        idSedangDiedit =
            id;

        tanggal.value =
            item.tanggal;

        hari.value =
            item.hari;

        nama.value =
            item.nama;

        keterangan.value =
            item.keterangan;

        tombolSimpan.textContent =
            "Simpan Perubahan";

        tombolBatal.classList.remove(
            "hidden"
        );

        document.getElementById(
            "judulForm"
        ).textContent =
            "Edit Absensi";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


// ======================================================
// HAPUS
// ======================================================

window.hapusAbsensi =
    async function(id) {

        if (!userSekarang) return;

        const yakin =
            confirm(
                "Yakin ingin menghapus data ini?"
            );

        if (!yakin) return;

        const { error } =
            await supabaseClient
                .from("absensi")
                .delete()
                .eq("id", id)
                .eq("user_id", userSekarang.id);

        if (error) {

            console.error(error);

            alert(
                "Gagal menghapus data."
            );

            return;
        }

        await ambilDataAbsensi();
    };


// ======================================================
// FILTER
// ======================================================

filterNama.addEventListener(
    "input",
    tampilkanData
);

filterTanggal.addEventListener(
    "change",
    tampilkanData
);

filterKeterangan.addEventListener(
    "change",
    tampilkanData
);


tombolResetFilter.addEventListener(
    "click",
    () => {

        filterNama.value = "";
        filterTanggal.value = "";
        filterKeterangan.value = "";

        tampilkanData();
    }
);


tombolHariIni.addEventListener(
    "click",
    () => {

        filterTanggal.value =
            tanggalHariIni();

        filterNama.value = "";
        filterKeterangan.value = "";

        tampilkanData();
    }
);


// ======================================================
// PERIODE REKAP
// ======================================================

pilihanPeriode.addEventListener(
    "change",
    () => {

        if (
            pilihanPeriode.value ===
            "custom"
        ) {

            customTanggal.classList.remove(
                "hidden"
            );

        } else {

            customTanggal.classList.add(
                "hidden"
            );
        }
    }
);


function getPeriodeRekap() {

    const sekarang =
        ubahTanggalKeDate(
            tanggalHariIni()
        );

    let mulai;
    let akhir =
        new Date(sekarang);

    const pilihan =
        pilihanPeriode.value;

    if (pilihan === "custom") {

        if (
            !tanggalMulaiRekap.value ||
            !tanggalAkhirRekap.value
        ) {

            return null;
        }

        mulai =
            ubahTanggalKeDate(
                tanggalMulaiRekap.value
            );

        akhir =
            ubahTanggalKeDate(
                tanggalAkhirRekap.value
            );

        return {
            mulai: dateKeString(mulai),
            akhir: dateKeString(akhir)
        };
    }


    // 1 MINGGU
    if (pilihan === "minggu1") {

        mulai =
            new Date(sekarang);

        mulai.setDate(
            mulai.getDate() - 6
        );
    }


    // 2 MINGGU
    else if (pilihan === "minggu2") {

        mulai =
            new Date(sekarang);

        mulai.setDate(
            mulai.getDate() - 13
        );
    }


    // 3 MINGGU
    else if (pilihan === "minggu3") {

        mulai =
            new Date(sekarang);

        mulai.setDate(
            mulai.getDate() - 20
        );
    }


    // 1 BULAN
    else if (pilihan === "bulan1") {

        mulai =
            new Date(sekarang);

        mulai.setMonth(
            mulai.getMonth() - 1
        );

        mulai.setDate(
            mulai.getDate() + 1
        );
    }


    // 3 BULAN
    else if (pilihan === "bulan3") {

        mulai =
            new Date(sekarang);

        mulai.setMonth(
            mulai.getMonth() - 3
        );

        mulai.setDate(
            mulai.getDate() + 1
        );
    }


    // 6 BULAN
    else if (pilihan === "bulan6") {

        mulai =
            new Date(sekarang);

        mulai.setMonth(
            mulai.getMonth() - 6
        );

        mulai.setDate(
            mulai.getDate() + 1
        );
    }


    // 1 TAHUN
    else if (pilihan === "tahun1") {

        mulai =
            new Date(sekarang);

        mulai.setFullYear(
            mulai.getFullYear() - 1
        );

        mulai.setDate(
            mulai.getDate() + 1
        );
    }


    return {
        mulai: dateKeString(mulai),
        akhir: dateKeString(akhir)
    };
}


// ======================================================
// BUAT REKAP PER SISWA
// ======================================================

tombolBuatRekap.addEventListener(
    "click",
    buatRekap
);


function buatRekap() {

    const periode =
        getPeriodeRekap();

    if (!periode) {

        infoPeriodeRekap.textContent =
            "Silakan tentukan tanggal mulai dan tanggal akhir.";

        hasilRekap.innerHTML = "";

        return;
    }

    if (
        periode.mulai >
        periode.akhir
    ) {

        infoPeriodeRekap.textContent =
            "Tanggal mulai tidak boleh lebih besar dari tanggal akhir.";

        hasilRekap.innerHTML = "";

        return;
    }


    // Ambil data sesuai periode
    const dataPeriode =
        semuaDataAbsensi.filter(item => {

            return (
                item.tanggal >= periode.mulai &&
                item.tanggal <= periode.akhir
            );
        });


    // GROUPING PER SISWA
    const kelompokSiswa = {};


    dataPeriode.forEach(item => {

        const namaAsli =
            item.nama.trim();

        const key =
            namaAsli.toLowerCase();

        if (!kelompokSiswa[key]) {

            kelompokSiswa[key] = {

                nama: namaAsli,

                Alfa: 0,

                Izin: 0,

                Sakit: 0,

                Total: 0
            };
        }


        if (
            kelompokSiswa[key][
                item.keterangan
            ] !== undefined
        ) {

            kelompokSiswa[key][
                item.keterangan
            ]++;

            kelompokSiswa[key].Total++;
        }

    });


    dataRekapSaatIni =
        Object.values(
            kelompokSiswa
        );


    // SORT NAMA
    dataRekapSaatIni.sort(
        (a, b) =>
            a.nama.localeCompare(
                b.nama,
                "id"
            )
    );


    infoPeriodeRekap.innerHTML = `
        Periode:
        <strong>
            ${formatTanggalPanjang(periode.mulai)}
        </strong>
        sampai
        <strong>
            ${formatTanggalPanjang(periode.akhir)}
        </strong>
        — ${dataPeriode.length} data absensi
    `;


    if (
        dataRekapSaatIni.length === 0
    ) {

        hasilRekap.innerHTML = `
            <div class="empty">
                Tidak ada data absensi pada periode ini.
            </div>
        `;

        return;
    }


    let html = `
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Siswa</th>
                    <th class="text-center">Alfa</th>
                    <th class="text-center">Izin</th>
                    <th class="text-center">Sakit</th>
                    <th class="text-center">Total</th>
                </tr>
            </thead>

            <tbody>
    `;


    dataRekapSaatIni.forEach(
        (siswa, index) => {

            html += `
                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <strong>
                            ${escapeHtml(
                                siswa.nama
                            )}
                        </strong>
                    </td>

                    <td class="text-center">
                        ${siswa.Alfa}
                    </td>

                    <td class="text-center">
                        ${siswa.Izin}
                    </td>

                    <td class="text-center">
                        ${siswa.Sakit}
                    </td>

                    <td class="text-center rekap-total">
                        ${siswa.Total}
                    </td>

                </tr>
            `;
        }
    );


    html += `
            </tbody>
        </table>
    `;


    hasilRekap.innerHTML =
        html;
}


// ======================================================
// CETAK DATA ABSENSI - VERSI RAPI
// ======================================================

tombolCetakData.addEventListener(
    "click",
    () => {

        const namaFilter =
            filterNama.value.trim();

        const tanggalFilter =
            filterTanggal.value;

        const keteranganFilter =
            filterKeterangan.value;


        const data =
            semuaDataAbsensi.filter(item => {

                const cocokNama =
                    !namaFilter ||
                    item.nama
                        .toLowerCase()
                        .includes(
                            namaFilter.toLowerCase()
                        );

                const cocokTanggal =
                    !tanggalFilter ||
                    item.tanggal === tanggalFilter;

                const cocokKeterangan =
                    !keteranganFilter ||
                    item.keterangan ===
                        keteranganFilter;

                return (
                    cocokNama &&
                    cocokTanggal &&
                    cocokKeterangan
                );
            });


        if (data.length === 0) {

            alert(
                "Tidak ada data yang bisa dicetak."
            );

            return;
        }


        let rows = "";


        data.forEach(
            (item, index) => {

                rows += `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${escapeHtml(item.hari)}
                        </td>

                        <td>
                            ${formatTanggal(item.tanggal)}
                        </td>

                        <td class="nama">
                            ${escapeHtml(item.nama)}
                        </td>

                        <td>
                            ${escapeHtml(item.keterangan)}
                        </td>

                    </tr>
                `;
            }
        );


        const namaAkun =
            userSekarang?.user_metadata?.username ||
            "Pengguna";


        const jendela =
            window.open(
                "",
                "_blank"
            );


        jendela.document.write(`
            <!DOCTYPE html>

            <html lang="id">

            <head>

                <meta charset="UTF-8">

                <title>
                    Data Absensi - AbsensiKu
                </title>

                <style>

                    @page {
                        size: A4 portrait;
                        margin: 18mm;
                    }

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;

                        color: #172033;

                        margin: 0;
                    }

                    .header {
                        border-bottom:
                            3px solid #2563eb;

                        padding-bottom: 13px;

                        margin-bottom: 18px;
                    }

                    .header-top {
                        display: flex;

                        justify-content:
                            space-between;

                        align-items:
                            flex-start;

                        gap: 20px;
                    }

                    .title {
                        font-size: 22px;

                        font-weight: 800;

                        color: #172554;

                        margin: 0;
                    }

                    .subtitle {
                        margin-top: 4px;

                        font-size: 12px;

                        color: #64748b;
                    }

                    .info {
                        text-align: right;

                        font-size: 11px;

                        color: #64748b;

                        line-height: 1.6;
                    }

                    .filter-info {
                        background: #eff6ff;

                        border:
                            1px solid #bfdbfe;

                        border-radius: 7px;

                        padding: 9px 12px;

                        margin-bottom: 15px;

                        font-size: 11px;

                        color: #1e3a8a;
                    }

                    table {
                        width: 100%;

                        border-collapse:
                            collapse;

                        font-size: 11px;
                    }

                    th {
                        background: #1e3a8a;

                        color: white;

                        padding: 9px 7px;

                        border:
                            1px solid #1e3a8a;

                        text-align: center;
                    }

                    td {
                        padding: 8px 7px;

                        border:
                            1px solid #cbd5e1;

                        text-align: center;
                    }

                    td.nama {
                        text-align: left;

                        font-weight: 600;
                    }

                    tbody tr:nth-child(even) {
                        background: #f8fafc;
                    }

                    .footer {
                        margin-top: 25px;

                        padding-top: 10px;

                        border-top:
                            1px solid #e2e8f0;

                        display: flex;

                        justify-content:
                            space-between;

                        font-size: 10px;

                        color: #64748b;
                    }

                </style>

            </head>

            <body>

                <div class="header">

                    <div class="header-top">

                        <div>

                            <h1 class="title">
                                DATA ABSENSI SISWA
                            </h1>

                            <div class="subtitle">
                                AbsensiKu
                            </div>

                        </div>

                        <div class="info">

                            Akun:
                            <strong>
                                ${escapeHtml(namaAkun)}
                            </strong>

                            <br>

                            Dicetak:
                            ${formatTanggalPanjang(
                                tanggalHariIni()
                            )}

                        </div>

                    </div>

                </div>


                <div class="filter-info">

                    <strong>
                        Filter:
                    </strong>

                    ${
                        namaFilter
                            ? `Nama: ${escapeHtml(namaFilter)}`
                            : "Semua siswa"
                    }

                    &nbsp; | &nbsp;

                    ${
                        tanggalFilter
                            ? `Tanggal: ${formatTanggal(tanggalFilter)}`
                            : "Semua tanggal"
                    }

                    &nbsp; | &nbsp;

                    ${
                        keteranganFilter
                            ? `Keterangan: ${escapeHtml(keteranganFilter)}`
                            : "Semua keterangan"
                    }

                </div>


                <table>

                    <thead>

                        <tr>

                            <th style="width: 7%;">
                                No
                            </th>

                            <th style="width: 15%;">
                                Hari
                            </th>

                            <th style="width: 18%;">
                                Tanggal
                            </th>

                            <th>
                                Nama Siswa
                            </th>

                            <th style="width: 18%;">
                                Keterangan
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>


                <div class="footer">

                    <span>
                        Jumlah data:
                        <strong>${data.length}</strong>
                    </span>

                    <span>
                        AbsensiKu
                    </span>

                </div>


                <script>

                    window.onload = function() {

                        setTimeout(
                            function() {
                                window.print();
                            },
                            300
                        );

                    };

                <\/script>

            </body>

            </html>
        `);


        jendela.document.close();
    });


// ======================================================
// CETAK REKAP PER SISWA - VERSI RAPI
// ======================================================

tombolCetakRekap.addEventListener(
    "click",
    () => {

        if (
            dataRekapSaatIni.length === 0
        ) {

            alert(
                "Buat rekap terlebih dahulu."
            );

            return;
        }


        const periode =
            getPeriodeRekap();


        if (!periode) {

            alert(
                "Periode rekap belum ditentukan."
            );

            return;
        }


        let rows = "";


        dataRekapSaatIni.forEach(
            (siswa, index) => {

                rows += `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td class="nama">
                            ${escapeHtml(
                                siswa.nama
                            )}
                        </td>

                        <td>
                            ${siswa.Alfa}
                        </td>

                        <td>
                            ${siswa.Izin}
                        </td>

                        <td>
                            ${siswa.Sakit}
                        </td>

                        <td class="total">
                            ${siswa.Total}
                        </td>

                    </tr>
                `;
            }
        );


        const namaAkun =
            userSekarang?.user_metadata?.username ||
            "Pengguna";


        const jendela =
            window.open(
                "",
                "_blank"
            );


        jendela.document.write(`
            <!DOCTYPE html>

            <html lang="id">

            <head>

                <meta charset="UTF-8">

                <title>
                    Rekap Absensi - AbsensiKu
                </title>

                <style>

                    @page {
                        size: A4 portrait;
                        margin: 18mm;
                    }

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;

                        color: #172033;

                        margin: 0;
                    }

                    .header {
                        border-bottom:
                            3px solid #2563eb;

                        padding-bottom: 13px;

                        margin-bottom: 18px;
                    }

                    .header-top {
                        display: flex;

                        justify-content:
                            space-between;

                        align-items:
                            flex-start;

                        gap: 20px;
                    }

                    .title {
                        font-size: 23px;

                        font-weight: 800;

                        color: #172554;

                        margin: 0;
                    }

                    .subtitle {
                        margin-top: 4px;

                        font-size: 12px;

                        color: #64748b;
                    }

                    .info {
                        text-align: right;

                        font-size: 11px;

                        color: #64748b;

                        line-height: 1.6;
                    }

                    .periode {
                        padding: 11px 14px;

                        background: #eff6ff;

                        border:
                            1px solid #bfdbfe;

                        border-radius: 7px;

                        margin-bottom: 17px;

                        color: #1e3a8a;

                        font-size: 12px;

                        text-align: center;
                    }

                    table {
                        width: 100%;

                        border-collapse:
                            collapse;

                        font-size: 11px;
                    }

                    th {
                        background: #1e3a8a;

                        color: white;

                        padding: 10px 8px;

                        border:
                            1px solid #1e3a8a;

                        text-align: center;
                    }

                    td {
                        padding: 9px 8px;

                        border:
                            1px solid #cbd5e1;

                        text-align: center;
                    }

                    td.nama {
                        text-align: left;

                        font-weight: 600;
                    }

                    td.total {
                        font-weight: 800;

                        color: #1d4ed8;
                    }

                    tbody tr:nth-child(even) {
                        background: #f8fafc;
                    }

                    .summary {
                        margin-top: 14px;

                        display: flex;

                        justify-content:
                            flex-end;

                        font-size: 11px;

                        color: #475569;
                    }

                    .signature-area {
                        margin-top: 65px;

                        display: flex;

                        justify-content:
                            flex-end;
                    }

                    .signature {
                        width: 190px;

                        text-align: center;

                        font-size: 11px;

                        color: #334155;
                    }

                    .signature-space {
                        height: 65px;
                    }

                    .signature-line {
                        border-bottom:
                            1px solid #334155;

                        margin-bottom: 4px;
                    }

                    .footer {
                        margin-top: 25px;

                        padding-top: 10px;

                        border-top:
                            1px solid #e2e8f0;

                        display: flex;

                        justify-content:
                            space-between;

                        font-size: 10px;

                        color: #64748b;
                    }

                </style>

            </head>

            <body>

                <div class="header">

                    <div class="header-top">

                        <div>

                            <h1 class="title">
                                REKAP ABSENSI SISWA
                            </h1>

                            <div class="subtitle">
                                AbsensiKu
                            </div>

                        </div>

                        <div class="info">

                            Akun:
                            <strong>
                                ${escapeHtml(namaAkun)}
                            </strong>

                            <br>

                            Dicetak:
                            ${formatTanggalPanjang(
                                tanggalHariIni()
                            )}

                        </div>

                    </div>

                </div>


                <div class="periode">

                    <strong>
                        Periode Rekap
                    </strong>

                    <br>

                    ${formatTanggalPanjang(
                        periode.mulai
                    )}

                    &nbsp; s/d &nbsp;

                    ${formatTanggalPanjang(
                        periode.akhir
                    )}

                </div>


                <table>

                    <thead>

                        <tr>

                            <th style="width: 8%;">
                                No
                            </th>

                            <th>
                                Nama Siswa
                            </th>

                            <th style="width: 14%;">
                                Alfa
                            </th>

                            <th style="width: 14%;">
                                Izin
                            </th>

                            <th style="width: 14%;">
                                Sakit
                            </th>

                            <th style="width: 14%;">
                                Total
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>


                <div class="summary">

                    Jumlah siswa:
                    <strong>
                        &nbsp;
                        ${dataRekapSaatIni.length}
                    </strong>

                </div>


                <div class="signature-area">

                    <div class="signature">

                        Mengetahui,

                        <div class="signature-space"></div>

                        <div class="signature-line"></div>

                        Wali Kelas / Pembimbing

                    </div>

                </div>


                <div class="footer">

                    <span>
                        Dokumen dibuat menggunakan AbsensiKu
                    </span>

                    <span>
                        Rekap Absensi
                    </span>

                </div>


                <script>

                    window.onload = function() {

                        setTimeout(
                            function() {
                                window.print();
                            },
                            300
                        );

                    };

                <\/script>

            </body>

            </html>
        `);


        jendela.document.close();
    });


// ======================================================
// MULAI APLIKASI
// ======================================================

cekSession();

// ======================================================
// MULAI APLIKASI
// ======================================================

cekSession();