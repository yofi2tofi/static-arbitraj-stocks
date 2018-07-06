'use strict'

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

let needle    = require('needle'),
	tress     = require('tress'),
	cheerio   = require('cheerio');

let proxy     = require('./proxy');

var drawFirstStock = function(array){

	let drawData = [];

	array[0].forEach((a, i)=>{
		if (i<100) drawData.push([a['key'], a['low'], a['open'], a['close'], a['high']]);
	});

	drawData.reverse();

	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		var data = google.visualization.arrayToDataTable( drawData, true);

		var options = {
			legend:'none',
			chartArea:{left: 50, top:20,width:'90%',height:'90%'}
		};

		var chart = new google.visualization.CandlestickChart(document.getElementById('chart_first_stock'));

		chart.draw(data, options);
	}
};

var drawSecondStock = function(array){

	let drawData = [];

	array[1].forEach((a, i)=>{
		if (i<100) drawData.push([a['key'], a['low'], a['open'], a['close'], a['high']]);
	});

	drawData.reverse();

	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		var data = google.visualization.arrayToDataTable( drawData, true);

		var options = {
			legend:'none',
			chartArea:{left: 50, top:20,width:'90%',height:'90%'}
		};

		var chart = new google.visualization.CandlestickChart(document.getElementById('chart_second_stock'));

		chart.draw(data, options);
	}
};

var drawSpread = function(D, array){

	let drawData = [];

	D.forEach((a, i)=>{
		if (i<100) drawData.push([`${array[0][i]['key']}`, a]);
	});

	drawData.reverse();

	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		var data = google.visualization.arrayToDataTable( drawData, true);

		var options = {
			legend:'none',
			chartArea:{left: 50, top:20,width:'90%',height:'90%'}
		};

		var chart = new google.visualization.LineChart(document.getElementById('chart_spread'));

		chart.draw(data, options);
	}
};

var drawRatio = function(D, array){

	let drawData = [];

	D.forEach((a, i)=>{
		if (i<100) drawData.push([`${array[0][i]['key']}`, a]);
	});

	drawData.reverse();

	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		var data = google.visualization.arrayToDataTable( drawData, true);

		var options = {
			legend:'none',
			chartArea:{left: 50, top:20,width:'90%',height:'90%'}
		};

		var chart = new google.visualization.LineChart(document.getElementById('chart_ratio'));

		chart.draw(data, options);
	}
};

var drawDelta = function(D, array){

	let drawData = [];

	D.forEach((a, i)=>{
		if (i<100) drawData.push([`${array[0][i]['key']}`, a]);
	});

	drawData.reverse();

	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		var data = google.visualization.arrayToDataTable( drawData, true);

		var options = {
			legend:'none',
			chartArea:{left: 50, top:0,width:'90%',height:'75%'}
		};

		var chart = new google.visualization.LineChart(document.getElementById('chart_delta'));

		chart.draw(data, options);
	}
};

let _length = function(array) {
	return array[0].length > array[1].length ? array[1].length : array[0].length;
};

let Sx2 = function(x_duo) {
	var _len = x_duo.length;
	return x_duo.reduce((acc, i)=>{
		return acc+i;
	},0)/_len;
};

let Sy2 = function(y_duo) {
	var _len = y_duo.length;
	return y_duo.reduce((acc, i)=>{
		return acc+i;
	},0)/_len;
};

let Mxy = function(x_y) {
	var _len = x_y.length;
	return x_y.reduce((acc, i)=>{
		return acc+i;
	},0)/_len;
};

let Mx = function(array) {
	var _len = array.length;
	return array.reduce((acc, i)=>{
		return acc+Math.abs(i['close']);
	},0)/_len;
};

let My = function(array) {
	var _len = array.length;
	return array.reduce((acc, i)=>{
		return acc+Math.abs(i['close']);
	},0)/_len;
};

let multiply = (a, b) =>{
	return a * b;
}

let sqrt = (a) => {
	return Math.sqrt(a);
}

