# Hata ve Çözüm Hafızası (docs/solutions.md)

Bu dosya; geliştirme sürecinde karşılaşılan tekrarlama riski yüksek kritik hataları, araştırılan kök nedenleri, işe yaramayan denemeleri ve doğrulanmış kesin çözümleri kayıt altına alır.

---

## Çözüm Kayıt Şablonu

```markdown
### [BUG-XXX] Sorun Başlığı
- **Belirti ve Ortaya Çıktığı Koşul:** Hatanın gözlemlendiği ortam, hata mesajı ve tetikleyen eylem.
- **Kök Neden:** Hatanın kaynağı (Doğrulanmadıysa açıkça belirtilmelidir).
- **İşe Yaramayan Denemeler:** Denenip sonuç vermeyen yöntemler ve nedenleri (Zaman kaybını önlemek için).
- **Uygulanan Çözüm:** Başarılı olan kesin çözüm adımları ve kod değişiklikleri.
- **Doğrulama Yöntemi:** Çözümün çalıştığının nasıl test edildiği (Komut, test veya manuel kontrol).
- **İlgili Dosya, Görev veya Commit:** Görev bağlantısı ([TASK-XXX](tasks.md)), dosya yolları veya commit hash.
```

---

## Kayıtlı Çözümler

### [BUG-001] Sidecar Stdin Yazılamadı: Broken Pipe (os error 32)
- **Belirti ve Ortaya Çıktığı Koşul:** Step 5'te "Render ve Dışa Aktar" butonuna tıklandığında Tauri arayüzünde `"Render motoru hatası: Sidecar stdin yazılamadı: Broken pipe (os error 32)"` hatası belirmesi.
- **Kök Neden:** Tauri uygulaması geliştirme modunda (`cargo run` / `npm run tauri dev`) başlatıldığında geçerli çalışma dizini (CWD) `src-tauri` olmaktadır. `src-tauri/src/lib.rs` içindeki `Command::new(".venv/bin/python3").arg("sidecar/main.py")` çağrısı, `.venv` ve `sidecar` dizinlerini `src-tauri` altında aramakta ve bulamadığı için Python süreci daha başlarken anında exit etmekteydi. Rust tarafında alt sürecin kapandığı fark edilmeden stdin pipe'ına JSON yazılmak istendiğinde işletim sistemi `SIGPIPE` (`Broken pipe / os error 32`) fırlatmaktaydı.
- **İşe Yaramayan Denemeler:** Stdin'e yazmadan önce bekleme eklemek (süreç bulunamadığı için yine kapanmaktaydı).
- **Uygulanan Çözüm:**
  1. `src-tauri/src/lib.rs` içinde dinamik proje kökü tespiti eklendi: Eğer `sidecar/main.py` mevcut dizinde yoksa `..` dizinine bakılarak mutlak `project_root` belirlendi.
  2. `Command`'e açıkça `.current_dir(&project_root)` parametresi verildi.
  3. Python binary yolu `project_root.join(".venv/bin/python3")` olarak mutlaklaştırıldı.
  4. Child sürecin stdin yazma hatasında ve başarısız çıkışında `stderr` akışı okunarak Python'ın gerçek hata mesajının kullanıcıya dönmesi sağlandı.
  5. `sidecar/main.py` içine `resolve_video_path` eklenerek göreceli dosya yollarının her koşulda bulunabilmesi sağlandı.
- **Doğrulama Yöntemi:** `sidecar/main.py` ve `src-tauri/src/lib.rs` üzerinde mutlak yol denetimleri yapıldı, `npm run build` ile entegrasyon doğrulandı.
- **İlgili Dosya, Görev veya Commit:** `src-tauri/src/lib.rs`, `sidecar/main.py`, [TASK-005](tasks.md).
