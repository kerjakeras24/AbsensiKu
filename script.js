// =========================================
// ABSENSIKU + SUPABASE
// =========================================


// =========================================
// KONFIGURASI SUPABASE
// =========================================

const SUPABASE_URL =
    "https://fmgemouvabopxagtuuje.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_uv-BWSOCGWvlh4NJRwSRCA_l-aILwuH";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================================
// ID DATA YANG SEDANG DIEDIT
// =========================================

let idSedangDiedit = null;


// =========================================
// OTOMATIS MENENTUKAN HARI
// =========================================

document
    .getElementById("tanggal")
    .addEventListener("change", function () {

        const tanggal = this.value;

        const inputHari =
            document.getElementById("hari");


        if (tanggal === "") {

            inputHari.value = "";

            return;
        }


        const tanggalDipilih =
            new Date(tanggal + "T00:00:00");


        const namaHari = [

            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu"

        ];


        const hari =
            namaHari[tanggalDipilih.getDay()];


        inputHari.value = hari;

    });


// =========================================
// FORMAT TANGGAL
// =========================================

function formatTanggal(tanggal) {

    const tanggalObj =
        new Date(tanggal + "T00:00:00");


    const namaBulan = [

        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"

    ];


    return (
        tanggalObj.getDate() +
        " " +
        namaBulan[tanggalObj.getMonth()] +
        " " +
        tanggalObj.getFullYear()
    );
}


// =========================================
// MEMUAT DATA DARI SUPABASE
// =========================================

async function muatAbsensi() {

    const daftar =
        document.getElementById("daftarAbsensi");


    daftar.innerHTML = `

        <p class="kosong">
            ⏳ Memuat data absensi...
        </p>

    `;


    const {
        data,
        error
    } = await supabaseClient
        .from("absensi")
        .select(
            "id, hari, tanggal, nama, keterangan, created_at"
        )
        .order(
            "tanggal",
            {
                ascending: false
            }
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Gagal mengambil data:",
            error
        );


        daftar.innerHTML = `

            <p class="kosong">
                ❌ Gagal memuat data absensi.
                <br><br>
                Periksa koneksi Supabase dan policy tabel.
            </p>

        `;

        return;
    }


    tampilkanAbsensi(data);

}


// =========================================
// MENAMPILKAN DATA
// =========================================

function tampilkanAbsensi(dataAbsensi) {

    const daftar =
        document.getElementById("daftarAbsensi");


    daftar.innerHTML = "";


    if (
        !dataAbsensi ||
        dataAbsensi.length === 0
    ) {

        daftar.innerHTML = `

            <p class="kosong">
                Belum ada data absensi.
            </p>

        `;

        return;
    }


    dataAbsensi.forEach(
        function (data) {

            // ==============================
            // CARD
            // ==============================

            const div =
                document.createElement("div");


            div.className =
                "data-absensi";


            // ==============================
            // NAMA
            // ==============================

            const nama =
                document.createElement("h3");


            nama.textContent =
                "👤 " + data.nama;


            div.appendChild(nama);


            // ==============================
            // TANGGAL
            // ==============================

            const tanggal =
                document.createElement("p");


            tanggal.className =
                "tanggal";


            tanggal.textContent =
                "📅 " +
                data.hari +
                ", " +
                formatTanggal(data.tanggal);


            div.appendChild(tanggal);


            // ==============================
            // BADGE
            // ==============================

            const badge =
                document.createElement("span");


            badge.className =
                "badge";


            if (
                data.keterangan === "Alfa"
            ) {

                badge.classList.add(
                    "badge-alfa"
                );

            } else if (
                data.keterangan === "Izin"
            ) {

                badge.classList.add(
                    "badge-izin"
                );

            } else {

                badge.classList.add(
                    "badge-sakit"
                );

            }


            badge.textContent =
                data.keterangan;


            div.appendChild(badge);


            // ==============================
            // TOMBOL
            // ==============================

            const tombolData =
                document.createElement("div");


            tombolData.className =
                "tombol-data";


            // ==============================
            // TOMBOL EDIT
            // ==============================

            const tombolEdit =
                document.createElement("button");


            tombolEdit.className =
                "tombol-edit";


            tombolEdit.textContent =
                "✏️ Edit";


            tombolEdit.onclick =
                function () {

                    mulaiEdit(data);

                };


            tombolData.appendChild(
                tombolEdit
            );


            // ==============================
            // TOMBOL HAPUS
            // ==============================

            const tombolHapus =
                document.createElement("button");


            tombolHapus.className =
                "tombol-hapus";


            tombolHapus.textContent =
                "🗑️ Hapus";


            tombolHapus.onclick =
                function () {

                    hapusAbsensi(data.id);

                };


            tombolData.appendChild(
                tombolHapus
            );


            div.appendChild(
                tombolData
            );


            daftar.appendChild(div);

        }
    );

}


