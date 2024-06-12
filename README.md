# tg-bot-grammy-methods-and-functions

## Создание бота.
Заходим в телеграм.
Находим в поиске в телеграм "botfather".
Пишим команда /newbot.
Вводим название бота. Оно может быть любым. Оно будет отображаться пользователям.
Вводим уникальный username по которому его можно будет найти в поиске. Название обязательно должно заканчиваться на Bot.
Нам приходит сообщение с информацией о созданном боте и с токеном для взаимодействия с ним.

## Старт проекта
Скачать node.js
Скачать npm
Инициализируем проект: npm init -y
Подключаем библиотеки: npm i grammy dotenv nodemon
Создаем файл index.js
Создаем файл .env

## Создаем переманную окружения куда будем помещать токен в файле .env
```
BOT_API_KEY = "token"
```
## Переходим к файлу index.js
Подключаем библиотеку, которая позволяет использовать переменные окружения:
```javascript
require("dotenv").config();
```
Импортируем необходимые классы из библиотеки grammy:
```javascript
const {Bot} = require("grammy");
```
Создаем экземпляр бота:
```javascript
const bot = new Bot(process.env.BOT_API_KEY);
```
Запускаем бота:
```javascript
bot.start();
```

## Команда /start
Весь функционал бота должен быть реализован между **переменной экземпляром бота **и **bot.start()**.  
Создаем слушатель команды:
```javascript
bot.command("start", async (ctx) => {});
```
- Первый аргумент - название команды
- Второй аргумент - callback который принимает контекст (ctx)

```
Контекст - это объект который помогает работать с данными, которые приходят от телеграма (например сообщение пользователя).
```
## Из чего состоит контекст (ctx):
```
Context {
  update: {
    update_id: 66,
    message: {
      message_id: 1077,
      from: [Object],
      chat: [Object],
      date: 171,
      text: '/start',
      entities: [Array]
    }
  },
  api: Api {
    token: '751',
    options: undefined,
    raw: {},
    config: {
      use: [Function: use],
      installedTransformers: [Function: installedTransformers]
    }
  },
  me: {
    id: 65,
    is_bot: true,
    first_name: 'APL',
    username: 'apl',
    can_join_groups: true,
    can_read_all_group_messages: true,
    supports_inline_queries: false,
    can_connect_to_business: false
  },
  match: ''
}
```
## Из чего состоит ctx.from:
```
{
  id: 82,
  is_bot: false,
  first_name: 'whymiky',
  username: 'whymiky',
  language_code: 'ru'
}
```
## Из чего состоит ctx.chat
```
{
  id: 82,
  first_name: 'whymiky',
  username: 'whymiky',
  type: 'private'
}
```

## Отвечать пользователю можно с помощью метода reply
```javascript
bot.command("start", async (ctx) => {
  await ctx.reply("Привет! Я - бот");
});
```
## Реагирование на любое сообщение:
```javascript
bot.on("message", async (ctx) => {
  await ctx.reply("Надо подумать...");
});
```
Порядок в котором мы навешиваем слушатели важен.  
Обработчики которые находятся ранее по коду первее получают запросы, если они на него реагируют, то дальше запрос не пойдет.  
## Для корректной работы бота с помощью grammy необходимо добавить в код обработчик ошибок.  
Для обработки ошибок нужно импортировать GrammyError и HttpError из grammy.
```javascript
const { Bot, GrammyError, HttpError } = require("grammy");
```
Обработчик ошибок - bot.catch()
```javascript
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
```
Виды обработчиков в grammy и как с ними работать.
## Ответ на команды
**команда** - это любая последовательность знаков без пробела после слеша.
```javascript
bot.command("say_hello", async (ctx) => {
  await ctx.reply("Hello!");
});
```
## Объединить несколько команд для одинаковой реации
```javascript
bot.command(["say_hello", "hello", "say_hi"], async (ctx) => {
  await ctx.reply("Hello!");
});
```
## Как показать меню команд которые есть у нашего бота:
```javascript
bot.api.setMyCommands([
  { command: "start", description: "Запуск бота" },
  { command: "hello", description: "Получить приветсвие" },
]);
```
теперь у бота появляется кнопка для этих команд. в setMyCommands мы не можем использовать заглавные буквы.

