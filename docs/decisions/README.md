# Mimari Karar Kayıtları (Architecture Decision Records - ADR)

Bu dizin, projede alınan kritik teknik ve mimari kararların tarihçesini, gerekçelerini ve ödünleşimlerini (trade-offs) saklar.

---

## Karar Kayıt Formatı

Yeni bir karar alınırken bu dizinde sıradaki numara ile bir markdown dosyası oluşturulur:
Örnek: `0001-kisa-karar-basligi.md`

Her ADR aşağıdaki şablonu takip etmelidir:

```markdown
# [ADR-0001] Kısa Karar Başlığı

- **Tarih:** YYYY-AA-GG
- **Durum:** Önerildi / Kabul edildi / Yerine yeni karar alındı

## Bağlam ve Problem
Kararın alınmasını gerektiren teknik ihtiyaç, kısıt veya problem nedir?

## Değerlendirilen Seçenekler
1. **Seçenek A:** Açıklama, artıları ve eksileri.
2. **Seçenek B:** Açıklama, artıları ve eksileri.

## Seçilen Yaklaşım ve Gerekçe
Hangi seçenek neden tercih edildi? Hangi faktör belirleyici oldu?

## Sonuçlar ve Ödünleşimler
- **Olumlu Sonuçlar:** Sağlanan faydalar.
- **Ödünleşimler (Trade-offs) / Riskler:** Kabul edilen olumsuz yönler veya getirdiği ek yük.

## İlgili Kararlar
- Varsa yerine geçtiği önceki karar: [ADR-XXXX](dosya-yolu)
- Varsa bu kararın yerine geçen sonraki karar: [ADR-YYYY](dosya-yolu)
```

---

## Mevcut Karar Kayıtları

*Henüz alınmış bir mimari karar kaydı bulunmamaktadır. Proje teknolojisi veya altyapı tercihleri kesinleştiğinde ilk ADR (0001-...) eklenecektir.*
