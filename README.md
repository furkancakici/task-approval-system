# Task Approval System

Görev onay sistemi - Çalışanların görev talebi oluşturduğu ve yöneticilerin bu talepleri onayladığı/reddettiği full-stack uygulama.

## 🚀 Hızlı Başlangıç

### 1. Environment Kurulumu

Önce `.env` dosyasını oluşturun:

```bash
cp .env.example .env
```

Gerekirse `.env` dosyasındaki değerleri düzenleyin (varsayılan değerler çoğu durumda yeterlidir).

### 2. Geliştirme Modu (Hot Reload ile)

Kod değişikliklerinizi anında görmek için:

```bash
docker compose -f docker-compose.dev.yml up
```

**İlk çalıştırma 2-3 dakika sürebilir** (npm install çalışacak). Sonrasında kod değişiklikleriniz otomatik yansıyacak!

### Production Modu

Optimize edilmiş production build için:

```bash
docker compose up -d --build
```

## 📱 Uygulamaya Erişim

- **User Panel:** http://localhost:3000
- **Admin Panel:** http://localhost:3001
- **API:** http://localhost:4000
- **PostgreSQL:** localhost:5433

## 👤 Test Kullanıcıları

### User Panel
- Email: `user1@test.com` / Şifre: `123456`
- Email: `user2@test.com` / Şifre: `123456`

### Admin Panel
- Email: `admin@test.com` / Şifre: `admin123` (Admin)
- Email: `moderator@test.com` / Şifre: `mod123` (Moderator)
- Email: `viewer@test.com` / Şifre: `viewer123` (Viewer)

## 🛠️ Teknoloji Stack

### Frontend
- React 19 + TypeScript
- Redux Toolkit (State Management)
- Mantine UI (Component Library)
- Vite (Build Tool)
- React Router (Routing)

### Backend
- Express.js + TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

### DevOps
- Docker + Docker Compose
- Turborepo (Monorepo)
- Nginx (Production)

## 📁 Proje Yapısı

```
task-approval-system/
├── apps/
│   ├── api/              # Express API
│   ├── admin-panel/      # Admin Panel (React)
│   └── user-panel/       # User Panel (React)
├── packages/
│   ├── ui/               # Shared UI Components
│   ├── types/            # Shared TypeScript Types
│   ├── schema/           # Shared Zod Schemas
│   └── api-client/       # Shared Axios Client
├── docker-compose.yml        # Production
├── docker-compose.dev.yml    # Development (Hot Reload)
└── DEVELOPMENT.md            # Detaylı Geliştirme Kılavuzu
```

## 💡 Sık Kullanılan Komutlar

### Development

```bash
# Servisleri başlat (hot reload)
docker compose -f docker-compose.dev.yml up

# Belirli bir servisi yeniden başlat
docker compose -f docker-compose.dev.yml restart api

# Logları görüntüle
docker compose -f docker-compose.dev.yml logs -f

# Servisleri durdur
docker compose -f docker-compose.dev.yml down
```

### Production

```bash
# Build ve başlat
docker compose up -d --build

# Logları görüntüle
docker compose logs -f

# Servisleri durdur
docker compose down
```

### Database

```bash
# Migration çalıştır
docker exec -it task-approval-api-dev sh -c "cd apps/api && npx prisma migrate dev"

# Veritabanını seed et
docker exec -it task-approval-api-dev sh -c "cd apps/api && npm run seed"

# Veritabanını sıfırla
docker exec -it task-approval-api-dev sh -c "cd apps/api && npx prisma migrate reset"

# Veritabanını sıfırla
npx prisma db push --force-reset
```

## 📖 Özellikler

### 🌍 Uluslararasılaştırma (i18n) & UI
- ✅ **Tam i18n Desteği**: Uygulamanın tamamı Türkçe ve İngilizce dillerini destekler (Dashboard, Tablolar, Formlar, Bildirimler).
- ✅ **Dinamik Dil Geçişi**: Kullanıcı arayüzünde diller arası anlık geçiş yapılabilir.
- ✅ **Gelişmiş Tema**: Mantine UI ile modern karanlık mod (Dark Mode) desteği.
- ✅ **Zengin Görselleştirme**: 
    - Kategoriler için özel **Dot-Variant Badge** tasarımı.
    - Öncelik ve durumlar için renk kodlu badge'ler (Teal, Green, Red, Yellow, Orange, Blue, Grape).

### 📋 Görev Yönetimi (Task Management)
- ✅ **Dashboard**: Kullanıcı ve Admin bazlı istatistik özetleri.
- ✅ **Gelişmiş Filtreleme**: Görevleri başlık, durum, öncelik ve kategoriye göre filtreleme/arama.
- ✅ **Sayfalama (Pagination)**: Tüm tablolar sunucu taraflı (server-side) sayfalama desteğine sahiptir.
- ✅ **Görev Süreç Takibi**: Görevlerin oluşturulma ve onaylanma/reddedilme tarihlerinin (Processed At) takibi.
- ✅ **Geri Bildirim**: Reddedilen görevler için neden belirtme ve görüntüleme (Tooltip desteği).

### 👤 Kullanıcı ve Yetkilendirme
- ✅ **Rol Bazlı Yetkilendirme (RBAC)**:
    - **Admin**: Tam yetki, kullanıcı yönetimi, görev onaylama/reddetme.
    - **Moderator**: Görev onaylama/reddetme yetkisi.
    - **Viewer**: Sadece görüntüleme yetkisi.
    - **User (Employee)**: Görev oluşturma ve kendi görevlerini takip etme.
- ✅ **Kullanıcı Yönetimi**: Adminler için yeni çalışan ekleme (localized role selection) ve yönetme.
- ✅ **Otomatik Doğrulama**: Zod ve Shared Schema ile hem frontend hem de backend tarafında güçlü veri doğrulama ve i18n hata mesajları.

## 🔧 Sorun Giderme

**Veritabanı bağlantı hatası?**
Veritabanı konteynerının sağlıklı olduğundan emin olun: `docker ps`. Eğer port çakışması varsa `.env` dosyasındaki `5433` portunu kontrol edin.

**Şema değişiklikleri yansımıyor?**
`npx prisma generate` ve `npx prisma db push` komutlarını `apps/api` dizininde çalıştırın.

**Hot reload çalışmıyor?**
```bash
docker compose -f docker-compose.dev.yml restart user-panel
```

**Port zaten kullanımda?**
```bash
lsof -ti:3000 | xargs kill -9 # Mac/Linux için
```

**Bağımlılıklar güncel değil?**
```bash
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up
```