let correlation = function(array, print){

	let result = [];

	let x_duo = [], 
		y_duo = [], 
		x_y   = [];

	for (let i=0; i < _length(array); i++) {

		let _temp = array[0][i]['close']*array[0][i]['close'];

		x_duo.push(_temp);
	};

	for (let i=0; i < _length(array); i++) {

		let _temp = array[1][i]['close']*array[1][i]['close'];

		y_duo.push(_temp);
	};

	for (let i=0; i < _length(array); i++) {

		let _temp = array[0][i]['close']*array[1][i]['close'];

		x_y.push(_temp);
	};

	let R = sqrt( multiply(Sx2(x_duo)-Math.pow(Mx(array[0]), 2), Sy2(y_duo)-Math.pow(My(array[1]), 2)) );

	result = (Mxy(x_y) - multiply(Mx(array[0]), My(array[1])) )/ R;

	if(print) $('#correlation').text(`Corr: ${result}`);

	return result;
};

var spread = function(array) {

	let spread = [];
	
	let x = [], // Стак с большей ценой
		y = [];

	let x_x = [],
		y_x = [];

	let SumX, SumY;

	let SumX_X, SumY_X;

	let _a, _b;

	let length;

	array[0].forEach((a)=>{
		return y.push(a['close']);
	});

	array[1].forEach((a)=>{
		return x.push(a['close']);
	});

	x_x = x.map((a)=>{
		return a*a;
	});

	y_x = x.map((a, i)=>{
		return a * y[i];
	})

	SumX = x.reduce((acc, i)=>{
		return acc + i
	}, 0);

	SumY = y.reduce((acc, i)=>{
		return acc + i
	}, 0);

	SumX_X = x_x.reduce((acc, i)=>{
		return acc + i
	}, 0);

	SumY_X = y_x.reduce((acc, i)=>{
		return acc + i
	}, 0);

	length = x.length;

	_a = Math.abs(((SumY_X - SumX*SumY/length)/(SumX_X - SumX*SumX/length)).toFixed(3));

	_b = Math.abs(((SumY - _a*SumX)/length).toFixed(3));

	spread = x.map((a, i)=>{
		return y[i] - a*_a - _b;
	})

	drawSpread(spread, array);

	console.log(`constant: ${_a}`);
	$('#spread').html(`Spread: ${spread[0].toFixed(3)}`);
};

let ratio = function(array) {

	let ratio = [];

	let x = [], // Стак с большей ценой
		y = [];

	array[0].forEach((a)=>{
		return y.push(a['close']);
	});

	array[1].forEach((a)=>{
		return x.push(a['close']);
	});

	ratio = x.map((a, i)=>{
		return Math.abs((y[i]/a).toFixed(3));
	})

	$('#ratio').html(`Ratio: ${ratio[0]}`);

	drawRatio(ratio, array);

	return ratio;
};

let smaRatio = function(array){

	let SMa = [];

	let r = ratio(array);

	SMa = r.map((a, i)=>{
		for (let j=i+1; j<i+10; j++) {
			if (r[j]) a += r[j];
			else a += r[r.length-1];
		};
		return  Math.abs((a / 10).toFixed(5));
	});

	console.log(`SMA Ratio: ${SMa[SMa.length-1]}`);

	return SMa;
};

let delta = function(array) {

	let delta = [];

	let SMaR = smaRatio(array);

	let x = [], // Стак с большей ценой
		y = [];

	let deltaH = 0;

	array[0].forEach((a)=>{
		return y.push(a['close']);
	});

	array[1].forEach((a)=>{
		return x.push(a['close']);
	});

	delta = x.map((a, i)=>{
		let $a = Math.abs(( y[i] - a*SMaR[i] ).toFixed(2));
		return $a;
	})

	delta.forEach((a)=>{
		if (deltaH < a) deltaH = a; 
	});

	deltaH = deltaH/2;

	delta = delta.map((a)=>{
		return a/2; // - deltaH если нужно будет
	})

	drawDelta(delta, array);

	$('#delta').html(`Delta: ${delta[0].toFixed(3)}`);
};

