# AGENTS.md - Ortak Çalışma Kuralları ve Hafıza Protokolü

Bu belge; farklı AI geliştirme araçları (Antigravity, Claude Code, Cursor, Copilot vb.) ve oturumlar (session'lar) arasında bağlamın korunması, tutarlı çalışılması ve proje hafızasının yönetilmesi için ortak protokolü tanımlar.

---

## 1. Hafıza Mimarisi ve Dosya Rolleri

| Dosya | Rol ve Sorumluluk |
| :--- | :--- |
| `brain.md` | **Anlık Durum ve Devralma Notu:** Son durum, aktif hedef, engeller, sonraki somut adım (~50-100 satır). |
| `AGENTS.md` | **Evrensel Protokol:** Tüm AI asistanlarının uyması gereken çalışma ve belgeleme kuralları. |
| `CLAUDE.md` | **Claude Code Giriş Noktası:** Claude Code aracına özel yapılandırma ve `@AGENTS.md` referansı. |
| `docs/architecture.md` | **Sistem Mimarisi:** Doğrulanmış teknoloji yığını, bileşenler, dizin yapısı, veri akışları. |
| `docs/tasks.md` | **Görev Takibi:** Standart formatta iş listesi, öncelikler, kabul kriterleri ve doğrulama durumları. |
| `docs/decisions/` | **Mimari Karar Kayıtları (ADR):** Kritik teknik kararların bağlamı, gerekçesi ve sonuçları. |
| `docs/solutions.md` | **Hata ve Çözüm Hafızası:** Karşılaşılan kritik sorunlar, kök nedenler ve doğrulanmış çözümler. |

---

## 2. Çalışma Protokolü

### A. Session Başlangıcı
1. **Durum Tespiti:** Proje kökündeki `brain.md` dosyasını oku.
2. **Ortam ve Git Kontrolü:** Varsa Git branch'ini, commit durumunu ve çalışma ağacındaki değişiklikleri kontrol et.
3. **Kapsam İncelemesi:** Yalnızca aktif görevle ilgili dosyaları ve ilgili hafıza belgelerini incele; tüm geçmiş kayıtları okuyarak bağlamı gereksiz doldurma.
4. **Doğrulama:** Hafıza belgelerinde iddia edilen mevcut durum ile gerçek kod/dosya durumunu karşılaştır.
5. **Çelişki Yönetimi:** Belge ile kod arasında çelişki varsa bunu açıkça not et. Amaçlanan davranışı sadece mevcut koddan çıkarma; kullanıcı gereksinimlerini ve kabul kriterlerini esas al.

### B. Çalışma Sırasında
1. **Kapsam Netliği:** Görevin kapsamını ve kabul kriterlerini doğrula.
2. **Bilgi Ayrımı:** *Varsayım*, *gözlem* ve *doğrulanmış sonucu* net bir şekilde birbirinden ayır.
3. **Kullanıcı Koduna Saygı:** Kullanıcının mevcut veya bekleyen değişikliklerini ezme ve koru.
4. **Minimal Müdahale:** Aktif görevle ilgisiz kodlarda refactoring ya da stil düzenlemesi yapma.
5. **Aşama Güncellemesi:** Anlamlı bir kilometre taşı (milestone) aşıldığında hafıza belgelerini güncelle.
6. **Karar Kayıtları:** Mimariyi veya yönü değiştiren önemli teknik kararları `docs/decisions/` altına ADR olarak kaydet.
7. **Sorun Hafızası:** Tekrarlama riski olan teknik sorunlarda; uygulanan çözümü ve işe yaramayan yöntemleri `docs/solutions.md` dosyasına işle.

### C. Görev Tamamlandığında
1. **Doğrulama Koşulu:** Değişiklikle ilgili test, derleme veya statik analiz kontrollerini çalıştır.
2. **Durum Ayrımı:** "Kodlandı", "Doğrulandı" ve "Yayına Alındı" durumlarını kesinlikle birbirine karıştırma.
3. **Hafıza Kapanışı:** `docs/tasks.md` ve `brain.md` dosyalarını güncelle.
4. **Sonraki Somut Adım:** Bir sonraki session için net bir sonraki adım bırak (incelenecek dosya, çalıştırılacak komut veya karar).
5. **Yetki Sınırı:** Hafıza güncellemesi veya görev bitimi; kullanıcı onayı olmadan kendiliğinden `git commit`, `git push` veya yayına alma (deployment) yetkisi vermez.

---

## 3. Hafıza Bakım Kuralları

- **Tek Gerçek Kaynak (Single Source of Truth):** Bir bilgi yalnızca ait olduğu ana dosyada tutulmalı, diğer yerlerden bu belgeye bağlantı verilmelidir.
- **`brain.md` Dosyasını Kompakt Tut:** Bu dosyayı konuşma dökümüne veya sonsuz bir günlüğe dönüştürme (50-100 satır aralığında tut). Eski durumları arşivle veya ilgili görev/ADR dosyasına taşı.
- **Karar Geçmişi:** Değişen bir mimari kararın eski kaydını silme; durumunu "Yerine yeni karar alındı" olarak güncelle ve yeni karara bağlantı ver.
- **Gizlilik ve Güvenlik:** Kesinlikle API anahtarı, şifre, token, veritabanı bağlantı dizesi veya kişisel veri hafıza dosyalarına yazılmamalıdır.
- **Dil ve Standart:** Açıklama ve belgeler Türkçe yazılmalı; kod sembolleri, komutlar, dosya adları ve teknik terimler olduğu gibi korunmalıdır.
- **Göreceli Yollar:** Dosya bağlantılarında proje köküne göre göreli yollar (`docs/...`, `brain.md` vb.) kullanılmalıdır.

---

## 4. Projeye Özgü Komutlar

*Not: Proje henüz boş dizin durumundadır. Komutlar proje geliştirildikçe doğrulanarak eklenecektir.*

- **Paket Yöneticisi / Kurulum:** Henüz belirlenmedi
- **Geliştirme / Dev Server:** Henüz belirlenmedi
- **Test Komutları:** Henüz belirlenmedi
- **Lint / Tip Kontrolü:** Henüz belirlenmedi
- **Derleme / Build:** Henüz belirlenmedi
