export const translationsRU = {
  common: {
    executionError:
      'Что-то у меня машина не заводится... Не ну я нимогУ!.. Позже переспроси, а? Сейчас с дядей Серёжей починим... 🛠',
  },

  BestchangeCommandService: {
    resultIntro: 'Вот что на базаре сегодня видел:',
    rateInfo: `<b>{{fromSymbol}}/{{toSymbol}}</b> (<a href="{{url}}">Bestchange.ru</a>):`,
    rateInfoRow: ` • {{title}}: <b>{{price}} ₽</b>`,
  },

  FuelCommandService: {
    resultIntro: 'Батя по колонкам прошёлся, вот где бензин наливают:\n\n',
    newStationsIntro: 'О, новая колонка нарисовалась, бл*ть! Гляди:\n\n',
    stationInfo: ` • <b>{{name}}</b> ({{addr}}): {{fuels}}`,
    stationInfoNoAddr: ` • <b>{{name}}</b>: {{fuels}}`,
    unknownStation: 'Какая-то шарага',
    noFuelInfo: 'хрен знает что там',
    noStationsFound: 'Пусто, бл*ть! Всё вылакали. Иди пешком, здоровее будешь.',
  },

  HashrateCommandService: {
    help: 'А название карты указать? Или мне всё за тебя додумывать как обычно?..',
    resultIntro: 'Вот смотри, что папка в газетке нашел:\n\n',
    gpuInfo: `
<b>{{title}}</b> 🎮
 • Hashrate: <b>{{hashrate}}</b> (ETC) | {{power}} | <a href="{{href}}">OC Settings</a>
 • Profit: {{profit}}/day
    `,
    gpuInfoSeparator: '\n\n',
    gpuNotFound: 'Это что за хрень? Не знаю такой. Чего умного спросил бы лучше, а?',
  },

  HelpCommandService: {
    introMsg: `Всем здарова! Батя много чего видел и знает, обращайтесь.`,
    helpMsg: `
А ты не мелкий ли, бл*ть, чтобы Батей командовать? Но да ладно, смотри, что Батя умеет:

<b>/help</b> — помощь по командам;
<b>/hashrate 1660ti</b> (/hash /хеш) — показывает хешрейт, настройки и информацию по карте. Жми Tab (или долгое нажатие на телефоне) чтобы дописать в команду название карты;
<b>/rate</b> (/курс) — курс валют;
<b>/bestchange</b> — курс ETH на обменниках;
<b>/fuel</b> (/бензин) — где сейчас есть бензин на заправках;

А то ты думал, не пальцем деланный!
    `,
  },

  JokeCommandService: {
    jokes: [
      'Всему тебя учить бл*ть...',
      'Помни батину мудрость!',
      'Спасибо, как говорится, не булькает 🍺',
      'Мал ещё такое знать-то!',
      'Я майнил, когда ты ещё под стол ходил!',
      'Ну хоть бы раз бате с ригом помог, а?',
      '"Не имей 100 рублей, а имей 100 хешей!" как говорится!',
      'Вот в кого ты у меня такой дурень, а? Хотя знаю, мамке только не говори...',
      'А могут ли бобры... майнить? А? Да неее, бред какой-то...',
      'Это БАЗА!...',
      'Чёт похолодало... Зима близко...',
    ],
  },

  RateCommandService: {
    priceDirectionUp: '↗️️',
    priceDirectionDown: '↘️️',
    rateInfo: `
Вот что по телику давеча сказали:

<b>USD/RUB</b> 💰
 • ЦБ/Биржа: <b>{{rub.official}} ₽</b>
 • Aliexpress: <b>{{rub.aliexpress}} ₽</b>
 • USDT/RUB: <b>{{rub.bestchange}} ₽</b> (Bestchange)

`,
    rateInfoRow: `<b>{{ticker.symbol}}</b>: <b>\${{ticker.price}}</b> ({{ticker.priceDiffPercentage}}%) {{ticker.priceDirection}}\n`,
  },
};
