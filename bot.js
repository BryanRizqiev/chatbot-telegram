require("dotenv").config();
const { Bot, InputFile } = require("grammy");
const { limit } = require("@grammyjs/ratelimiter");
const axios = require("axios");

const { api, bot_token } = process.env;
const { removePrefix } = require("./functions.js");

const bot = new Bot(bot_token);

let limits = limit({
  timeFrame: 5000,
  onLimitExceeded: async (ctx) => {
    console.log(ctx);
    await ctx.reply("Mohon tunggu 5 detik..", {
      reply_to_message_id: ctx.message.message_id,
    });
  },
});

bot.command("start", limits, (ctx) => {
  let menu = `
  Selamat Datang! Berikut menu yang tersedia:
<code>siapa nama(saya/ku)
/tiktokdl (url)
/igdl (url)
  </code>
  `;
  ctx.api.sendMessage(ctx.chat.id, menu, {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: "HTML",
  });
});

bot.hears(/^siapa nama(?:\s)?(saya|ku)$/i, limits, async (ctx) => {
  let { first_name: fname, last_name: lname } = ctx.message.from;
  lname = lname !== undefined ? lname : "";
  let name = fname + " " + lname;
  await ctx.reply("Nama kamu adalah " + name, {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: "HTML",
  });
});

bot.command("tiktokdl", limits, async (ctx) => {
  try {
    if (!ctx.match)
      return await ctx.reply("Masukkan URL tiktok", {
        reply_to_message_id: ctx.message.message_id,
      });

    let download = await ctx.reply("Sedang mendownload...", {
      reply_to_message_id: ctx.message.message_id,
    });

    const result = await performDownloadTask(api + "tiktokdl?url=" + ctx.match);

    if (result.success) {
      let linkdl = result.data.downloadUrls[1];
      await ctx.api.sendVideo(ctx.chat.id, new InputFile({ url: linkdl }), {
        reply_to_message_id: ctx.message.message_id,
      });
      await ctx.api.deleteMessage(ctx.chat.id, download.message_id);
    } else {
      await ctx.reply("Gagal mendownload, cek URL dan coba lagi.", {
        reply_to_message_id: ctx.message.message_id,
      });
      await ctx.api.deleteMessage(ctx.chat.id, download.message_id);
    }
  } catch (error) {
    console.log(error);
    await ctx.reply("Terjadi error pada sistem.", {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

async function performDownloadTask(url) {
  return new Promise((resolve, reject) => {
    axios(url)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

bot.command("igdl", limits, async (ctx) => {
  try {
    if (!ctx.match)
      return await ctx.reply("masukkan url instagram", {
        reply_to_message_id: ctx.message.message_id,
      });

    let download = await ctx.reply("Sedang mendownload...", {
      reply_to_message_id: ctx.message.message_id,
    });

    const result = await performDownloadTask(
      api + "igreelsdl?url=" + ctx.match
    );

    if (result.success) {
      let linkdl = result.data.downloadUrl;
      await ctx.api.sendVideo(ctx.chat.id, new InputFile({ url: linkdl }), {
        reply_to_message_id: ctx.message.message_id,
      });
      await ctx.api.deleteMessage(ctx.chat.id, download.message_id);
    } else {
      await ctx.reply("Gagal mendownload, cek URL dan coba lagi.", {
        reply_to_message_id: ctx.message.message_id,
      });
      await ctx.api.deleteMessage(ctx.chat.id, download.message_id);
    }
  } catch (error) {
    console.log(error);
    await ctx.reply("Terjadi error pada sistem.", {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

console.log("BOT STARTED");
bot.start({
  drop_pending_updates: true,
});
