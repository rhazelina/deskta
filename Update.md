# Update - 2026-02-05

## Changes
- Menambahkan sistem popup custom (alert/confirm/prompt) tanpa library dan memasangnya secara global lewat `PopupProvider`.
- Mengganti semua `window.alert` dan `window.confirm` di halaman Admin, Guru, Siswa, Wali Kelas, dan Waka Staff menjadi popup custom (`usePopup`).
- Menyesuaikan handler terkait menjadi `async` agar bisa `await` popup.
- Mengupdate catatan backup agar tidak lagi memakai `alert` bawaan.

## Notes
- Popup custom dibangun di `src/component/Shared/Popup/PopupProvider.tsx` dan memakai `Modal` yang sudah ada.

## Files [UPDATE POPUP]
- `src/component/Shared/Popup/PopupProvider.tsx`
- `src/App.tsx`
- `src/Pages/WaliKelas/RekapKehadiranSiswa.tsx`
- `src/Pages/WaliKelas/KehadiranSiswaWakel.tsx`
- `src/Pages/WaliKelas/InputAbsenWalikelas.tsx`
- `src/Pages/WaliKelas/DashboardWalliKelas.tsx`
- `src/Pages/WakaStaff/DetailSiswaStaff.tsx`
- `src/Pages/WakaStaff/DashboardStaff.tsx`
- `src/Pages/Siswa/DashboardSiswa.tsx`
- `src/Pages/Admin/SiswaAdmin.tsx`
- `src/Pages/Admin/KelasAdmin.tsx`
- `src/Pages/Admin/JurusanAdmin.tsx`
- `src/Pages/Guru/InputManualGuru.tsx`
- `src/Pages/Admin/GuruAdmin.tsx`
- `src/Pages/Guru/GuruDashboard.tsx`
- `src/Pages/Admin/DetailGuru.tsx`
- `src/Pages/Admin/DetailSiswa.tsx`
- `src/component/Shared/Form/MetodeGuru.tsx`
- `src/Pages/Guru/backup.md`
