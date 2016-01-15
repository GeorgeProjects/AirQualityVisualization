//-*- coding: utf-8 -*-
//--------------------------------------------
//time : 2016-1-12
//operation: call the other functions in each view
//Li Guozheng
//--------------------------------------------

var dataCenter = new Object();
var mapScale = 3000;
var dict = {
	"anhui": 3000,
	"aomen": 30000,
	"beijing": 8000,
	"chongqing": 6000,
	"fujian": 3000,
	"gansu": 1500,
	"guangdong": 3000,
	"guangxi": 3000,
	"guizhou": 3000,
	"hainan": 7000,
	"hebei": 2500,
	"heilongjiang": 1200,
	"henan": 3000,
	"hubei": 3000,
	"hunan": 3000,
	"jiangsu": 3000,
	"jiangxi": 3000,
	"jilin": 2500,
	"liaoning": 3000,
	"neimenggu": 800,
	"ningxia": 4000,
	"qinghai": 2000,
	"shan1xi": 2800,
	"shan3xi": 2100,
	"shandong": 3000,
	"shanghai": 8000,
	"sichuan": 2000,
	"taiwan": 5000,
	"tianjin": 8000,
	"xianggang": 80000,
	"xinjiang": 1000,
	"xizang": 1500,
	"yunnan": 2000,
	"zhejiang": 3000
};
var Worst = d3.rgb(215,25,28);//红色
var Best = d3.rgb(26,150,65);//绿色
var compute = d3.interpolate(Best,Worst);
var colorLinear = d3.scale.linear()
			.range([0,1])
			.domain([37,136]);
aqi();
barchart();
nationMap();
provinceMap();