/*
*  Delta для выдачи
*/
let deltaMini = function(array) {

	let delta;

	let x = [], // Стак с большей ценой
		y = [];

	let ratio = [];

	let SMaR = [];

	let deltaH = 0;

	let deltaM;

	array[0].forEach((a)=>{
		return y.push(a['close']);
	});

	array[1].forEach((a)=>{
		return x.push(a['close']);
	});

	ratio = x.map((a, i)=>{
		return Math.abs((y[i]/a).toFixed(3));
	})

	SMaR = ratio.map((a, i)=>{
		for (let j=i+1; j<i+10; j++) {
			if (ratio[j]) a += ratio[j];
			else a += ratio[ratio.length-1];
		};
		return  Math.abs((a / 10).toFixed(5));
	});

	delta = x.map((a, i)=>{
		let $a = Math.abs(( y[i] - a*SMaR[i] ).toFixed(2));
		return $a;
	})

	delta = delta.map((a)=>{
		return a/2; // - deltaH если нужно будет
	})

	delta.forEach((a)=>{
		if (deltaH < a) deltaH = a; 
	});

	deltaH = deltaH/2+(deltaH/2/2); // Середина диапазона

	if (delta[0] > deltaH && delta[0] > delta[1] ) return delta[0];
	else return 0;
};

let _static = function(array) {

	let x = [],
		y = [];

	let t_v;

	let SMx, SMy;

	array[0].forEach((a)=>{
		return y.push(a['close']);
	});

	array[1].forEach((a)=>{
		return x.push(a['close']);
	});

	SMx = x.reduce((acc, e, i)=>{
		if (i<50) return acc + e;
		return acc;
	}, 0)

	SMx = SMx/50;

	SMy = y.reduce((acc, e, i)=>{
		if (i<50) return acc + e;
		return acc;
	}, 0)

	SMy = SMy/50;
	
	t_v = (SMx + SMy)/ (x.length - 50); // Тест на статичность

	$('#static').html(`Static: ${t_v.toFixed(3)}`);
};

let vola = function(array){

	let x_h = [], // Стак с большей ценой
		x_l = [],
		y_h = [],
		y_l = [];

	let volaA, volaB;

	let SvolaA, SvolaB;

	let length;

	array[0].forEach((a)=>{
		y_h.push(a['high']);
		y_l.push(a['low']);
		return;
	});

	array[1].forEach((a)=>{
		x_h.push(a['high']);
		x_l.push(a['low']);
		return;
	});

	volaA = y_h.map((a, i)=>{
		return (a/y_l[i]-1)*100;
	});

	volaB = x_h.map((a, i)=>{
		return (a/x_l[i]-1)*100;
	});

	length = x_h.length;

	SvolaA = volaA.reduce((acc, i)=>{
		return acc + i;
	}, 0);

	SvolaA = SvolaA/length;

	SvolaB = volaB.reduce((acc, i)=>{
		return acc + i;
	}, 0);

	SvolaB = SvolaB/length;

	return { volaA: SvolaA, volaB: SvolaB };
};

let volaR = function(array) {

	let _vola;

	let _a, _b;

	let r;

	_vola = vola(array);

	_a = _vola.volaA;

	_b = _vola.volaB;

	r = Math.abs((_a/_b).toFixed(3));

	console.log(`Volatility Ratio: ${r}`);

	return _vola;
}

let position = function(array) {

	let BP = 10000;

	let x, y;

	let _vola;

	let _a, _b;

	let posA, posB;

	let r;

	const part1 = 1000; // Количество акций в меньшей по волатильности

	let part2;

	_vola = volaR(array);

	_a = _vola.volaA;

	_b = _vola.volaB;

	y = array[0][array[0].length-1]['close'];

	x = array[1][array[1].length-1]['close'];

	posA = BP/_a/y;
	posB = BP/_b/x;

	r = posA/posB;

	part2 = part1/r;

	$('#leg1').text(`${part1} (${part1/1000})`);
	$('#leg2').text(`${Math.round(part2)} (${Math.round(part2)/1000})`);
};