## Ответ на типы сообщений или сообщение с вложениями.
У grammy есть свой собственный продвинутый язык фильтрации.
### Обработчик любого сообщения, которое содержит текст:
```javascript
bot.on("message:text", async (ctx) => {
  await ctx.reply("Надо подумать...");
});
```
### Вместо текста мы можем вставить message:photo или message:voice.
С полным списком можно ознакомиться в документации.
Так же можно сократить запись и написать просто :text
```javascript
bot.on(":text", async (ctx) => {
  await ctx.reply("Надо подумать...");
});
```
### Фильтры можно настраивать еще гибче. Можно обратиться к механизму парсинга сообщения и например отвечать только на те сообщения, где есть ссылка:
```javascript
bot.on("message:entities:url", async (ctx) => {
  await ctx.reply("Надо подумать...");
});
```
### такую запись так же можно сократить:
```javascript
bot.on("::url", async (ctx) => {
  await ctx.reply("Надо подумать...");
});
```
С полным списком фильтров можно ознакомиться в документации:
### Так же можно объединять несколько фильтров, например сообщение и с photo и с хэштэг:
```javascript
bot.on(":photo").on("::hashtag", async (ctx) => {
  await ctx.reply("Надо подумать...");
});
```
### Так же можно создавать свои фильтры с помощью функции filter. 
В ней мы указываем каллбэк который будет функцией фильтрации и будет возвращать либо тру либо фолс. Можно фильтровать пользователя по id. Функция для обработки будет вторым аргументом:
```javascript
bot.on("msg").filter(
  (ctx) => {
    return ctx.from.id === 824624480;
  },
  async (ctx) => {
    await ctx.reply("Привет админ...");
  }
);
```

## Ответ на определенный текст.
Для этого используется слушатель bot.hears. первым аргументом принимается сообщение. вторым аргументом как всегда callback:
```javascript
bot.hears("пинг", async (ctx) => {
  await ctx.reply("понг");
});
```
### Слушать можно несколько выражений сразу с помощью объединения сообщений в массив:
```javascript
bot.hears(["пинг", "пинг-понг", "ping"], async (ctx) => {
  await ctx.reply("понг");
});
```
### Слушатель hears может принимать не только строку но и регулярные выражения.
Заключив любое слого в два слэша мы можем выцеплть его из любой длины сообщения:
```javascript
bot.hears(/пипец/, async (ctx) => {
  await ctx.reply("ругаешься");
});
```

## Методы контекста.
### Метод ответа пользователю ctx.reply().
Помимо самого ответа (первый аргумент) этот метод может принимать и второй аргумент (необязательный) в котором можно указать разные модификаторы для отправки.  
Например мы можем указать reply_parameters и теперь бот будет отвечать на сообщение которое подойдет условию
```javascript
bot.command("start", async (ctx) => {
  await ctx.reply("Привет! Я - бот", {
    reply_parameters: { message_id: ctx.message.message_id },
  });
});
```
### Так же можно применить один из видов форматирования сообщений передав параметр parse_mode: у него есть значения: 
- HTML - в тексте ответа можно использовать некоторые HTML теги.
- MarkDown - в тексте ответа можно использовать некоторую разметку MarkDown.
- MarkDown2 - в тексте ответа можно использовать некоторую разметку MarkDown2.
```javascript
bot.command("start", async (ctx) => {
  await ctx.reply(
    `Привет! Я - бот, ссылка канала: <a href="https://t.me/apl_footballBot">ссылка</a>`,
    {
      parse_mode: "HTML",
    }
  );
});
```
### С помощью этого функционала можно сделать спойлер добавив к элементу класс tg-spoiler:
```javascript
bot.command("start", async (ctx) => {
  await ctx.reply(
    `Привет! Я - бот, ссылка канала: <span class="tg-spoiler">ссылка</span>`,
    {
      parse_mode: "HTML",
    }
  );
});
```
с полным списком таких классов можно ознакомиться в документации.

## КЛАВИАТУРЫ:
### Клавиатуры бывают двух видов:
- **Oбычная клавиатура** (custom_keyboard)
- **Инлайн клавиатура** (inline_keyboard)
Клавиатуру можно отправить только с каким либо сообщением.
В одном сообщении можно отправить только одну клавиатуру.

