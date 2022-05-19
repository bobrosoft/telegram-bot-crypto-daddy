export const translationsRU = {
  BestchangeCommandService: {
    resultIntro: 'Вот что на рынке сегодня видел:',
    rateInfo: `<b>{{fromSymbol}}/{{toSymbol}}</b> (<a href="{{url}}">Bestchange.ru</a>):`,
    rateInfoRow: ` • {{title}}: <b>{{price}} ₽</b>`,
  },

  HashrateCommandService: {
    help: 'А название карты указать? Или мне всё за тебя додумывать как обычно?..',
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
<b>/hashrate 1660ti</b> (/hash /хеш) — показывает хешрейт, настройки и информацию по карте. Жми Tab (или долгое нажатие на телефоне) чтобы дописать в команду название карты;
<b>/rate</b> (/курс) — курс валют;
<b>/bestchange</b> — курс ETH на обменниках;

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
    priceDirectionUp: '▲',
    priceDirectionDown: '🔻',
    rateInfo: `
Вот что по телику давеча сказали:

<b>USD/RUB</b> 💰
 • ЦБ/Биржа: <b>{{rub.official}} ₽</b>
 • Aliexpress: <b>{{rub.aliexpress}} ₽</b>
 • USDT/RUB: <b>{{rub.bestchange}} ₽</b> (Bestchange)

<b>BTC</b>: <b>\${{btc.price}}</b> {{btc.priceDirection}}
<b>ETH</b>: <b>\${{eth.price}}</b> {{eth.priceDirection}}
<b>ETC</b>: <b>\${{etc.price}}</b> {{etc.priceDirection}}
<b>ERG</b>: <b>\${{erg.price}}</b> {{erg.priceDirection}}
    `,
  },
};