let volaMini = function(array){

	let x_h = [], // Стак с большей ценой
		x_l = [],
		y_h = [],
		y_l = [];

	let volaA, volaB;

	let SvolaA, SvolaB;

	let length;

	array[0].forEach((a)=>{
		y_h.push(a['high']);
		y_l.push(a['low']);
	});

	array[1].forEach((a)=>{
		x_h.push(a['high']);
		x_l.push(a['low']);
	});

	volaA = y_h.map((a, i)=>{
		return (a/y_l[i]-1)*100;
	});

	volaB = x_h.map((a, i)=>{
		return (a/x_l[i]-1)*100;
	});

	length = x_h.length;

	SvolaA = volaA.reduce((acc, i)=>{
		return acc + i;
	}, 0);

	SvolaA = SvolaA/length;

	SvolaB = volaB.reduce((acc, i)=>{
		return acc + i;
	}, 0);

	SvolaB = SvolaB/length;

	return { volaA: SvolaA, volaB: SvolaB };
};

let volaRMini = function(array) {

	let _vola;

	let _a, _b;

	let r;

	_vola = volaMini(array);

	_a = _vola.volaA;

	_b = _vola.volaB;

	r = Math.abs((_a/_b).toFixed(3));

	return _vola;
};

let positionMini = function(array) {

	let BP = 10000;

	let x, y;

	let _vola;

	let _a, _b;

	let posA, posB;

	let r;

	let c;

	const part1 = 1000; // Количество акций в меньшей по волатильности

	let part2;

	_vola = volaRMini(array);

	_a = _vola.volaA;

	_b = _vola.volaB;

	y = array[0][array[0].length-1]['close'];

	x = array[1][array[1].length-1]['close'];

	posA = BP/_a/y;
	posB = BP/_b/x;

	r = posA/posB;

	part2 = part1/r;

	let _part1, _part2;

	part2 = Math.round(part2);

	if (part1 < part2) {
		_part1 = part2;
		_part2 = part1;
	} else {
		_part1 = part1;
		_part2 = part2;
	};

	c = _part1/_part2;

	return c > 1.7 || c < 1.35 ? true : false;
};

let compareK = function(f){
	// return f > 0.8 ? f: f< -0.6 ? f: false;
	return f > 0.8 ? f: false;
}

let compareD = function(f){
	return Math.abs(f) ? Math.abs(f): false
}

/*
* Basic middleware
*/
let middleware = function(array, selector, thumb) {

	let paras = [];
	
	let dock = '<div>';
	
	array.forEach((a, i)=>{
		// console.log(`Working: ${i}`);
		array.forEach((b, j)=>{
			if (i >= j) return;
			if( a['data'][0]['close'] > b['data'][0]['close']) {
				compareK(correlation([b['data'],a['data']])) && compareD(deltaMini([b['data'],a['data']])) && (positionMini([b['data'],a['data']])) ? dock += `<div id="${b['ticker']}-${a['ticker']}">${b['ticker']}-${a['ticker']} ` + `<f>${correlation([b['data'],a['data']]).toFixed(3)}</f>` + `<span class="price">${a['data'][0]['close']}</span>` + `<span class="delta">${deltaMini([b['data'],a['data']])}</span>` + '</div>' : 0;
			} else {
				compareK(correlation([a['data'],b['data']])) && compareD(deltaMini([a['data'],b['data']])) && (positionMini([a['data'],b['data']])) ? dock += `<div id="${a['ticker']}-${b['ticker']}">${a['ticker']}-${b['ticker']} ` + `<f>${correlation([a['data'],b['data']]).toFixed(3)}</f>` + `<span class="price">${b['data'][0]['close']}</span>` + `<span class="delta">${deltaMini([a['data'],b['data']])}</span>` + '</div>' : 0;
			};
		})
	});

	dock += '</div>';

	$(selector,'#id1').empty().html(dock);
	dock = '';

	$(thumb).css('background-color', 'rgba(0, 255, 0, .5)');
	
	return;
};