// =========================================
// TAMBAH / EDIT ABSENSI
// =========================================

async function tambahAbsensi() {

    const hari =
        document.getElementById("hari").value;


    const tanggal =
        document.getElementById("tanggal").value;


    const nama =
        document
            .getElementById("nama")
            .value
            .trim();


    const keterangan =
        document
            .getElementById("keterangan")
            .value;


    // =====================================
    // VALIDASI
    // =====================================

    if (tanggal === "") {

        alert(
            "Silakan pilih tanggal!"
        );

        return;
    }


    if (nama === "") {

        alert(
            "Nama siswa harus diisi!"
        );

        return;
    }


    if (hari === "") {

        alert(
            "Hari belum terbaca. Silakan pilih tanggal lagi!"
        );

        return;
    }


    // =====================================
    // JIKA SEDANG EDIT
    // =====================================

    if (idSedangDiedit !== null) {

        const {
            error
        } = await supabaseClient
            .from("absensi")
            .update({

                hari: hari,

                tanggal: tanggal,

                nama: nama,

                keterangan: keterangan

            })
            .eq(
                "id",
                idSedangDiedit
            );


        if (error) {

            console.error(
                "Gagal mengubah data:",
                error
            );


            alert(
                "❌ Gagal mengubah data absensi."
            );

            return;
        }


        alert(
            "✅ Data absensi berhasil diubah!"
        );


        batalEdit();


        await muatAbsensi();


        return;
    }


    // =====================================
    // TAMBAH DATA BARU
    // =====================================

    const {
        error
    } = await supabaseClient
        .from("absensi")
        .insert({

            hari: hari,

            tanggal: tanggal,

            nama: nama,

            keterangan: keterangan

        });


    if (error) {

        console.error(
            "Gagal menambah data:",
            error
        );


        alert(
            "❌ Gagal menyimpan data absensi."
        );

        return;
    }


    alert(
        "✅ Absensi berhasil ditambahkan!"
    );


    // =====================================
    // RESET FORM
    // =====================================

    document.getElementById(
        "hari"
    ).value = "";


    document.getElementById(
        "tanggal"
    ).value = "";


    document.getElementById(
        "nama"
    ).value = "";


    document.getElementById(
        "keterangan"
    ).value = "Alfa";


    // =====================================
    // MUAT ULANG DATA
    // =====================================

    await muatAbsensi();

}


// =========================================
// MULAI EDIT
// =========================================

function mulaiEdit(data) {

    idSedangDiedit =
        data.id;


    document.getElementById(
        "hari"
    ).value =
        data.hari;


    document.getElementById(
        "tanggal"
    ).value =
        data.tanggal;


    document.getElementById(
        "nama"
    ).value =
        data.nama;


    document.getElementById(
        "keterangan"
    ).value =
        data.keterangan;


    document.getElementById(
        "tombolSimpan"
    ).textContent =
        "💾 Simpan Perubahan";


    document.getElementById(
        "tombolBatal"
    ).style.display =
        "block";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =========================================
// BATAL EDIT
// =========================================

function batalEdit() {

    idSedangDiedit = null;


    document.getElementById(
        "hari"
    ).value = "";


    document.getElementById(
        "tanggal"
    ).value = "";


    document.getElementById(
        "nama"
    ).value = "";


    document.getElementById(
        "keterangan"
    ).value =
        "Alfa";


    document.getElementById(
        "tombolSimpan"
    ).textContent =
        "➕ Tambah Absensi";


    document.getElementById(
        "tombolBatal"
    ).style.display =
        "none";

}


// =========================================
// HAPUS ABSENSI
// =========================================

async function hapusAbsensi(id) {

    const yakin =
        confirm(
            "Yakin ingin menghapus data absensi ini?"
        );


    if (!yakin) {

        return;

    }


    const {
        error
    } = await supabaseClient
        .from("absensi")
        .delete()
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "Gagal menghapus data:",
            error
        );


        alert(
            "❌ Gagal menghapus data absensi."
        );

        return;
    }


    alert(
        "🗑️ Data absensi berhasil dihapus!"
    );


    await muatAbsensi();

}


// =========================================
// JALANKAN SAAT WEBSITE DIBUKA
// =========================================

muatAbsensi();