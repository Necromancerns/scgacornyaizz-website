/* { PEMANGGILAN MODULE } */

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const settings = require('./settings');
const { registerFeatures } = require('./sampah/domisilimana');
const TelegramBot = require('node-telegram-bot-api');
const { exec } = require("child_process");
const { xnxxSearch, xnxxDownload } = require('@mr.janiya/xnxx-scraper');
const xnxx = require('xnxx-scraper');
const os = require('os');
const axios = require('axios');
const yts = require("yt-search");
const puppeteer = require("puppeteer");
const pino = require("pino");
const path = require("path");
const cheerio = require("cheerio");
const fs = require('fs');
const PDFDocument = require("pdfkit");
const FormData = require('form-data');
const { URLSearchParams } = require("url");
const crypto = require("crypto");
const botToken = global.token
const owner = global.adminId
const adminfile = 'adminID.json';
const premiumUsersFile = 'premiumUsers.json';
const prefix = '[\\/\\.\\~\\$\\>]';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

try {
    premiumUsers = JSON.parse(fs.readFileSync(premiumUsersFile));
} catch (error) {
    console.error('Error reading premiumUsers file:', error);
}
try {
    adminUsers = JSON.parse(fs.readFileSync(adminfile));
} catch (error) {
    console.error('Error reading adminUsers file:', error);
}

/* { PEMANGGILAN MODULE } */ 

/* { SAVE DATABASE } */
const PENDINGDL_STORE = path.join(__dirname, 'pendingDownload.json');
let pendingXnxx = {};
if (fs.existsSync(PENDINGDL_STORE)) {
  try {
    const raw = fs.readFileSync(PENDINGDL_STORE, 'utf-8');
    pendingXnxx = JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal memuat pendingSearches.json, inisialisasi kosong.', e);
    pendingXnxx = {};
  }
}
function savePendingDl() {
  fs.writeFile(
    PENDINGDL_STORE,
    JSON.stringify(pendingXnxx, null, 2),
    'utf-8',
    (err) => {
      if (err) console.error('Gagal menyimpan pendingSearches:', err);
    }
  );
}
const PENDING_STORE = path.join(__dirname, 'pendingSearches.json');

let pendingSearches = {};
if (fs.existsSync(PENDING_STORE)) {
  try {
    const raw = fs.readFileSync(PENDING_STORE, 'utf-8');
    pendingSearches = JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal memuat pendingSearches.json, inisialisasi kosong.', e);
    pendingSearches = {};
  }
}

function savePendingSearches() {
  fs.writeFile(
    PENDING_STORE,
    JSON.stringify(pendingSearches, null, 2),
    'utf-8',
    (err) => {
      if (err) console.error('Gagal menyimpan pendingSearches:', err);
    }
  );
}
/* { SAVE DATABASE } */

/* { RUNNING SCRIPTS } */
const botToken = global.token
const bot = new TelegramBot(botToken, { polling: true });
console.log("✅ Bot Telegram telah berjalan!");
/* { RUNNING SCRIPTS } */

bot.sendMessage(`8049741001`, `Bot Tersambung`);

/* 

FITURE 

*/

async function xnxxsearch(query) {
  try {
  const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const os = require('os');
const path = require('path');
const FormData = require('form-data');
const { xnxxDownload } = require('@mr.janiya/xnxx-scraper');

    if (!query) throw new Error("⚠️ Masukkan kata kunci untuk mencari video!");

    const url = `https://www.xnxx.com/search/${encodeURIComponent(query)}`;
    console.log(`🔍 Scraping: ${url}`);

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) " +
          "Chrome/120.0.0.0 Safari/537.36"
      }
    });

    const $ = cheerio.load(data);
    const results = [];

    $(".mozaique .thumb-block").each((index, element) => {
      if (index >= 5) return; // Ambil hanya 5 hasil teratas
      let title = $(element).find(".thumb-under a").text().trim();
      let link =
        "https://www.xnxx.com" + $(element).find(".thumb-under a").attr("href");
      let duration = $(element).find(".thumb .duration").text().trim();
      let views = $(element).find(".metadata > span").first().text().trim();
      let rating = $(element).find(".metadata > span").last().text().trim();
      let thumbnail =
        $(element).find(".thumb img").attr("data-src") ||
        $(element).find(".thumb img").attr("src");

      results.push({ title, link, duration, views, rating, thumbnail });
    });

    return results.length > 0
      ? results
      : `❌ Tidak ditemukan hasil untuk '${query}'.`;
  } catch (error) {
    console.error("❌ Error scraping XNXX:", error.message);
    return "⚠️ Gagal mengambil data dari XNXX.";
  }
}