let selected = function(array, flag){

	let _a, _b;

	let store = [];

	_a = array[0];

	_b = array[1];

	$store.forEach((a)=>{
		if (a['ticker'] == _a) store.push(a['data']);
	});

	$store.forEach((a)=>{
		if (a['ticker'] == _b) store.push(a['data']); // Все норм тут
	});

	if (store.length == 2) {

		

		if (flag) {
			if(store[0][0]['close'] > store[1][0]['close']) store.reverse();
			$('.team1').text(_b);
			$('.team2').text(_a);
		} else {
			$('.team1').text(_a);
			$('.team2').text(_b);
		};

		drawFirstStock(store);
		drawSecondStock(store);

		correlation(store, true);
		spread(store);
		delta(store);
		position(store);
		_static(store);
	} else {
		$('#error').show().text('Не найденно.').delay(2000).queue(function () { $(this).hide(); $(this).dequeue();}); return false;
	};
};

// Список для basicM
let listBM = 'AA,ALB,ALJ,AM,APA,APC,APD,AR,ARNC,AROC,ASH,AXTA,BAS,BHI,BPL,BRS,BWP,CC,CDEV,CE,CENX,CF,CLR,CMC,CNX,COG,COP,CPE,CRC,CRR,CRZO,CVI,CVX,CXO,DCP,DD,DK,DNOW,DO,DOW,DRQ,DVN,EEP,EEQ,EGN,EMES,EMN,ENLC,ENLK,EOG,EPD,EQT,ETE,ETP,FANG,FCX,FET,FMC,FRAC,FTI,FTK,GEL,GPOR,GPRE,GRA,GSM,HAL,HCLP,HES,HFC,HP,HSC,HUN,IFF,INT,JAG,KMI,KRO,LNG,LPI,MMP,MON,MOS,MPC,MPLX,MRC,MRO,MTDR,MUR,NBL,NEM,NFG,NFX,NGL,NOV,NUE,OAS,OII,OIS,OKS,OLN,OXY,PAA,PAGP,PAH,PBF,PDCE,PE,POL,PPG,PSX,PTEN,PX,PXD,QEP,RDC,REN,RES,RGLD,RICE,RMP,RPM,RRC,RS,RSPP,RYAM,SCCO,SCHN,SEMG,SEP,SHW,SLB,SLCA,SM,SMG,SND,SPN,STLD,SUN,SWC,SXL,TELL,TLLP,TMST,TRGP,TROX,TSO,UNT,UNVR,VAL,VLO,VVV,WLK,WMB,WNR,WOR,WPX,WPZ,X,XEC,XOG,XOM';
// Список для ConsumerGoods
let listCG = 'AAPL,ACCO,ADM,ALSN,APFH,AVY,AXL,BC,BERY,BF-B,BG,BGS,BLL,BMS,BUFF,BWA,CAG,CALM,CCE,CCK,CHD,CL,CLX,COH,COLM,COTY,CPB,CRI,CSL,CTB,DAN,DECK,DF,DPS,ECL,EL,ELF,ELY,ENR,EPC,F,FBHS,FL,FLO,FOSL,GIII,GIS,GM,GNTX,GOOS,GPK,GT,HAS,HBI,HOG,HRL,HSY,INGR,IP,IRBT,JCI,K,KATE,KHC,KMB,KNL,KO,KS,LEA,LEG,LKQ,LNCE,LTRPA,LW,MAT,MDLZ,MHK,MJN,MKC,MNST,MO,MPSX,MTOR,NAV,NKE,NLS,NUS,NWL,OI,OSK,PAY,PBI,PCAR,PEP,PF,PG,PII,PKG,PM,POST,PPC,PVH,RAI,RL,SAFM,SCS,SCSS,SEE,SHOO,SJM,SKX,SON,STZ,TAP,TEN,THO,THS,TPX,TSE,TSLA,TSN,TUP,TWNK,UA,UAA,UVV,VFC,VGR,VSTO,WATT,WHR,WNC,WRK,WWAV,WWW';
// Список для Finance
let listFin = 'KBWB,FTXO,AMG,QTS,TCO,KRC,IWO,FRT,CBSH,SCHA,COLB,RWM,SIVB,ACC,VIIX,VO,CPT,HIW,CVBF,EVR,FHB,VGT,IBKC,CFR,LGIH,CATY,IWS,APAM,IWN,PVTB,BXP,VBR,DCT,EZA,UCBI,BKU,WAFD,GHL,OEF,AVB,YINN,MAA,CONE,PB,UE,PEB,SNV,SF,EFX,DVY,EDR,BPOP,DEI,BLK,FAF,HAWK,SPXL,VYM,DFT,IBKR,SBRA,OMF,EV,REG,CINF,VIG,BRO,BXS,LPLA,SBNY,MTB,HOMB,FMBI,SOXX,SDY,IYF,QLD,ILF,RJF,AEL,IVE,GEO,FXE,LM,L,VUG,VNO,PFG,TMV,TMK,LPT,SDOW,MGP,AJG,LAMR,MDY,DRIP,IWB,HBHC,ARE,SKT,OZRK,PSA,DLR,RSP,NDAQ,VB,NNN,CBOE,IYE,VTV,AMP,HOPE,PACW,WTFC,ASB,STL,SLG,SEIC,FRC,NTRS,IWF,IBB,MAC,SRTY,EXR,TROW,CXW,TBT,O,FULT,VIRT,WBS,TCBI,VFH,LABU,CME,BOFI,RLGY,VOYA,UNM,BANC,TSS,IJH,IWD,UPRO,IVW,STT,TWM,APO,LHO,CIT,AMT,LNC,AIV,VTR,RESI,WAL,FAZ,UNIT,AFL,ALL,EQR,AFSI,ICE,EWW,SQQQ,PNC,PRU,SPG,VTI,TRV,USLV,DXJ,BEN,ZION,SSO,TQQQ,KBE,CBG,HCN,ERX,HIG,EWBC,CB,VIXY,COF,LABD,VOO,KCG,TNA,SMH,IVZ,EWY,PLD,DFS,DIA,MMC,FAS,VNQ,CMA,MA,SVXY,IVV,SCO,XLB,XLY,XME,IJR,XBI,DWT,GS,AMTD,SYF,UGAZ,TVIX,BBT,UBSI,OIH,PYPL,DGAZ,AXP,STI,ETFC,FITB,XRT,XLV,AIG,IYR,SCHW,CFG,MET,BK,KRE,DUST,UWT,USB,UCO,TLT,XLI,BX,TZA,GDXJ,JDST,XIV,MS,XLU,XLE,EWZ,C,GLD,V,JPM,XOP,QQQ,WFC,IWM,UVXY,GDX,VXX,SPY,BAC';
// Список для Technology
let listT = 'ACTA,ADBE,ALRM,ANSS,AYX,BL,BNFT,BOX,BSFT,CDK,CDNS,CRM,CSOD,CVLT,DATA,ECOM,EGOV,ELLI,EVBG,FEYE,FIVN,FTNT,HUBS,IMPV,INST,INTU,INVA,LOGM,MANH,MB,MDRX,MODN,MULE,NSIT,NUAN,ORCL,PAYC,PCTY,PFPT,PRGS,PRO,QLYS,RHT,RNG,RP,RPD,RST,SNCR,SPLK,SPSC,STMP,SYNA,TWLO,TWOU,TTD,TYPE,WDAY,WK,ZEN,XTLY,VRNT,SSNC,QTWO,PEGA,NTCT,NEWR,MSFT,IRM,JKHY,GWRE,FFIV,FICO,EVTC,EPAY,EBIX,DST,CTSH,CTXS,CSGS,CA,CALD,CARB,BKFS,BLKB,AZPN,ADP,ADTN,AIRG,ACIA,ARRS,CIEN,CMTL,COMM,CUDA,HRS,KN,LITE,MSI,NTGR,PI,QTNA,QCOM,SATS,VSAT,VCRA,SSNI,SSYS,MRCY,DDD,EFII,BRCD,NMBL,PSTG,NTAP,WDC,TDC,WSTC,WIFI,OOMA,STRP,SBAC,NSR,LVLT,LMOS,IRDM,GTT,IDT,CCOI,CCI,EGHT,GOGO,HPE,HPQ,DVMT,DBD,CRAY,ANET,APH,AVX,AYI,AEIS,CTRL,DLB,GLW,HUBB,IVAC,KEM,MEI,SANM,ROG,QSII,OMCL,PINC,MDSO,INOV,HQY,HSTM,EVH,ATHN,COTV,CPSI,CERN,WBMD,TDOC,VEEV,BR,FDS,DNB,LDOS,NLSN,NOW,IT,IBM,NCR,PSDO,PRFT,SABR,SAIC,SYNT,SYKE,DXC,CSRA,EPAM,FIS,CACI,CDW,ACXM,UIS,VRTU,VRSN,WEB,TRIP,TWTR,YELP,YHOO,Z,ZG,AKAM,BCOR,FB,GOOG,GOOGL,GRUB,CRCM,IAC,MTCH,TRUE,SNAP,ULTI,XXIA,JCOM,SQ,EQIX,GDDY,COUP,GNCMA,EA,COOL,ATVI,TTWO,ZAYO,CSCO,GIMO,FNSR,SMCI,PANW,JNPR,KBAL,JBL,PLXS,BHE,TTMI,CLGX,PLT,MSCI,MKSI,ITRI,IIVI,KEYS,RTEC,COHR,CGNX,BMI,FLIR,FTV,CUB,CYBE,TRMB,TDY,VDSI,BRC,SYMC,MANT,MCHP,MTSI,MXIM,IPHI,IDTI,INTC,QRVO,ON,CAVM,AMD,CY,FORM,VSH,TXN,XLNX,EXAR,DIOD,AMKR,ADI,AAOI,CCMP,POWI,SWKS,SMTC,SLAB,INVN,MXL,MSCC,MPWR,LSI,IXYS,NVDA,CEVA,AOSL,CRUS,FSLR,UCTT,VECO,UTEK,TER,CREE,ENTG,ACLS,AMAT,AMBA,COHU,BRKS,OLED,PLAB,SNPS,KLAC,IPGP,ICHR,LRCX,NANO,MU,RMBS,SCSC,PDFS,NTNX,PTC,NATI,ADSK,ACIW,HDP,TYL,VMW,VRNS,VZ,FRP,CTL,CBB,CNSL,SHEN,T,SPOK,IDCC,CAMP,USM,UBNT,TMUS,TDS';

