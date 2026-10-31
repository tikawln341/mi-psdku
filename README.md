E-Commerce Microservices

1. Deskripsi Proyek

Proyek ini merupakan aplikasi E-Commerce berbasis arsitektur Microservices yang terdiri dari beberapa layanan dengan tanggung jawab berbeda. Setiap service berjalan secara terpisah dan saling berkomunikasi melalui REST API.

Proyek ini terdiri dari:

- Product Service: Mengelola data produk.
- Cart Service: Mengelola keranjang belanja pengguna.
- Review Service: Mengelola ulasan produk.
- Order Service: Mengelola proses checkout, pembuatan pesanan, melihat pesanan, dan pembayaran.

2. Arsitektur Sistem

Setiap service menggunakan database masing-masing dan dijalankan menggunakan Docker Compose.

Service | Teknologi | Port | Database
Product Service | Node.js / Express | 3000 | MySQL
Cart Service | Laravel | 3001 | PostgreSQL
Review Service | Python / Flask | 3002 | MongoDB
Order Service | Laravel | 3003 | MySQL

Order Service berkomunikasi dengan:

- Product Service melalui http://product-service:3000.
- Cart Service melalui http://cart-service:3001.

Komunikasi antarservice dilakukan melalui jaringan internal Docker.

3. Persyaratan Sistem

Sebelum menjalankan proyek, pastikan perangkat telah memiliki:

- Docker Desktop
- Docker Compose
- Git
- Insomnia atau aplikasi pengujian REST API lainnya

4. Cara Menjalankan Proyek

4.1 Clone Repository

```bash
git clone https://github.com/tikawln341/mi-psdku.git
cd mi-psdku
```

4.2 Menjalankan Seluruh Service

```bash
docker compose up --build -d
```

4.3 Memeriksa Status Container

```bash
docker compose ps
```

Pastikan seluruh service berjalan dan database menunjukkan status healthy.

4.4 Menghentikan Seluruh Service

```bash
docker compose down
```

Perintah tersebut tidak menggunakan opsi -v, sehingga volume database tidak ikut dihapus.

5. Order Service

Order Service merupakan layanan yang menangani proses pemesanan produk. Saat checkout, layanan ini mengambil data keranjang dari Cart Service, memeriksa informasi produk melalui Product Service, menghitung total pesanan, lalu menyimpan pesanan ke database.

Base URL:

http://localhost:3003

5.1 Daftar Endpoint

Method | Endpoint | Fungsi
GET | /health | Memeriksa kesehatan service
POST | /api/orders | Membuat pesanan melalui checkout
GET | /api/orders/{id} | Melihat detail pesanan
GET | /api/orders/user/{userId} | Melihat daftar pesanan pengguna
PATCH | /api/orders/{id}/pay | Mengubah status pesanan menjadi PAID

5.2 Contoh Request Checkout

Method: POST

URL: http://localhost:3003/api/orders

Content-Type: application/json

Request Body:

```json
{
  "user_id": 1
}
```

Checkout menggunakan keranjang pengguna yang tersimpan di Cart Service.

5.3 Contoh Melihat Detail Pesanan

Method: GET

http://localhost:3003/api/orders/1

5.4 Contoh Melihat Pesanan Pengguna

Method: GET

http://localhost:3003/api/orders/user/1

5.5 Contoh Pembayaran

Method: PATCH

http://localhost:3003/api/orders/1/pay

6. Environment Variables

Berikut konfigurasi utama yang digunakan oleh Order Service:

Variable | Keterangan
APP_NAME | Nama aplikasi
APP_ENV | Lingkungan aplikasi
APP_KEY | Kunci aplikasi Laravel
APP_DEBUG | Mode debug
APP_URL | Alamat Order Service
DB_CONNECTION | Jenis database
DB_HOST | Host database
DB_PORT | Port database
DB_DATABASE | Nama database
DB_USERNAME | Username database
DB_PASSWORD | Password database
PRODUCT_SERVICE_URL | Alamat Product Service
CART_SERVICE_URL | Alamat Cart Service

Konfigurasi lokal dan Docker tersedia melalui file .env.example dan docker-compose.yml.

7. Penanganan Error

Order Service menangani beberapa kondisi kesalahan, antara lain:

- Keranjang kosong.
- Produk tidak ditemukan.
- Stok produk tidak mencukupi.
- Cart Service tidak dapat dihubungi.
- Product Service tidak dapat dihubungi.
- Pesanan tidak ditemukan.
- Pesanan yang sudah dibayar tidak dapat dibayar kembali.
- Input pengguna tidak valid.

8. Keputusan Desain dan Keterbatasan

- Setiap service memiliki database masing-masing.
- Komunikasi antarservice dilakukan melalui REST API.
- Docker Compose digunakan untuk menjalankan seluruh service.
- Perhitungan nilai uang menggunakan integer cents untuk menghindari masalah pembulatan floating point.
- Data nama dan harga produk disimpan sebagai snapshot pada item pesanan agar informasi pesanan tetap konsisten ketika data produk berubah.
- Status pembayaran yang digunakan adalah PENDING dan PAID.
- Proses pembayaran pada proyek ini merupakan simulasi perubahan status, bukan integrasi payment gateway.
- Kredensial dalam konfigurasi Docker ditujukan untuk lingkungan lokal dan demonstrasi, bukan produksi.

9. Demo Video

Link Video Demo: Akan ditambahkan setelah proses perekaman selesai.

Durasi: 8–12 menit.

Timestamp: Akan dilengkapi setelah video diunggah.

10. Repository

GitHub Repository:

https://github.com/tikawln341/mi-psdku