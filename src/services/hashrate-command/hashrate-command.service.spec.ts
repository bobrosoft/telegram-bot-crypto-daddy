import {Response} from 'node-fetch';
import {Telegraf} from 'telegraf';
import {container} from 'tsyringe';
import {FetchToken, TFunctionToken} from '../../misc/injection-tokens';
import {TelegrafContextMock, TelegrafMock} from '../../misc/telegraf-mocks';
import {JokeCommandService} from '../joke-command/joke-command.service';
import {LoggerService} from '../logger/logger.service';
import {LoggerServiceMock} from '../logger/logger.service.mock';
import {HashrateCommandService} from './hashrate-command.service';

describe('HashrateCommandService', () => {
  let ctxMock: TelegrafContextMock;
  let telegrafMock: TelegrafMock;

  beforeEach(() => {
    container.clearInstances();

    container.registerInstance(TFunctionToken, (key, options?: any) => {
      switch (key) {
        case 'HashrateCommandService.help':
          return 'help';

        case 'HashrateCommandService.gpuInfo':
          return options?.title;

        case 'HashrateCommandService.gpuNotFound':
          return 'gpuNotFound';

        default:
          return '';
      }
    });

    container.registerInstance(LoggerService, new LoggerServiceMock());

    container.registerInstance(JokeCommandService, {tellJoke: () => Promise.resolve()} as any);

    ctxMock = new TelegrafContextMock();
    telegrafMock = new TelegrafMock(ctxMock);
    container.registerInstance(Telegraf, telegrafMock as any);

    container.registerInstance(FetchToken, (() => Promise.resolve(new Response(fetchResult2))) as any);
  });

  it('should answer on /hashrate command with help text', async () => {
    container.resolve(HashrateCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/hashrate');

    expect(ctxMock.replyWithHTML).toBeCalledWith('help');
  });

  it('should answer on /hashrate 3070ti command with miners info about GPU', async () => {
    container.resolve(HashrateCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/hashrate 3070ti');

    expect(ctxMock.replyWithHTML).toBeCalledWith('NVIDIA RTX 3070 Ti');
  });

  it('should answer on /hashrate 3060ti command with miners info about 2 GPUs', async () => {
    container.resolve(HashrateCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/hashrate 3060ti');

    expect(ctxMock.replyWithHTML).toBeCalledWith('NVIDIA RTX 3060 TiNVIDIA RTX 3060 Ti LHR');
  });

  it('should understand /hashrate 3070 ti variation of the command', async () => {
    container.resolve(HashrateCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/hashrate 3070 ti');

    expect(ctxMock.replyWithHTML).toBeCalledWith('NVIDIA RTX 3070 Ti');
  });

  it('should answer on /hashrate 666 command with "not found"', async () => {
    container.resolve(HashrateCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/hashrate 666');

    expect(ctxMock.replyWithHTML).toBeCalledWith('gpuNotFound');
  });
});

/* tslint:disable */
const fetchResult2 = `
<!DOCTYPE html>
<html lang="en">
  <head>
\t<!-- font -->
\t<link rel="preconnect" href="https://fonts.googleapis.com">
\t<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
\t<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
\t<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap" rel="stylesheet">
\t<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&family=Teko:wght@700&display=swap" rel="stylesheet">
\t<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&family=Teko:wght@700&display=swap" rel="stylesheet">
\t<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap" rel="stylesheet">
\t<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&family=Roboto:wght@300;700;900&family=Teko:wght@700&display=swap" rel="stylesheet">
\t<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&family=Roboto:wght@300;700&family=Teko:wght@700&display=swap" rel="stylesheet">
\t<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&family=Roboto:wght@300;700&family=Teko:wght@700&display=swap" rel="stylesheet">

\t<!-- Global site tag (gtag.js) - Google Analytics -->
\t<script async src="https://www.googletagmanager.com/gtag/js?id=G-E12G8MBEHK"></script>
\t<script>
\t  window.dataLayer = window.dataLayer || [];
\t  function gtag(){dataLayer.push(arguments);}
\t  gtag('js', new Date());

\t  gtag('config', 'G-E12G8MBEHK');
\t</script>
\t<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
\t\t<script>
\t\t$(document).ready(function(){
\t\t\t$('input[type="radio"]').click(function(){
                let zone = $(this).attr('name');
\t\t\t\tlet inputValue = $(this).attr("value");
\t\t\t\tlet targetBox = $("." + inputValue);
\t\t\t\t$("." + zone + ".box").not(targetBox).hide();
\t\t\t\t$(targetBox).show();
\t\t\t});
\t\t});
\t\t</script>
\t<script>
\t\tfunction copyToClipboard(element) {
\t\t  var $temp = $("<input>");
\t\t  $("body").append($temp);
\t\t  $temp.val($(element).text()).select();
\t\t  document.execCommand("copy");
\t\t  $temp.remove();
\t\t}
\t</script>
\t<title>Mining stats for Ethereum (ETH) - Hashrate.no</title>\t<script data-ad-client="ca-pub-1991132164675774" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/css/w3.css">
\t<link rel="stylesheet" type="text/css" title="default" href="/css/dark.css">\t<script src="sorttable.js"></script>
  </head>
 <body onload="set_style_from_cookie()" class="hr-background" style="margin: 0px; padding: 0px;">
\t<!-- info bar on top -->
\t<div class="w3-row-padding w3-border-bottom w3-border-top hr-border-infobar hr-background-infobar" style="font-size: 10px;padding-top: 0px; padding-bottom: 0px; z-index: 10000;">
\t\t<div class="w3-rest" style="text-align: center; padding-top: 1px;">
\t\tETH: <b>$2839</b> - EPOCH: 489 - Next EPOCH in 10 hours\t\t</div>
\t</div>

\t<!-- Sidebar -->
\t<div class="w3-sidebar w3-bar-block w3-border-right w3-black" style="display:none;padding-top: 30px;" id="mySidebar">
\t\t<button onclick="w3_close()" class="w3-bar-item w3-large w3-black w3-hover-red">Close &times;</button>
\t\t<a href="/" class="w3-bar-item w3-button w3-hover-red">GPUs</a>
\t\t<a href="/options" class="w3-bar-item w3-button w3-hover-red">MinerOptions</a>
\t\t<a href="/knowhow" class="w3-bar-item w3-button w3-hover-red">KnowHow</a>
\t\t<a href="/calc" class="w3-bar-item w3-button w3-hover-red">Calculator</a>
\t\t<a href="/tests" class="w3-bar-item w3-button w3-hover-red">Tests</a>
\t\t<a href="/miners" class="w3-bar-item w3-button w3-hover-red">Miners</a>
\t\t<a href="/pools" class="w3-bar-item w3-button w3-hover-red">Pools</a>
\t</div>



\t<div id="navbar" class="w3-row-padding w3-border-bottom hr-border-menu hr-background-menu" style="padding-top: 0px; padding-bottom: 5px; z-index: 10000;">
\t\t<div class="w3-mobile w3-hide-medium w3-hide-large" style="text-align: center; padding-top: 3px;padding-bottom: 3px">
\t\t\t<div>
\t\t\t\t<div style="float: left;padding: 0px;color:#ffffff;background: none;font-size:18px;" onclick="w3_open()">☰</div>
\t\t\t\t<a href="/"><img src="/gfx/footer_logo.png" /></a>
\t\t\t</div>
\t\t</div>
\t\t<div class="w3-rest w3-hide-small" style="text-align: center; padding-top: 3px;padding-bottom: 3px">
\t\t\t<a href="/"><img src="/gfx/footer_logo.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
\t\t\t<a class="menu_selected" href="/">GPUs</a><a class="menu" href="/options">MinerOptions</a><a class="menu" href="/knowhow">KnowHow</a><a class="menu" href="/calc">Calculator</a><a class="menu" href="/tests">Tests</a><a class="menu" href="/miners">Miners</a><a class="menu" href="/pools">Pools</a></div>\t</div>
\t<div class="content"></div><div class='w3-row'><div class='w3-col l12' style='background: transparent url("/gfx/header_gpus.png") 0% 0% no-repeat padding-box;opacity: 1;background-size: cover;background-position: top;padding-top: 90px;text-align: center;'><div class='hr-orange-header'>Setups for mining</div><div class='hr-focus-header'>Increase your earnings!</div><div class='hr-info-header'>We cover most aspects of GPU mining</div><div class='w3-col l12 w3-border-bottom hr-border-menu' style='text-align: center; padding-top: 90px;'><a class='menu' href='/'>All</a><a class='menu' href='/nvidia'>Nvidia</a><a class='menu' href='/amd'>AMD</a><a class='menu' href='/lhr'>LHR</a><a class='menu' href='/ampere'>Ampere</a><a class='menu' href='/turing'>Turing</a><a class='menu' href='/pascal'>Pascal</a><a class='menu' href='/rdna2'>RDNA 2</a><a class='menu' href='/rdna'>RDNA</a><a class='menu' href='/vega'>VEGA</a><a class='menu' href='/polaris'>Polaris</a><a class='menu' href='/ERG'>ERG</a><a class='menu' href='/ETC'>ETC</a><a class='menu_selected' href='/ETH'>ETH</a><a class='menu' href='/FLUX'>FLUX</a><a class='menu' href='/RVN'>RVN</a><a class='menu' href='/TON'>TON</a></div></div></div><div class='w3-row' style='background-color: #1D1D1D;padding-bottom: 20px;'><div class='w3-col l2 w3-hide-medium w3-hide-small' style='padding-top: 127px;padding-left: 10px;padding-right: 10px'><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1991132164675774"
     crossorigin="anonymous"></script>
<!-- Vertical Banner -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1991132164675774"
     data-ad-slot="4027229594"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script><br />&nbsp;</div><div class='w3-col l8 m12'><div class="w3-hide-small w3-hide-medium" style="padding-top: 4px;"><center><table class='sortable w3-table' style='max-width: 100%'><tr class='w3-border-bottom hr-border-gpulist'><th class='gpulist'>Model</th><th class='gpulist'>Coin</th><th class='sorttable_numeric gpulist'>Hashrate</th><th class='sorttable_numeric gpulist'>Power</th><th class='sorttable_numeric gpulist'>Efficiency</th><th class='sorttable_numeric gpulist'>Revenue</th><th class='sorttable_numeric gpulist'>ROI</th></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/3090ti'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3090 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>132.09 Mh/s</td><td class='gpulist'>338w</td><td class='gpulist'>0.39 Mh/w</td><td class='gpulist'><b>$4.15</b></td><td class='gpulist'>481 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/3090'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3090</a></td><td class='gpulist'>ETH</td><td class='gpulist'>124.09 Mh/s</td><td class='gpulist'>294w</td><td class='gpulist'>0.42 Mh/w</td><td class='gpulist'><b>$3.90</b></td><td class='gpulist'>384 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/VII'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD VII</a></td><td class='gpulist'>ETH</td><td class='gpulist'>108.50 Mh/s</td><td class='gpulist'>236w</td><td class='gpulist'>0.46 Mh/w</td><td class='gpulist'><b>$3.41</b></td><td class='gpulist'>205 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/A5000'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX A5000</a></td><td class='gpulist'>ETH</td><td class='gpulist'>101.78 Mh/s</td><td class='gpulist'>215w</td><td class='gpulist'>0.47 Mh/w</td><td class='gpulist'><b>$3.20</b></td><td class='gpulist'>703 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/3080'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3080</a></td><td class='gpulist'>ETH</td><td class='gpulist'>101.58 Mh/s</td><td class='gpulist'>224w</td><td class='gpulist'>0.45 Mh/w</td><td class='gpulist'><b>$3.19</b></td><td class='gpulist'>219 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/cmp90'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA CMP 90HX</a></td><td class='gpulist'>ETH</td><td class='gpulist'>100.16 Mh/s</td><td class='gpulist'>249w</td><td class='gpulist'>0.40 Mh/w</td><td class='gpulist'><b>$3.15</b></td><td class='gpulist'>508 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/3080ti'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3080 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>93.01 Mh/s</td><td class='gpulist'>275w</td><td class='gpulist'>0.34 Mh/w</td><td class='gpulist'><b>$2.92</b></td><td class='gpulist'>410 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/A4500'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX A4500</a></td><td class='gpulist'>ETH</td><td class='gpulist'>87.00 Mh/s</td><td class='gpulist'>178w</td><td class='gpulist'>0.49 Mh/w</td><td class='gpulist'><b>$2.74</b></td><td class='gpulist'>913 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/cmp70'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA CMP 70HX</a></td><td class='gpulist'>ETH</td><td class='gpulist'>81.60 Mh/s</td><td class='gpulist'>199w</td><td class='gpulist'>0.41 Mh/w</td><td class='gpulist'><b>$2.57</b></td><td class='gpulist'>545 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/3080lhr'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3080 LHR</a></td><td class='gpulist'>ETH</td><td class='gpulist'>76.80 Mh/s</td><td class='gpulist'>253w</td><td class='gpulist'>0.30 Mh/w</td><td class='gpulist'><b>$2.42</b></td><td class='gpulist'>414 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/bc160'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD BC-160</a></td><td class='gpulist'>ETH</td><td class='gpulist'>71.00 Mh/s</td><td class='gpulist'>130w</td><td class='gpulist'>0.55 Mh/w</td><td class='gpulist'><b>$2.23</b></td><td class='gpulist'>895 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/6800xt'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD RX 6800 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>63.20 Mh/s</td><td class='gpulist'>104w</td><td class='gpulist'>0.61 Mh/w</td><td class='gpulist'><b>$1.99</b></td><td class='gpulist'>327 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/6900xt'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD RX 6900 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.91 Mh/s</td><td class='gpulist'>143w</td><td class='gpulist'>0.44 Mh/w</td><td class='gpulist'><b>$1.98</b></td><td class='gpulist'>505 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/3060ti'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3060 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.42 Mh/s</td><td class='gpulist'>125w</td><td class='gpulist'>0.50 Mh/w</td><td class='gpulist'><b>$1.96</b></td><td class='gpulist'>203 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/3070'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3070</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.34 Mh/s</td><td class='gpulist'>115w</td><td class='gpulist'>0.54 Mh/w</td><td class='gpulist'><b>$1.96</b></td><td class='gpulist'>255 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/3070ti'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3070 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.22 Mh/s</td><td class='gpulist'>175w</td><td class='gpulist'>0.36 Mh/w</td><td class='gpulist'><b>$1.96</b></td><td class='gpulist'>306 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/308012'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3080 12GB</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.17 Mh/s</td><td class='gpulist'>251w</td><td class='gpulist'>0.25 Mh/w</td><td class='gpulist'><b>$1.96</b></td><td class='gpulist'>639 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/A4000'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX A4000</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.03 Mh/s</td><td class='gpulist'>124w</td><td class='gpulist'>0.50 Mh/w</td><td class='gpulist'><b>$1.95</b></td><td class='gpulist'>513 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/6800'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD RX 6800</a></td><td class='gpulist'>ETH</td><td class='gpulist'>61.01 Mh/s</td><td class='gpulist'>108w</td><td class='gpulist'>0.56 Mh/w</td><td class='gpulist'><b>$1.92</b></td><td class='gpulist'>302 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/2080ti'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 2080 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>57.46 Mh/s</td><td class='gpulist'>160w</td><td class='gpulist'>0.36 Mh/w</td><td class='gpulist'><b>$1.81</b></td><td class='gpulist'>719 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/5700'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD RX 5700</a></td><td class='gpulist'>ETH</td><td class='gpulist'>56.74 Mh/s</td><td class='gpulist'>135w</td><td class='gpulist'>0.42 Mh/w</td><td class='gpulist'><b>$1.78</b></td><td class='gpulist'>213 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/5700xt'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD RX 5700 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>56.44 Mh/s</td><td class='gpulist'>125w</td><td class='gpulist'>0.45 Mh/w</td><td class='gpulist'><b>$1.77</b></td><td class='gpulist'>254 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/vega56'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD VEGA 56</a></td><td class='gpulist'>ETH</td><td class='gpulist'>53.70 Mh/s</td><td class='gpulist'>175w</td><td class='gpulist'>0.31 Mh/w</td><td class='gpulist'><b>$1.69</b></td><td class='gpulist'>236 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/bc250'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD BC-250</a></td><td class='gpulist'>ETH</td><td class='gpulist'>50.64 Mh/s</td><td class='gpulist'>84w</td><td class='gpulist'>0.60 Mh/w</td><td class='gpulist'><b>$1.59</b></td><td class='gpulist'>627 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/vega64'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD VEGA 64</a></td><td class='gpulist'>ETH</td><td class='gpulist'>48.82 Mh/s</td><td class='gpulist'>170w</td><td class='gpulist'>0.29 Mh/w</td><td class='gpulist'><b>$1.54</b></td><td class='gpulist'>325 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/3070lhr'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3070 LHR</a></td><td class='gpulist'>ETH</td><td class='gpulist'>48.02 Mh/s</td><td class='gpulist'>111w</td><td class='gpulist'>0.43 Mh/w</td><td class='gpulist'><b>$1.51</b></td><td class='gpulist'>330 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/3060tilhr'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3060 Ti LHR</a></td><td class='gpulist'>ETH</td><td class='gpulist'>47.50 Mh/s</td><td class='gpulist'>121w</td><td class='gpulist'>0.39 Mh/w</td><td class='gpulist'><b>$1.49</b></td><td class='gpulist'>334 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/6700xt'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD RX 6700 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>46.95 Mh/s</td><td class='gpulist'>98w</td><td class='gpulist'>0.48 Mh/w</td><td class='gpulist'><b>$1.48</b></td><td class='gpulist'>324 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/2080s'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 2080 Super</a></td><td class='gpulist'>ETH</td><td class='gpulist'>46.00 Mh/s</td><td class='gpulist'>160w</td><td class='gpulist'>0.29 Mh/w</td><td class='gpulist'><b>$1.45</b></td><td class='gpulist'>483 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/2070s'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 2070 Super</a></td><td class='gpulist'>ETH</td><td class='gpulist'>45.32 Mh/s</td><td class='gpulist'>111w</td><td class='gpulist'>0.41 Mh/w</td><td class='gpulist'><b>$1.43</b></td><td class='gpulist'>350 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/2070'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 2070</a></td><td class='gpulist'>ETH</td><td class='gpulist'>45.13 Mh/s</td><td class='gpulist'>103w</td><td class='gpulist'>0.44 Mh/w</td><td class='gpulist'><b>$1.42</b></td><td class='gpulist'>352 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/2080'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 2080</a></td><td class='gpulist'>ETH</td><td class='gpulist'>45.10 Mh/s</td><td class='gpulist'>116w</td><td class='gpulist'>0.39 Mh/w</td><td class='gpulist'><b>$1.42</b></td><td class='gpulist'>563 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/p102'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA P102-100</a></td><td class='gpulist'>ETH</td><td class='gpulist'>45.00 Mh/s</td><td class='gpulist'>190w</td><td class='gpulist'>0.24 Mh/w</td><td class='gpulist'><b>$1.42</b></td><td class='gpulist'>551 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/2060s'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 2060 Super</a></td><td class='gpulist'>ETH</td><td class='gpulist'>44.04 Mh/s</td><td class='gpulist'>105w</td><td class='gpulist'>0.42 Mh/w</td><td class='gpulist'><b>$1.38</b></td><td class='gpulist'>288 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/A2000'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX A2000</a></td><td class='gpulist'>ETH</td><td class='gpulist'>43.25 Mh/s</td><td class='gpulist'>67w</td><td class='gpulist'>0.65 Mh/w</td><td class='gpulist'><b>$1.36</b></td><td class='gpulist'>477 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/1080ti'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA GTX 1080 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>43.23 Mh/s</td><td class='gpulist'>198w</td><td class='gpulist'>0.22 Mh/w</td><td class='gpulist'><b>$1.36</b></td><td class='gpulist'>514 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/5600xt'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD RX 5600 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>41.66 Mh/s</td><td class='gpulist'>110w</td><td class='gpulist'>0.38 Mh/w</td><td class='gpulist'><b>$1.31</b></td><td class='gpulist'>213 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/3060'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3060</a></td><td class='gpulist'>ETH</td><td class='gpulist'>41.66 Mh/s</td><td class='gpulist'>110w</td><td class='gpulist'>0.38 Mh/w</td><td class='gpulist'><b>$1.31</b></td><td class='gpulist'>251 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/3060v2'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3060 LHR v2</a></td><td class='gpulist'>ETH</td><td class='gpulist'>38.71 Mh/s</td><td class='gpulist'>112w</td><td class='gpulist'>0.35 Mh/w</td><td class='gpulist'><b>$1.22</b></td><td class='gpulist'>270 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/p104'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA P104-100</a></td><td class='gpulist'>ETH</td><td class='gpulist'>36.27 Mh/s</td><td class='gpulist'>135w</td><td class='gpulist'>0.27 Mh/w</td><td class='gpulist'><b>$1.14</b></td><td class='gpulist'>350 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/2060'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 2060</a></td><td class='gpulist'>ETH</td><td class='gpulist'>33.85 Mh/s</td><td class='gpulist'>81w</td><td class='gpulist'>0.42 Mh/w</td><td class='gpulist'><b>$1.06</b></td><td class='gpulist'>375 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/1080'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA GTX 1080</a></td><td class='gpulist'>ETH</td><td class='gpulist'>33.84 Mh/s</td><td class='gpulist'>135w</td><td class='gpulist'>0.25 Mh/w</td><td class='gpulist'><b>$1.06</b></td><td class='gpulist'>564 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/206012'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 2060 12GB</a></td><td class='gpulist'>ETH</td><td class='gpulist'>33.61 Mh/s</td><td class='gpulist'>86w</td><td class='gpulist'>0.39 Mh/w</td><td class='gpulist'><b>$1.06</b></td><td class='gpulist'>454 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/1070ti'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA GTX 1070 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>33.46 Mh/s</td><td class='gpulist'>135w</td><td class='gpulist'>0.25 Mh/w</td><td class='gpulist'><b>$1.05</b></td><td class='gpulist'>427 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/570'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD RX 570</a></td><td class='gpulist'>ETH</td><td class='gpulist'>32.32 Mh/s</td><td class='gpulist'>135w</td><td class='gpulist'>0.24 Mh/w</td><td class='gpulist'><b>$1.02</b></td><td class='gpulist'>206 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/580'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD RX 580</a></td><td class='gpulist'>ETH</td><td class='gpulist'>32.22 Mh/s</td><td class='gpulist'>135w</td><td class='gpulist'>0.24 Mh/w</td><td class='gpulist'><b>$1.01</b></td><td class='gpulist'>226 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/6600xt'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD RX 6600 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>31.88 Mh/s</td><td class='gpulist'>68w</td><td class='gpulist'>0.47 Mh/w</td><td class='gpulist'><b>$1.00</b></td><td class='gpulist'>378 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/1660s'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA GTX 1660 Super</a></td><td class='gpulist'>ETH</td><td class='gpulist'>31.74 Mh/s</td><td class='gpulist'>75w</td><td class='gpulist'>0.42 Mh/w</td><td class='gpulist'><b>$1.00</b></td><td class='gpulist'>229 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/1660ti'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA GTX 1660 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>31.10 Mh/s</td><td class='gpulist'>60w</td><td class='gpulist'>0.52 Mh/w</td><td class='gpulist'><b>$0.98</b></td><td class='gpulist'>286 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/470'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD RX 470</a></td><td class='gpulist'>ETH</td><td class='gpulist'>31.00 Mh/s</td><td class='gpulist'>130w</td><td class='gpulist'>0.24 Mh/w</td><td class='gpulist'><b>$0.97</b></td><td class='gpulist'>246 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/6600'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD RX 6600</a></td><td class='gpulist'>ETH</td><td class='gpulist'>28.76 Mh/s</td><td class='gpulist'>68w</td><td class='gpulist'>0.42 Mh/w</td><td class='gpulist'><b>$0.90</b></td><td class='gpulist'>364 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/1070'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA GTX 1070</a></td><td class='gpulist'>ETH</td><td class='gpulist'>28.00 Mh/s</td><td class='gpulist'>120w</td><td class='gpulist'>0.23 Mh/w</td><td class='gpulist'><b>$0.88</b></td><td class='gpulist'>432 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/5500xt'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' />AMD RX 5500 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>27.24 Mh/s</td><td class='gpulist'>65w</td><td class='gpulist'>0.42 Mh/w</td><td class='gpulist'><b>$0.86</b></td><td class='gpulist'>232 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/1660'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA GTX 1660</a></td><td class='gpulist'>ETH</td><td class='gpulist'>26.50 Mh/s</td><td class='gpulist'>80w</td><td class='gpulist'>0.33 Mh/w</td><td class='gpulist'><b>$0.83</b></td><td class='gpulist'>263 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/p106'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA P106-100</a></td><td class='gpulist'>ETH</td><td class='gpulist'>24.04 Mh/s</td><td class='gpulist'>86w</td><td class='gpulist'>0.28 Mh/w</td><td class='gpulist'><b>$0.76</b></td><td class='gpulist'>396 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/1060'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA GTX 1060</a></td><td class='gpulist'>ETH</td><td class='gpulist'>22.00 Mh/s</td><td class='gpulist'>85w</td><td class='gpulist'>0.26 Mh/w</td><td class='gpulist'><b>$0.69</b></td><td class='gpulist'>361 days</td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><a class='gpulist' href='/3050'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' />NVIDIA RTX 3050</a></td><td class='gpulist'>ETH</td><td class='gpulist'>16.80 Mh/s</td><td class='gpulist'>67w</td><td class='gpulist'>0.25 Mh/w</td><td class='gpulist'><b>$0.53</b></td><td class='gpulist'>471 days</td></tr></table></center></div><div class="w3-container w3-hide-small w3-hide-large" style="padding-top: 4px;"><center><table class='sortable w3-table' style='max-width: 100%'><tr class='w3-border-bottom hr-border-gpulist'><th class='gpulist'>Model</th><th class='gpulist'>Coin</th><th class='sorttable_numeric gpulist'>Hashrate</th><th class='sorttable_numeric gpulist'>Power</th><th class='sorttable_numeric gpulist'>Revenue</th></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/3090ti'>NVIDIA RTX 3090 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>132.09 Mh/s</td><td class='gpulist'>338w</td><td class='gpulist'><b>$4.15</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/3090'>NVIDIA RTX 3090</a></td><td class='gpulist'>ETH</td><td class='gpulist'>124.09 Mh/s</td><td class='gpulist'>294w</td><td class='gpulist'><b>$3.90</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/VII'>AMD VII</a></td><td class='gpulist'>ETH</td><td class='gpulist'>108.50 Mh/s</td><td class='gpulist'>236w</td><td class='gpulist'><b>$3.41</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/A5000'>NVIDIA RTX A5000</a></td><td class='gpulist'>ETH</td><td class='gpulist'>101.78 Mh/s</td><td class='gpulist'>215w</td><td class='gpulist'><b>$3.20</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/3080'>NVIDIA RTX 3080</a></td><td class='gpulist'>ETH</td><td class='gpulist'>101.58 Mh/s</td><td class='gpulist'>224w</td><td class='gpulist'><b>$3.19</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/cmp90'>NVIDIA CMP 90HX</a></td><td class='gpulist'>ETH</td><td class='gpulist'>100.16 Mh/s</td><td class='gpulist'>249w</td><td class='gpulist'><b>$3.15</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/3080ti'>NVIDIA RTX 3080 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>93.01 Mh/s</td><td class='gpulist'>275w</td><td class='gpulist'><b>$2.92</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/A4500'>NVIDIA RTX A4500</a></td><td class='gpulist'>ETH</td><td class='gpulist'>87.00 Mh/s</td><td class='gpulist'>178w</td><td class='gpulist'><b>$2.74</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/cmp70'>NVIDIA CMP 70HX</a></td><td class='gpulist'>ETH</td><td class='gpulist'>81.60 Mh/s</td><td class='gpulist'>199w</td><td class='gpulist'><b>$2.57</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/3080lhr'>NVIDIA RTX 3080 LHR</a></td><td class='gpulist'>ETH</td><td class='gpulist'>76.80 Mh/s</td><td class='gpulist'>253w</td><td class='gpulist'><b>$2.42</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/bc160'>AMD BC-160</a></td><td class='gpulist'>ETH</td><td class='gpulist'>71.00 Mh/s</td><td class='gpulist'>130w</td><td class='gpulist'><b>$2.23</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/6800xt'>AMD RX 6800 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>63.20 Mh/s</td><td class='gpulist'>104w</td><td class='gpulist'><b>$1.99</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/6900xt'>AMD RX 6900 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.91 Mh/s</td><td class='gpulist'>143w</td><td class='gpulist'><b>$1.98</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/3060ti'>NVIDIA RTX 3060 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.42 Mh/s</td><td class='gpulist'>125w</td><td class='gpulist'><b>$1.96</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/3070'>NVIDIA RTX 3070</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.34 Mh/s</td><td class='gpulist'>115w</td><td class='gpulist'><b>$1.96</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/3070ti'>NVIDIA RTX 3070 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.22 Mh/s</td><td class='gpulist'>175w</td><td class='gpulist'><b>$1.96</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/308012'>NVIDIA RTX 3080 12GB</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.17 Mh/s</td><td class='gpulist'>251w</td><td class='gpulist'><b>$1.96</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/A4000'>NVIDIA RTX A4000</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.03 Mh/s</td><td class='gpulist'>124w</td><td class='gpulist'><b>$1.95</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/6800'>AMD RX 6800</a></td><td class='gpulist'>ETH</td><td class='gpulist'>61.01 Mh/s</td><td class='gpulist'>108w</td><td class='gpulist'><b>$1.92</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/2080ti'>NVIDIA RTX 2080 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>57.46 Mh/s</td><td class='gpulist'>160w</td><td class='gpulist'><b>$1.81</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/5700'>AMD RX 5700</a></td><td class='gpulist'>ETH</td><td class='gpulist'>56.74 Mh/s</td><td class='gpulist'>135w</td><td class='gpulist'><b>$1.78</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/5700xt'>AMD RX 5700 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>56.44 Mh/s</td><td class='gpulist'>125w</td><td class='gpulist'><b>$1.77</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/vega56'>AMD VEGA 56</a></td><td class='gpulist'>ETH</td><td class='gpulist'>53.70 Mh/s</td><td class='gpulist'>175w</td><td class='gpulist'><b>$1.69</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/bc250'>AMD BC-250</a></td><td class='gpulist'>ETH</td><td class='gpulist'>50.64 Mh/s</td><td class='gpulist'>84w</td><td class='gpulist'><b>$1.59</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/vega64'>AMD VEGA 64</a></td><td class='gpulist'>ETH</td><td class='gpulist'>48.82 Mh/s</td><td class='gpulist'>170w</td><td class='gpulist'><b>$1.54</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/3070lhr'>NVIDIA RTX 3070 LHR</a></td><td class='gpulist'>ETH</td><td class='gpulist'>48.02 Mh/s</td><td class='gpulist'>111w</td><td class='gpulist'><b>$1.51</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/3060tilhr'>NVIDIA RTX 3060 Ti LHR</a></td><td class='gpulist'>ETH</td><td class='gpulist'>47.50 Mh/s</td><td class='gpulist'>121w</td><td class='gpulist'><b>$1.49</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/6700xt'>AMD RX 6700 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>46.95 Mh/s</td><td class='gpulist'>98w</td><td class='gpulist'><b>$1.48</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/2080s'>NVIDIA RTX 2080 Super</a></td><td class='gpulist'>ETH</td><td class='gpulist'>46.00 Mh/s</td><td class='gpulist'>160w</td><td class='gpulist'><b>$1.45</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/2070s'>NVIDIA RTX 2070 Super</a></td><td class='gpulist'>ETH</td><td class='gpulist'>45.32 Mh/s</td><td class='gpulist'>111w</td><td class='gpulist'><b>$1.43</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/2070'>NVIDIA RTX 2070</a></td><td class='gpulist'>ETH</td><td class='gpulist'>45.13 Mh/s</td><td class='gpulist'>103w</td><td class='gpulist'><b>$1.42</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/2080'>NVIDIA RTX 2080</a></td><td class='gpulist'>ETH</td><td class='gpulist'>45.10 Mh/s</td><td class='gpulist'>116w</td><td class='gpulist'><b>$1.42</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/p102'>NVIDIA P102-100</a></td><td class='gpulist'>ETH</td><td class='gpulist'>45.00 Mh/s</td><td class='gpulist'>190w</td><td class='gpulist'><b>$1.42</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/2060s'>NVIDIA RTX 2060 Super</a></td><td class='gpulist'>ETH</td><td class='gpulist'>44.04 Mh/s</td><td class='gpulist'>105w</td><td class='gpulist'><b>$1.38</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/A2000'>NVIDIA RTX A2000</a></td><td class='gpulist'>ETH</td><td class='gpulist'>43.25 Mh/s</td><td class='gpulist'>67w</td><td class='gpulist'><b>$1.36</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/1080ti'>NVIDIA GTX 1080 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>43.23 Mh/s</td><td class='gpulist'>198w</td><td class='gpulist'><b>$1.36</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/5600xt'>AMD RX 5600 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>41.66 Mh/s</td><td class='gpulist'>110w</td><td class='gpulist'><b>$1.31</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/3060'>NVIDIA RTX 3060</a></td><td class='gpulist'>ETH</td><td class='gpulist'>41.66 Mh/s</td><td class='gpulist'>110w</td><td class='gpulist'><b>$1.31</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/3060v2'>NVIDIA RTX 3060 LHR v2</a></td><td class='gpulist'>ETH</td><td class='gpulist'>38.71 Mh/s</td><td class='gpulist'>112w</td><td class='gpulist'><b>$1.22</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/p104'>NVIDIA P104-100</a></td><td class='gpulist'>ETH</td><td class='gpulist'>36.27 Mh/s</td><td class='gpulist'>135w</td><td class='gpulist'><b>$1.14</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/2060'>NVIDIA RTX 2060</a></td><td class='gpulist'>ETH</td><td class='gpulist'>33.85 Mh/s</td><td class='gpulist'>81w</td><td class='gpulist'><b>$1.06</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/1080'>NVIDIA GTX 1080</a></td><td class='gpulist'>ETH</td><td class='gpulist'>33.84 Mh/s</td><td class='gpulist'>135w</td><td class='gpulist'><b>$1.06</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/206012'>NVIDIA RTX 2060 12GB</a></td><td class='gpulist'>ETH</td><td class='gpulist'>33.61 Mh/s</td><td class='gpulist'>86w</td><td class='gpulist'><b>$1.06</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/1070ti'>NVIDIA GTX 1070 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>33.46 Mh/s</td><td class='gpulist'>135w</td><td class='gpulist'><b>$1.05</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/570'>AMD RX 570</a></td><td class='gpulist'>ETH</td><td class='gpulist'>32.32 Mh/s</td><td class='gpulist'>135w</td><td class='gpulist'><b>$1.02</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/580'>AMD RX 580</a></td><td class='gpulist'>ETH</td><td class='gpulist'>32.22 Mh/s</td><td class='gpulist'>135w</td><td class='gpulist'><b>$1.01</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/6600xt'>AMD RX 6600 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>31.88 Mh/s</td><td class='gpulist'>68w</td><td class='gpulist'><b>$1.00</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/1660s'>NVIDIA GTX 1660 Super</a></td><td class='gpulist'>ETH</td><td class='gpulist'>31.74 Mh/s</td><td class='gpulist'>75w</td><td class='gpulist'><b>$1.00</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/1660ti'>NVIDIA GTX 1660 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>31.10 Mh/s</td><td class='gpulist'>60w</td><td class='gpulist'><b>$0.98</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/470'>AMD RX 470</a></td><td class='gpulist'>ETH</td><td class='gpulist'>31.00 Mh/s</td><td class='gpulist'>130w</td><td class='gpulist'><b>$0.97</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/6600'>AMD RX 6600</a></td><td class='gpulist'>ETH</td><td class='gpulist'>28.76 Mh/s</td><td class='gpulist'>68w</td><td class='gpulist'><b>$0.90</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/1070'>NVIDIA GTX 1070</a></td><td class='gpulist'>ETH</td><td class='gpulist'>28.00 Mh/s</td><td class='gpulist'>120w</td><td class='gpulist'><b>$0.88</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/7db634481a790d9537de013cf3a82357.png' /><a class='gpulist' href='/5500xt'>AMD RX 5500 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>27.24 Mh/s</td><td class='gpulist'>65w</td><td class='gpulist'><b>$0.86</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/1660'>NVIDIA GTX 1660</a></td><td class='gpulist'>ETH</td><td class='gpulist'>26.50 Mh/s</td><td class='gpulist'>80w</td><td class='gpulist'><b>$0.83</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/p106'>NVIDIA P106-100</a></td><td class='gpulist'>ETH</td><td class='gpulist'>24.04 Mh/s</td><td class='gpulist'>86w</td><td class='gpulist'><b>$0.76</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/1060'>NVIDIA GTX 1060</a></td><td class='gpulist'>ETH</td><td class='gpulist'>22.00 Mh/s</td><td class='gpulist'>85w</td><td class='gpulist'><b>$0.69</b></td></tr><tr class='w3-border-bottom hr-border-gpulist'><td class='list'><img style='padding-right: 15px;' src='https://img.hashrate.no/c4e4b28f7bbec4d513593bd7b20f32ae.png' /><a class='gpulist' href='/3050'>NVIDIA RTX 3050</a></td><td class='gpulist'>ETH</td><td class='gpulist'>16.80 Mh/s</td><td class='gpulist'>67w</td><td class='gpulist'><b>$0.53</b></td></tr></table></center></div><div class="w3-container w3-hide-medium w3-hide-large" style="padding-top: 4px;"><center><table class='sortable w3-table' style='max-width: 100%'><tr class='w3-border-bottom hr-border-gpulist'><th class='gpulist'>Model</th><th class='gpulist'>Coin</th><th class='sorttable_numeric gpulist'>Hashrate</th><th class='sorttable_numeric gpulist'>Revenue</th></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/3090ti'>NVIDIA RTX 3090 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>132.09 Mh/s</td><td class='gpulist'><b>$4.15</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/3090'>NVIDIA RTX 3090</a></td><td class='gpulist'>ETH</td><td class='gpulist'>124.09 Mh/s</td><td class='gpulist'><b>$3.90</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/VII'>AMD VII</a></td><td class='gpulist'>ETH</td><td class='gpulist'>108.50 Mh/s</td><td class='gpulist'><b>$3.41</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/A5000'>NVIDIA RTX A5000</a></td><td class='gpulist'>ETH</td><td class='gpulist'>101.78 Mh/s</td><td class='gpulist'><b>$3.20</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/3080'>NVIDIA RTX 3080</a></td><td class='gpulist'>ETH</td><td class='gpulist'>101.58 Mh/s</td><td class='gpulist'><b>$3.19</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/cmp90'>NVIDIA CMP 90HX</a></td><td class='gpulist'>ETH</td><td class='gpulist'>100.16 Mh/s</td><td class='gpulist'><b>$3.15</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/3080ti'>NVIDIA RTX 3080 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>93.01 Mh/s</td><td class='gpulist'><b>$2.92</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/A4500'>NVIDIA RTX A4500</a></td><td class='gpulist'>ETH</td><td class='gpulist'>87.00 Mh/s</td><td class='gpulist'><b>$2.74</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/cmp70'>NVIDIA CMP 70HX</a></td><td class='gpulist'>ETH</td><td class='gpulist'>81.60 Mh/s</td><td class='gpulist'><b>$2.57</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/3080lhr'>NVIDIA RTX 3080 LHR</a></td><td class='gpulist'>ETH</td><td class='gpulist'>76.80 Mh/s</td><td class='gpulist'><b>$2.42</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/bc160'>AMD BC-160</a></td><td class='gpulist'>ETH</td><td class='gpulist'>71.00 Mh/s</td><td class='gpulist'><b>$2.23</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/6800xt'>AMD RX 6800 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>63.20 Mh/s</td><td class='gpulist'><b>$1.99</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/6900xt'>AMD RX 6900 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.91 Mh/s</td><td class='gpulist'><b>$1.98</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/3060ti'>NVIDIA RTX 3060 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.42 Mh/s</td><td class='gpulist'><b>$1.96</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/3070'>NVIDIA RTX 3070</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.34 Mh/s</td><td class='gpulist'><b>$1.96</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/3070ti'>NVIDIA RTX 3070 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.22 Mh/s</td><td class='gpulist'><b>$1.96</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/308012'>NVIDIA RTX 3080 12GB</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.17 Mh/s</td><td class='gpulist'><b>$1.96</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/A4000'>NVIDIA RTX A4000</a></td><td class='gpulist'>ETH</td><td class='gpulist'>62.03 Mh/s</td><td class='gpulist'><b>$1.95</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/6800'>AMD RX 6800</a></td><td class='gpulist'>ETH</td><td class='gpulist'>61.01 Mh/s</td><td class='gpulist'><b>$1.92</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/2080ti'>NVIDIA RTX 2080 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>57.46 Mh/s</td><td class='gpulist'><b>$1.81</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/5700'>AMD RX 5700</a></td><td class='gpulist'>ETH</td><td class='gpulist'>56.74 Mh/s</td><td class='gpulist'><b>$1.78</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/5700xt'>AMD RX 5700 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>56.44 Mh/s</td><td class='gpulist'><b>$1.77</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/vega56'>AMD VEGA 56</a></td><td class='gpulist'>ETH</td><td class='gpulist'>53.70 Mh/s</td><td class='gpulist'><b>$1.69</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/bc250'>AMD BC-250</a></td><td class='gpulist'>ETH</td><td class='gpulist'>50.64 Mh/s</td><td class='gpulist'><b>$1.59</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/vega64'>AMD VEGA 64</a></td><td class='gpulist'>ETH</td><td class='gpulist'>48.82 Mh/s</td><td class='gpulist'><b>$1.54</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/3070lhr'>NVIDIA RTX 3070 LHR</a></td><td class='gpulist'>ETH</td><td class='gpulist'>48.02 Mh/s</td><td class='gpulist'><b>$1.51</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/3060tilhr'>NVIDIA RTX 3060 Ti LHR</a></td><td class='gpulist'>ETH</td><td class='gpulist'>47.50 Mh/s</td><td class='gpulist'><b>$1.49</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/6700xt'>AMD RX 6700 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>46.95 Mh/s</td><td class='gpulist'><b>$1.48</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/2080s'>NVIDIA RTX 2080 Super</a></td><td class='gpulist'>ETH</td><td class='gpulist'>46.00 Mh/s</td><td class='gpulist'><b>$1.45</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/2070s'>NVIDIA RTX 2070 Super</a></td><td class='gpulist'>ETH</td><td class='gpulist'>45.32 Mh/s</td><td class='gpulist'><b>$1.43</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/2070'>NVIDIA RTX 2070</a></td><td class='gpulist'>ETH</td><td class='gpulist'>45.13 Mh/s</td><td class='gpulist'><b>$1.42</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/2080'>NVIDIA RTX 2080</a></td><td class='gpulist'>ETH</td><td class='gpulist'>45.10 Mh/s</td><td class='gpulist'><b>$1.42</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/p102'>NVIDIA P102-100</a></td><td class='gpulist'>ETH</td><td class='gpulist'>45.00 Mh/s</td><td class='gpulist'><b>$1.42</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/2060s'>NVIDIA RTX 2060 Super</a></td><td class='gpulist'>ETH</td><td class='gpulist'>44.04 Mh/s</td><td class='gpulist'><b>$1.38</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/A2000'>NVIDIA RTX A2000</a></td><td class='gpulist'>ETH</td><td class='gpulist'>43.25 Mh/s</td><td class='gpulist'><b>$1.36</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/1080ti'>NVIDIA GTX 1080 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>43.23 Mh/s</td><td class='gpulist'><b>$1.36</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/5600xt'>AMD RX 5600 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>41.66 Mh/s</td><td class='gpulist'><b>$1.31</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/3060'>NVIDIA RTX 3060</a></td><td class='gpulist'>ETH</td><td class='gpulist'>41.66 Mh/s</td><td class='gpulist'><b>$1.31</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/3060v2'>NVIDIA RTX 3060 LHR v2</a></td><td class='gpulist'>ETH</td><td class='gpulist'>38.71 Mh/s</td><td class='gpulist'><b>$1.22</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/p104'>NVIDIA P104-100</a></td><td class='gpulist'>ETH</td><td class='gpulist'>36.27 Mh/s</td><td class='gpulist'><b>$1.14</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/2060'>NVIDIA RTX 2060</a></td><td class='gpulist'>ETH</td><td class='gpulist'>33.85 Mh/s</td><td class='gpulist'><b>$1.06</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/1080'>NVIDIA GTX 1080</a></td><td class='gpulist'>ETH</td><td class='gpulist'>33.84 Mh/s</td><td class='gpulist'><b>$1.06</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/206012'>NVIDIA RTX 2060 12GB</a></td><td class='gpulist'>ETH</td><td class='gpulist'>33.61 Mh/s</td><td class='gpulist'><b>$1.06</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/1070ti'>NVIDIA GTX 1070 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>33.46 Mh/s</td><td class='gpulist'><b>$1.05</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/570'>AMD RX 570</a></td><td class='gpulist'>ETH</td><td class='gpulist'>32.32 Mh/s</td><td class='gpulist'><b>$1.02</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/580'>AMD RX 580</a></td><td class='gpulist'>ETH</td><td class='gpulist'>32.22 Mh/s</td><td class='gpulist'><b>$1.01</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/6600xt'>AMD RX 6600 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>31.88 Mh/s</td><td class='gpulist'><b>$1.00</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/1660s'>NVIDIA GTX 1660 Super</a></td><td class='gpulist'>ETH</td><td class='gpulist'>31.74 Mh/s</td><td class='gpulist'><b>$1.00</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/1660ti'>NVIDIA GTX 1660 Ti</a></td><td class='gpulist'>ETH</td><td class='gpulist'>31.10 Mh/s</td><td class='gpulist'><b>$0.98</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/470'>AMD RX 470</a></td><td class='gpulist'>ETH</td><td class='gpulist'>31.00 Mh/s</td><td class='gpulist'><b>$0.97</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/6600'>AMD RX 6600</a></td><td class='gpulist'>ETH</td><td class='gpulist'>28.76 Mh/s</td><td class='gpulist'><b>$0.90</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/1070'>NVIDIA GTX 1070</a></td><td class='gpulist'>ETH</td><td class='gpulist'>28.00 Mh/s</td><td class='gpulist'><b>$0.88</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/5500xt'>AMD RX 5500 XT</a></td><td class='gpulist'>ETH</td><td class='gpulist'>27.24 Mh/s</td><td class='gpulist'><b>$0.86</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/1660'>NVIDIA GTX 1660</a></td><td class='gpulist'>ETH</td><td class='gpulist'>26.50 Mh/s</td><td class='gpulist'><b>$0.83</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/p106'>NVIDIA P106-100</a></td><td class='gpulist'>ETH</td><td class='gpulist'>24.04 Mh/s</td><td class='gpulist'><b>$0.76</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/1060'>NVIDIA GTX 1060</a></td><td class='gpulist'>ETH</td><td class='gpulist'>22.00 Mh/s</td><td class='gpulist'><b>$0.69</b></td></tr><tr class='w3-border-bottom'><td class='list'><a class='gpulist' href='/3050'>NVIDIA RTX 3050</a></td><td class='gpulist'>ETH</td><td class='gpulist'>16.80 Mh/s</td><td class='gpulist'><b>$0.53</b></td></tr></table></center></div></div><div class='w3-col l2 w3-hide-medium w3-hide-small' style='padding-top: 127px;padding-left: 10px;padding-right: 10px'><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1991132164675774"
     crossorigin="anonymous"></script>
<!-- Vertical Banner -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1991132164675774"
     data-ad-slot="4027229594"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script><br />&nbsp;</div></div><div style='background-color: #1D1D1D;padding-bottom: 20px;'>
<center>
\t<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
\t<!-- bannerv2 -->
\t<ins class="adsbygoogle"
\t\t style="display:inline-block;width:728px;height:90px"
\t\t data-ad-client="ca-pub-1991132164675774"
\t\t data-ad-slot="7112330345"></ins>
\t<script>
\t\t (adsbygoogle = window.adsbygoogle || []).push({});
\t</script>
</center></div><div class='w3-row w3-hide-small' style='background: transparent url("/gfx/white_gpu.png") 0% 0% no-repeat padding-box;opacity: 1;background-size: cover;background-position: top;'><div class='w3-col l6 m6' style='height:400px;text-align: center;'></div><div class='w3-col l6 m6' style='height:400px;text-align: left;'><div class='hr-orange-whitefield'>Stuck?</div><div class='hr-focus-whitefield'>Learn more by<br />reading our<br />articles</div><div class='hr-info-whitefield'><a style='text-decoration: none;' href='/knowhow'>LEARN MORE!</a></div></div></div><div class='w3-row w3-hide-large w3-hide-medium' style='background: #f3f3f3;'><div class='w3-col' style='height:400px;text-align: left;'><div class='hr-orange-whitefield'>Stuck?</div><div class='hr-focus-whitefield'>Learn more by<br />reading our<br />articles</div><div class='hr-info-whitefield'><a style='text-decoration: none;' href='/knowhow'>LEARN MORE!</a></div></div></div><br />
<center>
\t<div id="amzn-assoc-ad-d17fa20e-8ebe-41bb-b6e4-9857b7ec8fac"></div><script async src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=d17fa20e-8ebe-41bb-b6e4-9857b7ec8fac"></script>
</center>

<br /><div class="w3-row-padding w3-center" style="padding-top: 30px; background-color: #1D1D1D">
\t<div style="max-width:894px;margin:auto">
\t\t<div style="max-width:894px;margin:auto;text-align: left">
\t\t<img style="padding-bottom: 30px;" src='/gfx/footer_logo.png' />
\t\t</div>
\t\t<div class="w3-quarter" style="text-align: left;padding-bottom: 30px;">
\t\t\t<div class="hr-font-footer-header" style="padding-bottom: 10px">Menu</div>
\t\t\t<table>
\t\t\t\t<tr>
\t\t\t\t\t<td><a class="hr-font-footer" style="text-decoration: none" href="/">GPUs</a></td>
\t\t\t\t\t<td><a class="hr-font-footer" style="text-decoration: none" href="/tests">Tests</a></td>
\t\t\t\t</tr>
\t\t\t\t<tr>
\t\t\t\t\t<td><a class="hr-font-footer" style="text-decoration: none;padding-right: 60px;" href="/options">Miner Options</a></td>
\t\t\t\t\t<td><a class="hr-font-footer" style="text-decoration: none" href="/miners">Miners</a></td>
\t\t\t\t</tr>
\t\t\t\t<tr>
\t\t\t\t\t<td><a class="hr-font-footer" style="text-decoration: none" href="/knowhow">KnowHow</a></td>
\t\t\t\t\t<td><a class="hr-font-footer" style="text-decoration: none" href="/pools">Pools</a></td>
\t\t\t\t</tr>
\t\t\t\t<tr>
\t\t\t\t\t<td><a class="hr-font-footer" style="text-decoration: none" href="/calc">Calculator</a></td>
\t\t\t\t\t<td></td>
\t\t\t\t</tr>
\t\t\t</table>
\t\t</div>
\t\t<div class="w3-half" style="text-align: left;padding-bottom: 30px;">
\t\t\t<div class="hr-font-footer-header" style="padding-bottom: 10px">Support Us</div>
\t\t\t<div class="hr-font-footer">
\t\t\t\tBTC: 36RKTZtui96rz7A9VFCnjsmhgFNxG6pLua<br />ETH: 0x0E42b2d84AB02BFFf470b8918590Dd44fFb6809F<br />ETC: 0x0E42b2d84AB02BFFf470b8918590Dd44fFb6809F<br />LTC: MKMyTDS142MMxkTVx2TNeEMjpvZ7NkcA7P<br />\t\t\t</div>
\t\t</div>
\t\t<div class="w3-quarter" style="text-align: left;padding-bottom: 30px;">
\t\t\t<div class="hr-font-footer-header">Social Media</div>
\t\t\t\t<table>
\t\t\t<tr><td style='text-align: center;'><img src='https://img.hashrate.no/d3cb3c1bb83683f2902129b8503a399f.png' /></td><td><a class='hr-font-footer' style='text-decoration: none' href='https://www.youtube.com/c/hashrateno' target='yt'>youtube.com/c/hashrateno</a></td><//tr><tr><td style='text-align: center;'><img src='https://img.hashrate.no/8d04e24a5026575f3622d7999e616a8a.png' /></td><td><a class='hr-font-footer' style='text-decoration: none'  href='https://www.instagram.com/hashrate.no/' target='insta'>instagram.com/hashrate.no/</a></td></tr><tr><td style='text-align: center;color: #fa4616;'>@</td><td><a class='hr-font-footer' style='text-decoration: none'  href='mailto:info@lineo.no' target='mail'>info@lineo.no</a></td></tr>\t</table>
\t\t</div>
\t</div>
</div>
<div class="w3-row-padding w3-center w3-border-top hr-border-menu" style="background-color: #000000;padding-top: 10px;padding-bottom: 10px;">
\t<div style="max-width:800px;margin:auto">
\t\t<div class="hr-font-disclaimer" style="float: left;">
\t\t\t&copy; 2020-2022 <a href='mailto:info@lineo.no'>Lineo AS</a>
\t\t\t&nbsp;&nbsp;|&nbsp;&nbsp;Disclaimer: We use cookies for GPU Price and kWh price. Thats it!
\t\t</div>
\t\t<div class="hr-font-disclaimer" style="float: right">Mine on!</div>
\t</div>
</div>
<script>
\tconst linkedElement = document.getElementById(location.hash.substring(1));
\tif (linkedElement) {
\t\tlinkedElement.closest('table')?.querySelector('button')?.onclick?.();
\t}
</script>
<script>
window.onscroll = function() {myScroll()};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function myScroll() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}
</script>

<script>
\tvar coll = document.getElementsByClassName("collapsible");
\tvar i;

\tfor (i = 0; i < coll.length; i++) {
\t  coll[i].addEventListener("click", function() {
\t\tthis.classList.toggle("active");
\t\tvar content = this.nextElementSibling;
\t\tif (content.style.display === "block") {
\t\t  content.style.display = "none";
\t\t} else {
\t\t  content.style.display = "block";
\t\t}
\t  });
\t}
</script>
<script>
\tfunction myFunction(id) {
\t  var x = document.getElementById(id);
\t  if (x.className.indexOf("w3-show") == -1) {
\t\tx.className += " w3-show";
\t  } else {
\t\tx.className = x.className.replace(" w3-show", "");
\t  }
\t}
</script>
<script>
\tfunction w3_open() {
\t  document.getElementById("mySidebar").style.display = "block";
\t}

\tfunction w3_close() {
\t  document.getElementById("mySidebar").style.display = "none";
\t}
</script>
<script>
\tfunction sortTable(n) {
\t  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
\t  table = document.getElementById("myTable");
\t  switching = true;
\t  //Set the sorting direction to ascending:
\t  dir = "asc";
\t  /*Make a loop that will continue until
\t  no switching has been done:*/
\t  while (switching) {
\t\t//start by saying: no switching is done:
\t\tswitching = false;
\t\trows = table.rows;
\t\t/*Loop through all table rows (except the
\t\tfirst, which contains table headers):*/
\t\tfor (i = 1; i < (rows.length - 1); i++) {
\t\t  //start by saying there should be no switching:
\t\t  shouldSwitch = false;
\t\t  /*Get the two elements you want to compare,
\t\t  one from current row and one from the next:*/
\t\t  x = rows[i].getElementsByTagName("TD")[n];
\t\t  y = rows[i + 1].getElementsByTagName("TD")[n];
\t\t  /*check if the two rows should switch place,
\t\t  based on the direction, asc or desc:*/
\t\t  if (dir == "asc") {
\t\t\tif (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
\t\t\t  //if so, mark as a switch and break the loop:
\t\t\t  shouldSwitch= true;
\t\t\t  break;
\t\t\t}
\t\t  } else if (dir == "desc") {
\t\t\tif (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
\t\t\t  //if so, mark as a switch and break the loop:
\t\t\t  shouldSwitch = true;
\t\t\t  break;
\t\t\t}
\t\t  }
\t\t}
\t\tif (shouldSwitch) {
\t\t  /*If a switch has been marked, make the switch
\t\t  and mark that a switch has been done:*/
\t\t  rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
\t\t  switching = true;
\t\t  //Each time a switch is done, increase this count by 1:
\t\t  switchcount ++;
\t\t} else {
\t\t  /*If no switching has been done AND the direction is "asc",
\t\t  set the direction to "desc" and run the while loop again.*/
\t\t  if (switchcount == 0 && dir == "asc") {
\t\t\tdir = "desc";
\t\t\tswitching = true;
\t\t  }
\t\t}
\t  }
\t}
</script>
<script>
        // Get the modal
        var modalparent = document.getElementsByClassName("modal_multi");

        // Get the button that opens the modal
        var modal_btn_multi = document.getElementsByClassName("myBtn_multi");

        // Get the <span> element that closes the modal
        var span_close_multi = document.getElementsByClassName("close_multi");

        // When the user clicks the button, open the modal
        function setDataIndex() {
            for (i = 0; i < modal_btn_multi.length; i++)
            {
                modal_btn_multi[i].setAttribute('data-index', i);
                modalparent[i].setAttribute('data-index', i);
                span_close_multi[i].setAttribute('data-index', i);
            }
        }
        for (i = 0; i < modal_btn_multi.length; i++)
        {
            modal_btn_multi[i].onclick = function() {
                var ElementIndex = this.getAttribute('data-index');
                modalparent[ElementIndex].style.display = "block";
            };

            // When the user clicks on <span> (x), close the modal
            span_close_multi[i].onclick = function() {
                var ElementIndex = this.getAttribute('data-index');
                modalparent[ElementIndex].style.display = "none";
            };

        }

        window.onload = function() {

            setDataIndex();
        };

        window.onclick = function(event) {
            if (event.target === modalparent[event.target.getAttribute('data-index')]) {
                modalparent[event.target.getAttribute('data-index')].style.display = "none";
            }
        };
    </script>
\t<script>
\t\tconst openPopupOnHash = () => {
\t\tconst button = document.getElementById(location.hash.substring(1))?.closest('tr')?.querySelector('button.openOnHash');

\t\tif (!button || !button.onclick) {
\t\t\treturn;
\t\t}

\t\t\tbutton.onclick.bind(button)();
\t\t};

\t\twindow.addEventListener("load", openPopupOnHash)
\t</script>
  </body>
</html>
`;