let stocksBM = listBM.split(',');

	// stocksBM.length = 60; 

let stocksCG = listCG.split(',');

	// stocksCG.length = 20;

let stocksFin = listFin.split(',');
	
	// stocksFin.length = 10;

let stocksT = listT.split(',');

	// stocksT.length = 60;

let storeBM  = [];

let storeCG = [];

let storeFin = [];

let storeT = [];

let $store = [];
// Складчина BM
let $storeBM = [];
// Складчина CG
let $storeCG = [];
// Складчина Fin
let $storeFin = [];
// Складчина Technology
let $storeT = [];

let keys = ['6225','4344','6227', '8492', '9892'];

	storeBM = stocksBM.map((a)=>{
		return `http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=5min&symbol=${a}&apikey=${keys[Math.floor(Math.random() * keys.length)]}`;
	});

	storeCG = stocksCG.map((a)=>{
		return `http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=5min&symbol=${a}&apikey=${keys[Math.floor(Math.random() * keys.length)]}`;
	});

	storeFin = stocksFin.map((a)=>{
		return `http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=5min&symbol=${a}&apikey=${keys[Math.floor(Math.random() * keys.length)]}`;
	});

	storeT  = stocksT.map((a)=>{
		return `http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=5min&symbol=${a}&apikey=${keys[Math.floor(Math.random() * keys.length)]}`;
	});