## Обычная клавиатура - это клавиатура которая заменяет клавиатуру с буквами на телефоне.
Для работы с такой клавиатуры необходимо импортировать класс **Keyboard**.
```javascript
const { Bot, GrammyError, HttpError, Keyboard } = require("grammy");
```
### Создать клавиатуру мы можем так же как создавали бота. Что бы отправить клавиатуру нужно использовать второй параметр reply_keyboard:
```javascript
bot.command("mood", async (ctx) => {
  const moodKeyboard = new Keyboard().text("Хорошо").text("Норм").text("Плохо");
  await ctx.reply("Как настроение?", {
    reply_markup: moodKeyboard,
  });
});
```
### Что бы расположить кнопки по разным рядам нужно использовать метод row()
```javascript
bot.command("mood", async (ctx) => {
  const moodKeyboard = new Keyboard().text("Хорошо").row().text("Норм").row().text("Плохо");
  await ctx.reply("Как настроение?", {
    reply_markup: moodKeyboard,
  });
});
```
По умолчанию кнопки растягиваются так, что бы клавиатура была обычного размера. 
### Что бы эти кнопки были по размеру содержимого нужно вызвать метод resized(). 
Его можно применить в любом месте чейнинга клавиатуры.
```javascript
bot.command("mood", async (ctx) => {
  const moodKeyboard = new Keyboard()
    .resized()
    .text("Хорошо")
    .row()
    .text("Норм")
    .row()
    .text("Плохо");
  await ctx.reply("Как настроение?", {
    reply_markup: moodKeyboard,
  });
});
```
### При нажатии на кнопку такой клавиатуры отправляется обычное текстовое сообщение с содержанием в описании кнопки.
Что бы отвечать на такие сообщения можно использовать обычный слушатель **bot.hears()**
```javascript
bot.hears("Хорошо", async (ctx) => {
  await ctx.reply("Класс!");
});
```
Обычная клавиатура по умолчанию не пропадает самостоятельно.
### Для исчезновения такой клавиатуры необходимо добавить метод oneTime() в любом месте чейнинга:
```javascript
bot.command("mood", async (ctx) => {
  const moodKeyboard = new Keyboard()
    .resized()
    .oneTime()
    .text("Хорошо")
    .row()
    .text("Норм")
    .row()
    .text("Плохо");
  await ctx.reply("Как настроение?", {
    reply_markup: moodKeyboard,
  });
});
```
### Так же можно убрать эту клавиатуру на совсем. 
Убираем в клавиатуре oneTime(). В функции слушателе сообщения "Хорошо" вторым аргументом в ответе пользователю передадим второй аргумент {reply_markup: {remove_keyboard: true}}:
```javascript
bot.hears("Хорошо", async (ctx) => {
  await ctx.reply("Класс!", {
    reply_markup: { remove_keyboard: true },
  });
});
```
### Так же клавиатуру можно создавать с помощью альтернативного способа. Если уже есть масив строк для кнопок клавиатуры.
```javascript
bot.command("mood", async (ctx) => {
  // список с названиями
  const moodLabels = ["Хорошо", "Норм", "Плохо"];
  // создание рядов для клавиатуры
  const rows = moodLabels.map((label) => {
    return [Keyboard.text(label)];
  });
  // создаем клавиатуру
  const moodKeyboard2 = Keyboard.from(rows).resized();
  await ctx.reply("Как настроение?", {
    reply_markup: moodKeyboard2,
  });
});
```
### В Обычной клавиатуре мы можем кроме обычных кнопок запрашивать у пользователя геолокацию, номер телефона и опрос.
```javascript
bot.command("share", async (ctx) => {
  const shareKeyboard = new Keyboard()
    .requestLocation("Геолокация")
    .requestContact("Контакт")
    .requestPoll("Опрос")
    .resized();
  await ctx.reply("Чем хочешь поделиться?", {
    reply_markup: shareKeyboard,
  });
});
```
### В клавиатуре так же можно использовать метод placeholder. Он работает так же как и на любом сайте в инпуте.
```javascript
bot.command("share", async (ctx) => {
  const shareKeyboard = new Keyboard()
    .requestLocation("Геолокация")
    .requestContact("Контакт")
    .requestPoll("Опрос")
    .placeholder("Укажи данные")
    .resized();
  await ctx.reply("Чем хочешь поделиться?", {
    reply_markup: shareKeyboard,
  });
});
```
### Так же можно обрабатывать эти контакты
```javascript
bot.on(":contact", async (ctx) => {
 await ctx.reply("Спасибо за контакт!")
})
```

