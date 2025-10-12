# Nobel API Integration

Bu implementasyon, TSL E-Shelf uygulamasına Nobel Yayın API entegrasyonu ekler. Nobel kitapları için notlar, highlight'lar, bookmarklar ve okuma pozisyonu gibi veriler sunucu ile senkronize edilir.

## Nasıl Çalışır

### Nobel Kitap Tespiti

- Kitap ID'si URL'den çıkarılır (örn: `/books/94FoN1xy0lUZ5Cd`)
- `isNobelBook()` fonksiyonu ile Nobel kitabı olup olmadığı kontrol edilir
- Nobel kitapları için API client oluşturulur

### API Entegrasyonu

- **Kitap açıldığında**: Tüm Nobel verileri (notlar, highlight'lar, bookmarklar, pozisyon) sunucudan çekilir
- **Not eklendiğinde**: Local storage + Nobel API
- **Highlight eklendiğinde**: Local storage + Nobel API
- **Bookmark eklendiğinde**: Local storage + Nobel API
- **Pozisyon değiştiğinde**: Local storage + Nobel API

### API Routes

Aşağıdaki route'lar otomatik olarak çağrılır:

```
GET  /api/books/nobel/[id]/notes          - Notları getir
POST /api/books/nobel/[id]/notes          - Not ekle
GET  /api/books/nobel/[id]/highlights     - Highlight'ları getir
POST /api/books/nobel/[id]/highlights/add - Highlight ekle
GET  /api/books/nobel/[id]/bookmarks      - Bookmarkları getir
POST /api/books/nobel/[id]/bookmarks      - Bookmark ekle
GET  /api/books/nobel/[id]/location       - Pozisyonu getir
POST /api/books/nobel/[id]/location       - Pozisyonu güncelle
GET  /api/books/nobel/[id]/copy-protection - Kopyalama korumasını getir
```

## Test Örneği

Nobel kitabı ID'si: `94FoN1xy0lUZ5Cd`

1. Sayfayı aç: `/reader/94FoN1xy0lUZ5Cd`
2. Konsolu kontrol et - Nobel API call'ları görülecek
3. Text seç ve highlight ekle - API'ye kaydedilecek
4. Not ekle - API'ye kaydedilecek
5. Bookmark ekle - API'ye kaydedilecek
6. Sayfa değiştir - Pozisyon API'ye kaydedilecek

## Hata Yönetimi

- API hataları console'a loglanır ama uygulamayı durdurmaz
- Local storage her zaman çalışmaya devam eder
- Network olmadığında da uygulama çalışır

## Gelecek Geliştirmeler

- Offline/online senkronizasyon
- API response'larını daha detaylı integration
- Delete operasyonları
- Copy protection entegrasyonu