/*
* Array type of sector
*/
let asyncGraber = function(array, _store, selectorProg, selector, thumb, proxies) {

	let listLen = array.length;

	let increment;

	let proc = 0;

	let _key, __key, _keyCounter = 0;

	increment = 100/listLen;

	return new Promise(function(resolve, reject){

		let q = tress(function(url, done) {

			__key = q.finished.length;

			if ( _key !==  __key) { 
				_key = __key; _keyCounter = 0; 
			} else { 
				_keyCounter++; 
				if (_keyCounter > 30)  { 
					q.concurrency = 1;
					done(null);
					q.save((f)=>{
						proxies=[''];
						// q.kill();
					});
					return;
				}
			};

			let count = [];

			let proxy = proxies[Math.floor(Math.random() * proxies.length)];

			needle.get(url, { proxy: proxy, follow_max: 5, open_timeout: 2000 }, function(err, resp, body) {

				try {

					let ticker = resp.body['Meta Data']['2. Symbol'];

					for (let key in resp.body['Time Series (5min)']) {

						let temp = {};

						temp['key']    = key;
						temp['open']   = Math.abs(resp.body['Time Series (5min)'][key]['1. open']);
						temp['high']   = Math.abs(resp.body['Time Series (5min)'][key]['2. high']);
						temp['low']    = Math.abs(resp.body['Time Series (5min)'][key]['3. low']);
						temp['close']  = Math.abs(resp.body['Time Series (5min)'][key]['4. close']);
						temp['volume'] = Math.abs(resp.body['Time Series (5min)'][key]['5. volume']);

						count.push(temp);
					};

					proc += increment;

					$(selectorProg).css('width', proc + '%');

					if (count.length < 99) done(null);
					else if(Math.abs(count[0]['close']) < 90) {

						$store.push({
							ticker : ticker,
							data   : count
						});

						_store.push({
							ticker : ticker,
							data  : count
						});

						done(null);
						
					} else done(null);
				} catch (e) {
					done(true);
				} 
			});
			
		}, 10);

		q.success = function(){
		    q.concurrency = 30;
		    q.buffer = 400;
		};

		q.retry = function(){
			if (q.running()>=10) q.concurrency = 10;
		    if (q.running()<10) q.concurrency = 1; proxies=[''];
		};

		q.push(array);

		q.drain = function(){
			console.log('В процессе');
			middleware(_store, selector, thumb); // Basic Middleware
			resolve();
		};
	});
};

