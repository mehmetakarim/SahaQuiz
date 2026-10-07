# CLAUDE.md - Claude Code Yapılandırması

Bu proje genelinde oturumlar arası bağlamın korunması ve ortak çalışma kuralları için ana protokol dosyası geçerlidir:
@AGENTS.md

---

## Claude Code İçin Hızlı Yönergeler

1. **Oturum Başlangıcı:**
   - İlk olarak `brain.md` dosyasını oku ve son durumu incele.
   - Doğrulanmış sistem yapısı ve teknoloji tercihleri için `docs/architecture.md` dosyasını referans al.
   - Aktif görev ve kabul kriterleri için `docs/tasks.md` dosyasını kontrol et.

2. **Geliştirme & Müdahale Sınırları:**
   - @AGENTS.md içinde belirtilen çalışma protokolünü ve hafıza bakım kurallarını uygula.
   - Proje kodlarında gereksiz/isteksiz değişiklik yapma; kullanıcının mevcut değişikliklerini koru.
   - Önemli aşamalarda veya görev tamamlandığında `brain.md` ve `docs/tasks.md` dosyalarını güncelle.