## ИНЛАЙН КЛАВИАТУРА.
У инлайн клавиатуры сильно отличается способ обработки нажатия на такую клавиатуру.
### Для использования инлайн клавиатуры импортируем класс InlineKeyboard
```javascript
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require("grammy");
```
### Создаем команду в которой будем посылать инлайн клавиатуру.
### Создаем инлайн клавиатуру new InlineKeyboard()
### Далее в метод текст нам надо пеместить два аргумента:
- лейбел кнопки
- данные, которые отправляются внутри ctx как callback_query
```javascript
bot.command("inline_keyboard", async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text("1", "button-1")
    .text("2", "button-2")
    .text("3", "button-3");

  await ctx.reply("Выбирите цифру", {
    reply_markup: inlineKeyboard,
  });
});
```
## Обработка нажатий на инлайн клавиатуру
Когда мы нажимаем на кнопку инлайн клавиатуры обратно отправляется **callback_query**, тот самый второй аргумент, который нам нужно обрабатывать.
```javascript
bot.callbackQuery(["button-1", "button-2", "button-3"], async (ctx) => {
  await ctx.reply("Вы выбрали цифру!");
});
```
### Что бы закончить загрузку сообщения нужно вызвать метод ctx.answerCallbackQuery() в который можно так же передать текст который будет отображаться в середине экрана для windows и наверху чата для ios.
```javascript
bot.callbackQuery(["button-1", "button-2", "button-3"], async (ctx) => {
  await ctx.answerCallbackQuery("answerCallbackQuery сработал");
  await ctx.reply("Вы выбрали цифру!");
});
```
### Так же обрабатывать нажатие кнопок на инлайн клавиатуре можно реализовать с помощью bot.on
```javascript
bot.on("callback_query:data", async (ctx) => {
  await ctx.answerCallbackQuery("answerCallbackQuery сработал");
  await ctx.reply("Вы выбрали цифру!");
});
```
### При обработки таким образом мы можем обращаться к callback_query кнопки которую нажал пользователь
```javascript
bot.on("callback_query:data", async (ctx) => {
  await ctx.answerCallbackQuery("answerCallbackQuery сработал");
  await ctx.reply(`Вы нажали кнопку: ${ctx.callbackQuery.data}`);
});
```
### Обработчик callbackQuery может так же принимать регулярные выражения.
```javascript
bot.callbackQuery(/button-[1-3]/, async (ctx) => {
  await ctx.answerCallbackQuery("answerCallbackQuery сработал");
  await ctx.reply(`Вы нажали кнопку: ${ctx.callbackQuery.data}`);
});
```
### У инлайн клавиатуры так же присутствует метод row()
```javascript
bot.command("inline_keyboard", async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text("1", "button-1")
    .row()
    .text("2", "button-2")
    .row()
    .text("3", "button-3");

  await ctx.reply("Выбирите цифру", {
    reply_markup: inlineKeyboard,
  });
});
```
### Так же у инлайн клавиатуры есть методы login pay url и др.
Для работы с такими методавми требуется дополнительная настройка, которую можно посмотреть в описании, но можно посмотреть метод url()
```javascript
bot.command("inline_keyboard", async (ctx) => {
  const inlineKeyboard2 = new InlineKeyboard().url(
    "Перейти в тг-канал",
    "https://t.me/apl_footballBot"
  );
  await ctx.reply("Нажмите кнопку", {
    reply_markup: inlineKeyboard2,
  });
});
```

## ПЛАГИН hydrate
При работе с клавиатурами очень мощный инструмент - это плагины.
Установим в наш проект плагин hydrate:
```
npm i @grammyjs/hydrate
```
Этот плагин поможет нам использовать инлайн клавиатуры в качестве **интерактивного меню**.
## Импортируем плагин:
```javascript
const { hydrate } = require("@grammyjs/hydrate");
```
## Добавляем плагин под строкой создания бота.
```javascript
bot.use(hydrate());
```
Иногда полезно скрыть старые данные и показать новые данные.
Для этого помле нажатия пользователем на кнопку мы будем заменять текст и клавиатуру.
## Создадим новую команду menu и Создаем клавиатуры
```javascript
const menuKeyboard = new InlineKeyboard()
  .text("Узнать статус заказа", "order")
  .text("Обратиться в поддержка", "support");

const backKeyboard = new InlineKeyboard().text("Назад в меню", "back")

bot.command("menu", async (ctx) => {
 await ctx.reply("Выберете пункт меню", {
  reply_markup: menuKeyboard
 })
});
```
## добавляем обработчик для наших кнопок в котором мы будем реализовывать изменение текста сообщения и самой клавиатуры. Для этого функционала как раз и нужен hydrate.
```javascript
bot.callbackQuery("order-status", async (ctx) => {
  await ctx.callbackQuery.message.editText("Статус заказа: в пути", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});
```
```javascript
bot.callbackQuery("support", async (ctx) => {
  await ctx.callbackQuery.message.editText("Напишите ваш запрос", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});
```
```javascript
bot.callbackQuery("back", async (ctx) => {
  await ctx.callbackQuery.message.editText("Выберете пункт меню", {
    reply_markup: menuKeyboard,
  });
  await ctx.answerCallbackQuery();
});
```