let init = function() {

	let flag = Promise.resolve();

	flag
	.then(()=>{
		return Promise.all([
			proxy.graberA(),
			proxy.graberB()
		]);
	})
	.then((array)=>{
		let _a = [];
		array.map((a)=>{
			return a.forEach((b)=>{
				return _a.push(b);
			})
		});
		return _a;
	})
	.then((proxies)=>{
		Promise.all([
			asyncGraber(storeBM, $storeBM, '#BMprog', '.BM', '#BM-thumb', proxies),
			asyncGraber(storeCG, $storeCG, '#CGprog', '.CG', '#CG-thumb', proxies),
			asyncGraber(storeFin, $storeFin, '#Finprog', '.Fin', '#Fin-thumb', proxies),
			asyncGraber(storeT, $storeT, '#Tprog', '.T', '#T-thumb', proxies)
		]);
	})
	.catch((e)=>{
		console.log(e);
	});
};

init();

$(function(){
	$('#init').on('click',function(){
		$(this).hide();		
	});

	let cooldown;

	$('#id1').on('click', 'div[id]', (e)=>{
		let slot;

		$('div div','#id1').css('color','#000');
		$(e.currentTarget).css('color','blue');

		slot = $(e.currentTarget).attr('id');

		if (cooldown) return
		else {
			cooldown = true;

			slot = slot.split('-');

			$('.team1').html(slot[0]);
			$('.team2').html(slot[1]);

			selected(slot);

			setTimeout(()=>cooldown=false, 1500);
		};
	});

	$('#search').on('click',function(){
		let s1, s2;

		let slot = [];

		s1 = $('#search-stock1').val().trim().toUpperCase();
		s2 = $('#search-stock2').val().trim().toUpperCase();

		if(!s1 || !s2) return false;
		
		slot.push(s1);
		slot.push(s2);

		selected(slot, true);
	});
});

/* 
*  Спред ниже нуля и идет к нулю.
*  Первый сток - лонг
*  Второй сток - шорт
*/ 


/* 
*  Спред вышу нуля и идет от нуля.
*  Первый сток - шорт
*  Второй сток - лонг
*/ 