bot.onText(
  new RegExp(`^${prefix}xsearch(?:\\s+(.+))?$`, "i"),
  async (msg, match) => {
    const chatId = msg.chat.id;
    const userMsgId = msg.message_id;
    const query = match[1] ? match[1].trim() : "";
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const os = require('os');
const path = require('path');
const FormData = require('form-data');
const { xnxxDownload } = require('@mr.janiya/xnxx-scraper');

    if (!query) {
      return bot.sendMessage(
        chatId,
        `⚠️ Penggunaan: ${prefix}xsearch <kata_kunci>`,
        { reply_to_message_id: userMsgId }
      );
    }

    await bot.sendMessage(chatId, `🔍 Sedang mencari: "${query}"…`, {
      reply_to_message_id: userMsgId
    });

    let results;
    try {
      const scraped = await xnxxsearch(query);
      if (typeof scraped === "string") {
        return bot.sendMessage(chatId, scraped, { reply_to_message_id: userMsgId });
      }
      results = scraped;
    } catch (err) {
      console.error("xnxxsearch error:", err);
      return bot.sendMessage(
        chatId,
        "❌ Gagal mengambil hasil pencarian dari XNXX.",
        { reply_to_message_id: userMsgId }
      );
    }

    const requestId = Date.now().toString();
    pendingSearches[requestId] = results;

    const inlineKeyboard = results.map((item, idx) => {
      const shortTitle =
        item.title.length > 30
          ? item.title.slice(0, 27).trim() + "…"
          : item.title;
      return [
        {
          text: `${idx + 1}. ${shortTitle}`,
          callback_data: `xsearch:${requestId}:${idx}`
        }
      ];
    });

    await bot.sendMessage(
      chatId,
      `📋 Hasil “${query}” (pilih salah satu):`,
      {
        parse_mode: "Markdown",
        reply_to_message_id: userMsgId,
        reply_markup: { inline_keyboard: inlineKeyboard }
      }
    );
  }
);

