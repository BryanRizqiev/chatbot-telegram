require("dotenv").config()
const { Bot, InputFile, InlineKeyboard } = require("grammy")
const { limit } = require("@grammyjs/ratelimiter")
const { run } = require("@grammyjs/runner")

const { bot_token } = process.env
const nlpFunc = require("./index.js")
let theFunc;

(async () => {
  theFunc = await nlpFunc
})()

const bot = new Bot(bot_token)

let limits = limit({
  timeFrame: 5000,
  onLimitExceeded: async (ctx) => {
    console.log(ctx)
    await ctx.reply("Mohon tunggu 5 detik..", {
      reply_to_message_id: ctx.message.message_id,
    })
  },
})

bot.on("callback_query:data", async (ctx) => {
  let data = ctx.callbackQuery.data
  if (data === "information") {
    await ctx.api.deleteMessage(
      ctx.chat.id,
      ctx.callbackQuery.message.message_id
    )
    await ctx.api.sendPhoto(
      ctx.chat.id,
      "./logounp.jpg",
      {
        caption: "Ini informasi",
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard()
          .text("Tentang", "about")
          .text("Menu", "menu")
          .row()
          .text("Kembali", "back"),
      }
    )
  }
  if (data === "about") {
    await ctx.api.deleteMessage(
      ctx.chat.id,
      ctx.callbackQuery.message.message_id
    )
    await ctx.api.sendPhoto(
      ctx.chat.id,
      "./logounp.jpg",
      {
        caption: "Ini tentang",
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard()
          .text("Informasi", "information")
          .text("Menu", "menu")
          .row()
          .text("Kembali", "back"),
      }
    )
  }
  if (data === "menu") {
    await ctx.api.deleteMessage(
      ctx.chat.id,
      ctx.callbackQuery.message.message_id
    )
    let menu = `Berikut menu:
<code>siapa nama (saya/ku)</code>
<code>/igdl (url)</code>
<code>/tiktokdl (url)</code>
    `
    await ctx.api.sendPhoto(
      ctx.chat.id,
      "./logounp.jpg",
      {
        caption: menu,
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard()
          .text("Informasi", "information")
          .text("Tentang", "about")
          .row()
          .text("Kembali", "back"),
      }
    )
  }

  if (data === "back") {
    await ctx.api.deleteMessage(
      ctx.chat.id,
      ctx.callbackQuery.message.message_id
    )
    await ctx.api.sendPhoto(
      ctx.chat.id,
      "./logounp.jpg",
      {
        caption: "Selamat Datang di ChatBot Telegram!",
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard()
          .text("Informasi", "information")
          .text("Tentang", "about")
          .row()
          .text("Menu", "menu"),
      }
    )
  }
})

bot.command("start", limits, (ctx) => {
  ctx.api.sendMessage(ctx.message.chat.id, "Selamat datang di Chat-Bot")
})

bot.command("tiktokdl", limits, async (ctx) => {
  try {
    if (!ctx.match)
      return await ctx.reply("masukkan url tiktok", {
        reply_to_message_id: ctx.message.message_id,
      })

    let download = await ctx.reply("Sedang mendownload...", {
      reply_to_message_id: ctx.message.message_id,
    })

    let { data } = await axios(api + "tiktokdl?url=" + ctx.match)
    if (data.success) {
      let linkdl = data.data.downloadUrls[1]
      await ctx.api.sendVideo(ctx.chat.id, new InputFile({ url: linkdl }), {
        reply_to_message_id: ctx.message.message_id,
      })
      await ctx.api.deleteMessage(ctx.chat.id, download.message_id)
    } else {
      await ctx.reply("Gagal mendownload, cek url dan coba lagi.", {
        reply_to_message_id: ctx.message.message_id,
      })
      await ctx.api.deleteMessage(ctx.chat.id, download.message_id)
    }
  } catch (error) {
    console.log(error)
    await ctx.reply("Terjadi error pada sistem.", {
      reply_to_message_id: ctx.message.message_id,
    })
  }
})

bot.command("igdl", limits, async (ctx) => {
  try {
    if (!ctx.match)
      return await ctx.reply("masukkan url instagram", {
        reply_to_message_id: ctx.message.message_id,
      })

    let download = await ctx.reply("Sedang mendownload...", {
      reply_to_message_id: ctx.message.message_id,
    })

    let { data } = await axios(api + "igreelsdl?url=" + ctx.match)
    if (data.success) {
      let linkdl = data.data.downloadUrl
      await ctx.api.sendVideo(ctx.chat.id, new InputFile({ url: linkdl }), {
        reply_to_message_id: ctx.message.message_id,
      })
      await ctx.api.deleteMessage(ctx.chat.id, download.message_id)
    } else {
      await ctx.reply("Gagal mendownload, cek url dan coba lagi.", {
        reply_to_message_id: ctx.message.message_id,
      })
      await ctx.api.deleteMessage(ctx.chat.id, download.message_id)
    }
  } catch (error) {
    console.log(error)
    await ctx.reply("Terjadi error pada sistem.", {
      reply_to_message_id: ctx.message.message_id,
    })
  }
})

bot.on("message", async (context) => {
  let message = await theFunc(context.message.text)
  message = !message.answer ? "Maaf, saya tidak tahu" : message.answer
  bot.api.sendMessage(context.message.chat.id, message)
})

console.log("BOT STARTED")
run(bot)
