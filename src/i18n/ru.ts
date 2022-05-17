export const translationsRU = {
  HashrateCommandService: {
    help: 'А название карты указать? Или мне всё за тебя додумывать как обычно?',
    resultIntro: 'Вот смотри, что папка в газетке нашел:\n\n',
    gpuInfo: `
<b>{{title}}</b> 🎮
 • Hashrate: <b>{{hashrate}}</b> (ETH) | {{power}} | <a href="{{href}}">OC Settings</a>
 • Profit: {{profit}}/day (ROI: {{roi}})
    `,
    gpuInfoSeparator: '\n\n',
    gpuNotFound: 'Это что за хрень? Не знаю такой. Чего умного спросил бы лучше, а?',
  },

  HelpCommandService: {
    introMsg: `Всем здарова! Батя много чего видел и знает, обращайтесь.`,
    helpMsg: `
А ты не мелкий ли, бл*ть, чтобы Батей командовать? Но да ладно, смотри, что Батя умеет:
<b>/help</b> — помощь по командам;
<b>/hashrate 1660ti</b> (/hash /хеш) — показывает хешрейт, настройки и информацию по карте;
<b>/rate</b> (/курс) — курс валют (в разработке);
<b>/шутка</b>

А то ты думал, не пальцем деланный!
    `,
  },

  JokeCommandService: {
    jokes: [
      'Всему тебя учить бл*ть',
      'Помни батину мудрость!',
      'Спасибо, как говорится, не булькает 🍺',
      'Мал ещё такое знать-то',
      'Я майнил, когда ты ещё под стол ходил',
      'Ну хоть бы раз бате с ригом помог, а?',
      '"Не имей 100 рублей, а имей 100 хешей!" как говорится',
      'Вот в кого ты у меня такой дурень, а? Хотя знаю, мамке только не говори...',
      'А могут ли бобры... майнить? А? Да неее, бред какой-то...',
      'Это БАЗА!...',
    ],
  },

  RateCommandService: {
    rateInfo: `
Вот что в программе "Время" сказали:

<b>USD/RUB</b> 💰
 • ЦБ/Биржа: <b>{{rubOfficial}} ₽</b>
 • Aliexpress: <b>{{rubAliexpress}} ₽</b>
 • USDT/RUB: <b>{{rubBestchange}} ₽</b> (Bestchange)

<b>ETH</b>: <b>\${{ethUsd}}</b>
<b>ETC</b>: <b>\${{etcUsd}}</b>
<b>ERG</b>: <b>\${{ergUsd}}</b>
    `,
  },
};