bot.on("callback_query", async (callbackQuery) => {
  const data = callbackQuery.data;
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const os = require('os');
const path = require('path');
const FormData = require('form-data');
const { xnxxDownload } = require('@mr.janiya/xnxx-scraper');

  await bot.answerCallbackQuery(callbackQuery.id);

  // CASE A: User memilih salah satu hasil pencarian
  if (data.startsWith("xsearch:")) {
    // Format: "xsearch:<requestId>:<index>"
    const parts = data.split(":");
    if (parts.length !== 3) {
      return bot.sendMessage(
        chatId,
        "⚠️ Terjadi kesalahan pada data pencarian.",
        { reply_to_message_id: messageId }
      );
    }
    const requestId = parts[1];
    const idx = parseInt(parts[2], 10);

    const results = pendingSearches[requestId];
    if (!results || !results[idx]) {
      return bot.sendMessage(
        chatId,
        "⚠️ Hasil pencarian tidak ditemukan atau sudah kadaluarsa.",
        { reply_to_message_id: messageId }
      );
    }

    const chosen = results[idx];
    const chosenUrl = chosen.link;

    // Ambil metadata video (menggunakan xnxxDownload)
    let info;
    try {
      await bot.sendMessage(
        chatId,
        "🔄 Mengambil metadata dari xnxx-scraper…",
        { reply_to_message_id: messageId }
      );
      const downloadData = await xnxxDownload(chosenUrl);
      info = downloadData.result; // { title, URL, duration, info, files: { low, high, HLS }, image }
    } catch (err) {
      console.error('Error xnxxDownload dari hasil search:', err);
      return bot.sendMessage(
        chatId,
        '❌ Gagal mengambil metadata dari xnxx-scraper.',
        { reply_to_message_id: messageId }
      );
    }

    if (!info.files.high) {
      return bot.sendMessage(
        chatId,
        '⚠️ Video kualitas tinggi tidak tersedia.',
        { reply_to_message_id: messageId }
      );
    }

    // Simpan untuk proses download selanjutnya
    const downloadId = Date.now().toString();
    pendingDownloads[downloadId] = {
      videoUrl: info.files.high,
      info: {
        title: info.title,
        image: info.image,
        duration: info.duration
      },
      chatId,
      messageId
    };

    // Kirim thumbnail + dua tombol: Kirim Video atau Kirim Link
    const caption = `*${info.title}*\n` +
      `📌 URL Asli: ${info.URL}\n` +
      `⏱ Durasi: ${info.duration}s\n\n` +
      `Pilih aksi:`;

    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🎬 Kirim Video', callback_data: `xsearchdl:${downloadId}:video` },
            { text: '🔗 Kirim Link',   callback_data: `xsearchdl:${downloadId}:link` }
          ]
        ]
      },
      parse_mode: 'Markdown',
      reply_to_message_id: messageId
    };

    return bot.sendPhoto(chatId, info.image, {
      caption,
      ...inlineKeyboard
    });
  }

  // CASE B: User memilih aksi download
  if (data.startsWith("xsearchdl:")) {
    // Format: "xsearchdl:<downloadId>:<action>"
    const parts = data.split(":");
    if (parts.length !== 3) {
      return bot.sendMessage(
        chatId,
        "⚠️ Terjadi kesalahan pada data download.",
        { reply_to_message_id: messageId }
      );
    }
    const downloadId = parts[1];
    const action = parts[2]; // "video" atau "link"

    const pending = pendingDownloads[downloadId];
    if (!pending) {
      return bot.sendMessage(
        chatId,
        "⚠️ Request download tidak ditemukan atau sudah kadaluarsa.",
        { reply_to_message_id: messageId }
      );
    }
    const { videoUrl, info } = pending;
    delete pendingDownloads[downloadId];

    // Jika memilih “video”
    if (action === "video") {
      await bot.sendMessage(chatId, "🔄 Mengunduh video…", {
        reply_to_message_id: messageId
      });

      const tempPath = path.join(os.tmpdir(), `xnxx_send_${downloadId}.mp4`);
      try {
        const writer = fs.createWriteStream(tempPath);
        const responseStream = await axios({
          url: videoUrl,
          method: "GET",
          responseType: "stream",
          maxContentLength: Infinity
        });
        responseStream.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      } catch (err) {
        console.error("Error mengunduh video untuk dikirim:", err);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        return bot.sendMessage(
          chatId,
          "❌ Gagal mengunduh video.",
          { reply_to_message_id: messageId }
        );
      }

      try {
        await bot.sendVideo(chatId, tempPath, {
          caption: `🎬 ${info.title}\n⏱ Durasi: ${info.duration}s`,
          reply_to_message_id: messageId
        });
      } catch (err) {
        console.error("Error mengirim video ke Telegram:", err);
        return bot.sendMessage(
          chatId,
          "❌ Gagal mengirim video ke Telegram.",
          { reply_to_message_id: messageId }
        );
      } finally {
        if (fs.existsSync(tempPath)) {
          fs.unlink(tempPath, (e) => {
            if (e) console.warn("Gagal hapus file temporer:", tempPath, e);
          });
        }
      }
      return;
    }

    // Jika memilih “link”
    if (action === "link") {
      await bot.sendMessage(chatId, "🔄 Mengunduh & mengunggah ke Catbox…", {
        reply_to_message_id: messageId
      });

      const tempPath = path.join(os.tmpdir(), `xnxx_catbox_${downloadId}.mp4`);
      try {
        const writer = fs.createWriteStream(tempPath);
        const responseStream = await axios({
          url: videoUrl,
          method: "GET",
          responseType: "stream",
          maxContentLength: Infinity
        });
        responseStream.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      } catch (err) {
        console.error("Error mengunduh video untuk Catbox:", err);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        return bot.sendMessage(
          chatId,
          "❌ Gagal mengunduh video.",
          { reply_to_message_id: messageId }
        );
      }

      let catboxUrl;
      try {
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", fs.createReadStream(tempPath));

        const catboxRes = await axios.post("https://catbox.moe/user/api.php", form, {
          headers: form.getHeaders(),
          maxBodyLength: Infinity
        });

        catboxUrl = typeof catboxRes.data === "string"
          ? catboxRes.data.trim()
          : null;

        if (!catboxUrl || !catboxUrl.startsWith("http")) {
          throw new Error(`Respons Catbox tidak valid: ${catboxRes.data}`);
        }
      } catch (err) {
        console.error("Error upload ke Catbox:", err);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        return bot.sendMessage(
          chatId,
          `❌ Gagal upload ke Catbox:\n${err.message || err}`,
          { reply_to_message_id: messageId }
        );
      } finally {
        if (fs.existsSync(tempPath)) {
          fs.unlink(tempPath, (e) => {
            if (e) console.warn("Gagal hapus file temporer:", tempPath, e);
          });
        }
      }

      return bot.sendMessage(
        chatId,
        `✅ Video berhasil di‐upload ke Catbox!\n\n🔗 ${catboxUrl}`,
        { reply_to_message_id: messageId }
      );
    }
  }
});

/*

FITURE

*/