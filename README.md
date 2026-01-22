# Task Approval System 🚀

Profesyonel, rol tabanlı ve modern bir Talep Onay Sistemi. Bu proje, monorepo mimarisi (TurboRepo), merkezi çevre değişkenleri ve Docker desteği ile "tak-çalıştır" (plug-and-play) olarak tasarlanmıştır.

## 🛠️ Hızlı Kurulum

Projeyi ayağa kaldırmak için tek ihtiyacınız **Docker**. Herhangi bir `.env` ayarı yapmanıza gerek yoktur, gerekli tüm ayarlar repoya dahildir.

```bash
# Projeyi başlatın
docker compose up

# Sistem hazır!
# Admin Paneli: http://localhost:3001
# Kullanıcı Paneli: http://localhost:3000
# API: http://localhost:4000
```

---

## ✨ Temel Özellikler

### 🔐 Rol Tabanlı Erişim (RBAC)
- **Admin**: Tüm kullanıcıları ve talepleri yönetebilir.
- **Moderator**: Talepleri onaylayabilir/reddedebilir ve kullanıcı listesini görebilir.
- **Viewer**: Sadece talepleri ve detayları görüntüleyebilir (İşlem yetkisi yoktur).
- **User**: Kendi taleplerini oluşturabilir ve durumlarını takip edebilir.

### 🏢 Gelişmiş Paneller
- **Merkezi Dashboard**: Bugünün onay/red istatistikleri ve öncelik dağılımı grafikleri.
- **Talep Yönetimi**: Başlık veya talep sahibine göre arama, öncelik ve duruma göre filtreleme.
- **Detay Görünümü**: Taleplerin tüm detaylarını (açıklama, işlem tarihi vb.) gösteren şık modal.
- **Kullanıcı Yönetimi**: Adminler için kullanıcı oluşturma ve düzenleme (Ad, E-posta, Rol, Şifre).

### 🌍 Teknik Detaylar
- **Monorepo**: TurboRepo ile yönetilen ölçeklenebilir yapı.
- **UI/UX**: Mantine UI ile modern, karanlık mod destekli ve premium tasarım.
- **i18n**: Tam Türkçe ve İngilizce dil desteği.
- **Database**: Prisma ORM ve PostgreSQL (Docker üzerinde hazır gelir).
- **Security**: JWT tabanlı kimlik doğrulama ve Route korumaları.

---

## 🔑 Test Kullanıcıları

| Rol | E-posta | Şifre |
| :--- | :--- | :--- |
| **Admin** | admin@test.com | admin123 |
| **Moderator** | moderator@test.com | mod123 |
| **Viewer** | viewer@test.com | viewer123 |
| **User** | user1@test.com | 123456 |

---
*Bu proje, teknik gereksinimlerin tamamını karşılayacak şekilde profesyonel standartlarda geliştirilmiştir.*
