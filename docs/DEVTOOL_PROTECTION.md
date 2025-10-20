# DevTool Koruma - disable-devtool Paketi ile

Bu proje, e-kitap okuyucuda developer tools erişimini engellemek için **[disable-devtool](https://github.com/theajack/disable-devtool)** paketini kullanır.

## 📦 Paket Hakkında

`disable-devtool`, tarayıcı developer tools'unu devre dışı bırakmak için özel olarak geliştirilmiş, kapsamlı ve güçlü bir JavaScript kütüphanesidir.

### ✨ Özellikler

- ✅ **Tüm açma yöntemlerini destekler**: Sağ tık menü, F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, vb.
- ✅ **Hızlı ve sürekli algılama**: DevTools açıldığında anında tespit eder
- ✅ **Çoklu tarayıcı desteği**: Chrome, Edge, Firefox, Safari, Opera, IE11
- ✅ **Çoklu platform**: Windows, Mac, Linux
- ✅ **Yüksek performans**: Minimal kaynak kullanımı
- ✅ **Kolay entegrasyon**: Basit API ve yapılandırma
- ✅ **İframe desteği**: iframe içindeki DevTools'u da algılar
- ✅ **Özelleştirilebilir**: Callback fonksiyonları ve yapılandırma seçenekleri

## 🚀 Kullanım

### Production Ortamı

Koruma varsayılan olarak **production ortamında otomatik olarak aktiftir**.

### Development Ortamında Test Etme

Development sırasında test etmek için `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_ENABLE_DEVTOOL_PROTECTION=true
```

Sonra development server'ı yeniden başlatın:

```bash
pnpm dev
```

## ⚙️ Yapılandırma

Koruma ayarlarını değiştirmek için `src/components/devtool-protection.tsx` dosyasını düzenleyin:

```typescript
disableDevtool({
  // Redirect to books page when devtools are detected
  url: "/books/local",

  // Interval for checking devtools (ms) - default: 200
  interval: 200,

  // Disable right-click context menu
  disableMenu: true,

  // Disable text selection
  disableSelect: false,

  // Disable copy
  disableCopy: false,

  // Disable cut
  disableCut: false,

  // Disable paste
  disablePaste: false,

  // Clear console when devtools are opened
  clearLog: true,

  // Custom callback when devtools are detected
  ondevtoolopen: () => {
    console.clear();
    // Redirect to books page when DevTools is opened
    window.location.href = "/books/local";
  },

  // Clear intervals when detected
  clearIntervalWhenDevOpenTrigger: false,
});
```

### Yapılandırma Seçenekleri

| Seçenek                           | Tip                                   | Varsayılan       | Açıklama                                                                           |
| --------------------------------- | ------------------------------------- | ---------------- | ---------------------------------------------------------------------------------- |
| `md5`                             | string                                | -                | Bypass disabled için md5 değeri (detaylar için 3.2'ye bakın)                       |
| `url`                             | string                                | `"/books/local"` | DevTools tespit edildiğinde yönlendirilecek URL                                    |
| `tkName`                          | string                                | `"dd"`           | Bypass url parameter adı (varsayılan ddtk)                                         |
| `ondevtoolopen`                   | function(type, next)                  | -                | DevTools açıldığında çalışacak callback (type: tespit modu, next: pencereyi kapat) |
| `ondevtoolclose`                  | function                              | -                | DevTools kapandığında çalışacak callback                                           |
| `interval`                        | number                                | `200`            | DevTools kontrolü için interval (ms)                                               |
| `disableMenu`                     | boolean                               | `true`           | Sağ tık menüsünü engelle                                                           |
| `stopIntervalTime`                | number                                | -                | Mobilde izlemeyi iptal etmek için bekleme süresi                                   |
| `clearIntervalWhenDevOpenTrigger` | boolean                               | `false`          | Tespit sonrası interval'i temizle (ondevtoolclose kullanıldığında geçersiz)        |
| `detectors`                       | Array<DetectorType>                   | all              | Aktif detektörler (tüm detektörleri kullanmak önerilir)                            |
| `clearLog`                        | boolean                               | `true`           | DevTools açıldığında konsolu temizle                                               |
| `disableSelect`                   | boolean                               | `false`          | Metin seçimini engelle                                                             |
| `disableInputSelect`              | boolean                               | `false`          | Input elementlerinde metin seçimini engelle                                        |
| `disableCopy`                     | boolean                               | `false`          | Kopyalamayı engelle                                                                |
| `disableCut`                      | boolean                               | `false`          | Kesmeyi engelle                                                                    |
| `disablePaste`                    | boolean                               | `false`          | Yapıştırmayı engelle                                                               |
| `ignore`                          | (string\|RegExp)[]\|null\|()=>boolean | -                | Belirli durumlarda engellemeyi yoksay                                              |
| `disableIframeParents`            | boolean                               | `false`          | iframe içinde tüm parent pencerelerde devre dışı bırak                             |
| `timeOutUrl`                      | string                                | (auto)           | Sayfa timeout olduğunda yönlendirilecek URL                                        |
| `rewriteHTML`                     | string                                | -                | DevTools tespit edildikten sonra sayfayı yeniden yaz                               |

## 🎯 Nasıl Çalışır?

1. **Boyut Kontrolü**: Tarayıcı pencere boyutlarını kontrol ederek DevTools'un açık olup olmadığını tespit eder
2. **Debugger Tuzakları**: `debugger` statement'larını kullanarak DevTools açıldığında tespit eder
3. **Klavye Dinleyicileri**: F12, Ctrl+Shift+I gibi kısayolları engeller
4. **Context Menu Engelleme**: Sağ tık menüsünü devre dışı bırakır
5. **Sürekli İzleme**: Belirli aralıklarla DevTools'un açık olup olmadığını kontrol eder
6. **Otomatik Yönlendirme**: DevTools tespit edildiğinde kullanıcı `/books/local` sayfasına yönlendirilir

## 🔒 Güvenlik Notları

### ⚠️ Önemli Bilgiler

1. **Tam Engelleme İmkansız**: Hiçbir JavaScript çözümü DevTools'u %100 engelleyemez. Bu bir caydırıcı önlemdir.

2. **Deneyimli Kullanıcılar İçin**: Teknik bilgisi olan kullanıcılar:

   - Tarayıcıyı debug modunda başlatabilir
   - Network sekmesinden istekleri inceleyebilir
   - JavaScript'i devre dışı bırakabilir
   - Tarayıcı uzantıları kullanabilir

3. **Gerçek Güvenlik**: Asıl güvenlik önlemleri şunlardır:
   - ✅ Sunucu taraflı doğrulama
   - ✅ API authentication ve authorization
   - ✅ Rate limiting
   - ✅ Data encryption
   - ✅ Content Security Policy (CSP)
   - ✅ HTTPS kullanımı

### 📊 DevTool Koruması Ne İçin Uygundur?

✅ **Uygun Kullanım Senaryoları:**

- İçerik koruma (e-kitap, video, vb.)
- Casual kullanıcıları caydırmak
- Veri scraping'i zorlaştırmak
- UI/UX'i korumak
- Lisans kontrolü

❌ **Yeterli Olmadığı Durumlar:**

- Hassas finansal veriler
- Kritik güvenlik gerektiren uygulamalar
- Backend güvenliği yerine geçmek
- Profesyonel hackerları engellemek

## 🧪 Test Etme

Reader sayfasında test edin:

1. Development server'ı başlatın ve `.env.local` dosyasında korumayı aktif edin
2. Bir kitap açın: http://localhost:3000/reader/[book-id]
3. Şunları test edin:

### ✓ Çalışması Gerekenler:

- [ ] Sağ tık çalışmıyor
- [ ] F12 tuşu çalışmıyor
- [ ] Ctrl+Shift+I çalışmıyor
- [ ] Ctrl+Shift+J çalışmıyor
- [ ] Ctrl+U çalışmıyor

### ✓ DevTools Zaten Açıksa:

- [ ] Sayfa yüklendiğinde konsol temizleniyor
- [ ] Belirli aralıklarla konsol tekrar temizleniyor

## 🛠️ Troubleshooting

### "Development'ta çalışmıyor"

`.env.local` dosyasını kontrol edin:

```env
NEXT_PUBLIC_ENABLE_DEVTOOL_PROTECTION=true
```

Server'ı yeniden başlatın:

```bash
pnpm dev
```

### "DevTools'u meşru amaçlarla açmam lazım"

Development'ta korumayı devre dışı bırakın:

```env
# .env.local
NEXT_PUBLIC_ENABLE_DEVTOOL_PROTECTION=false
```

veya dosyayı tamamen silin.

### "Performans sorunları yaşıyorum"

`interval` değerini artırın (örn: 500ms):

```typescript
disableDevtool({
  interval: 500, // Daha az sıklıkta kontrol et
  // ...
});
```

### "Hata alıyorum"

1. Paket doğru yüklü mü kontrol edin:

```bash
pnpm list disable-devtool
```

2. Type definition'ları kontrol edin
3. Browser console'da hata mesajlarını inceleyin

## 📚 Ek Kaynaklar

- **GitHub Repository**: https://github.com/theajack/disable-devtool
- **NPM Package**: https://www.npmjs.com/package/disable-devtool
- **Demo**: https://theajack.github.io/disable-devtool/

## 🔄 Güncelleme

Paketi güncellemek için:

```bash
pnpm update disable-devtool
```

## 📝 Lisans Bilgisi

`disable-devtool` paketi MIT lisansı ile lisanslanmıştır.

## 🎓 Best Practices

1. **Sadece Reader Sayfasında Kullanın**: Tüm sitede kullanmayın, sadece korunması gereken sayfalarda aktif edin
2. **Kullanıcı Deneyimini Düşünün**: Aşırı kısıtlayıcı olmayın
3. **Backend Güvenliğine Güvenin**: Bu bir ek katmandır, ana güvenlik backend'de olmalı
4. **Performansı İzleyin**: `interval` değerini optimize edin
5. **Log'ları Kontrol Edin**: Production'da console log'ları kontrol edin
6. **A/B Test Yapın**: Kullanıcı tepkilerini ölçün
