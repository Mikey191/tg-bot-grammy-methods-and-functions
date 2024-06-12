require("dotenv").config();
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");
const { hydrate } = require("@grammyjs/hydrate");

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
  { command: "start", description: "Запуск бота" },
  { command: "hello", description: "Получить приветсвие" },
]);

bot.command("start", async (ctx) => {
  await ctx.reply(
    `Привет! Я - бот, ссылка канала: <span class="tg-spoiler">ссылка</span>`,
    {
      parse_mode: "HTML",
    }
  );
});

// bot.command("mood", async (ctx) => {
//   const moodKeyboard = new Keyboard()
//     .resized()
//     .oneTime()
//     .text("Хорошо")
//     .row()
//     .text("Норм")
//     .row()
//     .text("Плохо");
//   await ctx.reply("Как настроение?", {
//     reply_markup: moodKeyboard,
//   });
// });

// bot.command("mood", async (ctx) => {
//   // список с названиями
//   const moodLabels = ["Хорошо", "Норм", "Плохо"];
//   // создание рядов для клавиатуры
//   const rows = moodLabels.map((label) => {
//     return [Keyboard.text(label)];
//   });
//   // создаем клавиатуру
//   const moodKeyboard2 = Keyboard.from(rows).resized();
//   await ctx.reply("Как настроение?", {
//     reply_markup: moodKeyboard2,
//   });
// });

// bot.command("share", async (ctx) => {
//   const shareKeyboard = new Keyboard()
//     .requestLocation("Геолокация")
//     .requestContact("Контакт")
//     .requestPoll("Опрос")
//     .placeholder("Укажи данные")
//     .resized();
//   await ctx.reply("Чем хочешь поделиться?", {
//     reply_markup: shareKeyboard,
//   });
// });

// bot.command("inline_keyboard", async (ctx) => {
//   const inlineKeyboard = new InlineKeyboard()
//     .text("1", "button-1")
//     .row()
//     .text("2", "button-2")
//     .row()
//     .text("3", "button-3");

//   await ctx.reply("Выбирите цифру", {
//     reply_markup: inlineKeyboard,
//   });
// });

// bot.command("inline_keyboard", async (ctx) => {
//   const inlineKeyboard2 = new InlineKeyboard().url(
//     "Перейти в тг-канал",
//     "https://t.me/apl_footballBot"
//   );
//   await ctx.reply("Нажмите кнопку", {
//     reply_markup: inlineKeyboard2,
//   });
// });

// bot.callbackQuery(/button-[1-3]/, async (ctx) => {
//   await ctx.answerCallbackQuery("answerCallbackQuery сработал");
//   await ctx.reply(`Вы нажали кнопку: ${ctx.callbackQuery.data}`);
// });

// bot.on("callback_query:data", async (ctx) => {
//   await ctx.answerCallbackQuery("answerCallbackQuery сработал");
//   await ctx.reply(`Вы нажали кнопку: ${ctx.callbackQuery.data}`);
// });

// bot.on(":contact", async (ctx) => {
//   await ctx.reply("Спасибо за контакт!");
// });

// bot.hears("Хорошо", async (ctx) => {
//   await ctx.reply("Класс!", {
//     reply_markup: { remove_keyboard: true },
//   });
// });

// bot.on("message", async (ctx) => {
//   await ctx.reply("Надо подумать...");
// });
// bot.command(["say_hello", "hello", "say_hi"], async (ctx) => {
//   await ctx.reply("Hello!");
// });
// bot.on("message:entities:url", async (ctx) => {
//   await ctx.reply("Надо подумать...");
// });
// bot.on(":photo").on("::hashtag", async (ctx) => {
//   await ctx.reply("Надо подумать...");
// });
// bot.on("msg").filter(
//   (ctx) => {
//     return ctx.from.id === 824624480;
//   },
//   async (ctx) => {
//     await ctx.reply("Привет админ...");
//   }
// );
// bot.hears(/пипец/, async (ctx) => {
//   await ctx.reply("ругаешься");
// });

const menuKeyboard = new InlineKeyboard()
  .text("Узнать статус заказа", "order-status")
  .text("Обратиться в поддержка", "support");

const backKeyboard = new InlineKeyboard().text("Назад в меню", "back");

bot.command("menu", async (ctx) => {
  await ctx.reply("Выберете пункт меню", {
    reply_markup: menuKeyboard,
  });
});

bot.callbackQuery("order-status", async (ctx) => {
  await ctx.callbackQuery.message.editText("Статус заказа: в пути", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("support", async (ctx) => {
  await ctx.callbackQuery.message.editText("Напишите ваш запрос", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("back", async (ctx) => {
  await ctx.callbackQuery.message.editText("Выберете пункт меню", {
    reply_markup: menuKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error(`Could not contact Telegram:`, e);
  } else {
    console.error(`Unknown error:`, e);
  }
});

bot.start();
