# 🤖 Discord Bot V14 — Slash Komutlu Altyapı

**Discord.js v14** ile yazılmış, sade ve genişletilebilir bir Discord bot altyapısı. Slash komutlar, isteğe bağlı MongoDB ve ses kanalı desteğiyle kullanıma hazır.

![Node](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Özellikler

- **Slash komutlar** — Discord’un güncel slash komut yapısı
- **Temiz altyapı** — `commands/` klasörüne dosya ekleyerek yeni komutlar
- **MongoDB (isteğe bağlı)** — Veritabanı kullanmak istersen `config.json` içine bağlantı eklemen yeterli
- **Ses kanalı (isteğe bağlı)** — Botun giriş yapacağı bir ses kanalı ID’si tanımlanabilir

---

## 📁 Proje Yapısı

```
Discord-Bot-V14/
├── commands/           # Slash komutlar (her dosya = bir komut)
│   └── ping.js
├── config.json         # Token, clientId, status, voice, mongokey
├── deploy-commands.js  # Slash komutları Discord'a kaydeder
├── index.js            # Bot giriş noktası
└── package.json
```

---

## 🚀 Kurulum

### 1. Gereksinimler

- **Node.js** 18 veya üzeri
- Discord’da bir [uygulama](https://discord.com/developers/applications) ve bot token’ı

### 2. Bağımlılıkları yükle

```bash
npm install
```

### 3. Ayarları yap

`config.json` dosyasını düzenle:

| Alan       | Açıklama |
|-----------|----------|
| `token`   | Discord bot token’ın |
| `clientId`| Uygulama (Application) ID’si |
| `status`  | Botun “Playing …” yazısı (örn: `b1long`) |
| `voice`   | *(İsteğe bağlı)* Botun gireceği ses kanalı ID’si. Boş bırakılırsa ses kullanılmaz. |
| `mongokey`| *(İsteğe bağlı)* MongoDB bağlantı URI’si. Boş bırakılırsa MongoDB kullanılmaz. |

### 4. Slash komutları kaydet

İlk kez veya yeni komut ekledikten sonra:

```bash
npm run deploy
```

### 5. Botu çalıştır

```bash
npm start
```

---

## 📝 Yeni Slash Komut Ekleme

`commands/` klasörüne yeni bir `.js` dosyası ekle. Örnek yapı:

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('komutadi')
    .setDescription('Komutun kısa açıklaması.'),
  async execute(interaction) {
    await interaction.reply({ content: 'Merhaba!', ephemeral: true });
  },
};
```

Sonra komutları tekrar kaydet ve botu yeniden başlat:

```bash
npm run deploy
npm start
```

---

## 📜 Lisans

MIT — detaylar için `LICENSE` dosyasına bakabilirsin.

---

*Discord.js v14 ile geliştirilmiş temiz bir altyapı. İyi kullanımlar!*



