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
	"qinghai": 1500,
	"shan1xi": 2800,
	"shan3xi": 2100,
	"shandong": 3000,
	"shanghai": 8000,
	"sichuan": 2000,
	"taiwan": 5000,
	"tianjin": 8000,
	"xianggang": 80000,
	"xinjiang": 1000,
	"xizang": 1200,
	"yunnan": 2000,
	"zhejiang": 3000
};
var cityDict = {
	"北京":"beijing","天津":"tianjin","石家庄":"hebei","唐山":"hebei","秦皇岛":"hebei","邯郸":"hebei","保定":"hebei","太原":"shan1xi","大同":"shan1xi","阳泉":"shan1xi","长治":"shan1xi","临汾":"shan1xi","呼和浩特":"neimenggu","包头":"neimenggu","赤峰":"neimenggu","沈阳":"liaoning","大连":"liaoning","鞍山":"liaoning","抚顺":"liaoning","本溪":"liaoning","锦州":"liaoning","长春":"jilin","吉林":"jilin","哈尔滨":"heilongjiang","齐齐哈尔":"heilongjiang","大庆":"haerbin","牡丹江":"haerbin","上海":"shanghai","南京":"jiangsu","无锡":"jiangsu","徐州":"jiangsu","常州":"jiangsu","苏州":"jiangsu","南通":"jiangsu","连云港":"jiangsu","扬州":"jiangsu","镇江":"jiangsu","杭州":"zhejiang","宁波":"zhejiang","温州":"zhejiang","嘉兴":"zhejiang","湖州":"zhejiang","绍兴":"zhejiang","台州":"zhejiang","合肥":"anhui","芜湖":"anhui","马鞍山":"anhui","福州":"fujian","厦门":"fujian","泉州":"fujian","南昌":"jiangxi","九江":"jiangxi","济南":"shandong","青岛":"shandong","淄博":"shandong","枣庄":"shandong","烟台":"shandong","潍坊":"shandong","济宁":"shandong","泰安":"shandong","威海":"shandong","日照":"shandong","郑州":"henan","开封":"henan","洛阳":"henan","平顶山":"henan","安阳":"henan","焦作":"henan","三门峡":"henan","武汉":"hubei","宜昌":"hubei","荆州":"hubei","长沙":"hunan","株洲":"hunan","湘潭":"hunan","岳阳":"hunan","常德":"hunan","张家界":"hunan","广州":"guangdong","韶关":"guangdong","深圳":"guangdong","珠海":"guangdong","汕头":"guangdong","佛山":"guangdong","湛江":"guangdong","中山":"guangdong","南宁":"guangxi","柳州":"guangxi","桂林":"guangxi","北海":"guangxi","海口":"hainan","三亚":"hainan","成都":"sichuan","重庆":"chongqing","自贡":"sichuan","攀枝花":"sichuan","泸州":"sichuan","德阳":"chongqing","绵阳":"sichuan","南充":"sichuan","宜宾":"sichuan","贵阳":"guizhou","遵义":"guizhou","昆明":"yunnan","曲靖":"yunnan","玉溪":"yunnan","拉萨":"xizang","西安":"shan3xi","铜川":"shan3xi","宝鸡":"shan3xi","咸阳":"shan3xi","渭南":"shan3xi","延安":"shan3xi","兰州":"gansu","金昌":"gansu","西宁":"qinghai","银川":"ningxia","石嘴山":"ningxia","乌鲁木齐":"xinjiang","克拉玛依":"xinjiang"
}
var proDict = {
	1:"beijing",2:"tianjin",3:"hebei",4:"hebei",5:"hebei",6:"hebei",7:"hebei",8:"shan1xi",9:"shan1xi",10:"shan1xi",11:"shan1xi",12:"shan1xi",13:"neimenggu",14:"neimenggu",15:"neimenggu",16:"liaoning",17:"liaoning",18:"liaoning",19:"liaoning",20:"liaoning",21:"liaoning",22:"jilin",23:"jilin",24:"heilongjiang",25:"heilongjiang",26:"haerbin",27:"haerbin",28:"shanghai",29:"jiangsu",30:"jiangsu",31:"jiangsu",32:"jiangsu",33:"jiangsu",34:"jiangsu",35:"jiangsu",36:"jiangsu",37:"jiangsu",38:"zhejiang",39:"zhejiang",40:"zhejiang",41:"zhejiang",42:"zhejiang",43:"zhejiang",44:"zhejiang",45:"anhui",46:"anhui",47:"anhui",48:"fujian",49:"fujian",50:"fujian",51:"jiangxi",52:"jiangxi",53:"shandong",54:"shandong",55:"shandong",56:"shandong",57:"shandong",58:"shandong",59:"shandong",60:"shandong",61:"shandong",62:"shandong",63:"henan",64:"henan",65:"henan",66:"henan",67:"henan",68:"henan",69:"henan",70:"hubei",71:"hubei",72:"hubei",73:"hunan",74:"hunan",75:"hunan",76:"hunan",77:"hunan",78:"hunan",79:"guangdong",80:"guangdong",81:"guangdong",82:"guangdong",83:"guangdong",84:"guangdong",85:"guangdong",86:"guangdong",87:"guangxi",88:"guangxi",89:"guangxi",90:"guangxi",91:"hainan",92:"hainan",93:"sichuan",94:"chongqing",95:"sichuan",96:"sichuan",97:"sichuan",98:"chongqing",99:"sichuan",100:"sichuan",101:"sichuan",102:"guizhou",103:"guizhou",104:"yunnan",105:"yunnan",106:"yunnan",107:"xizang",108:"shan3xi",109:"shan3xi",110:"shan3xi",111:"shan3xi",112:"shan3xi",113:"shan3xi",114:"gansu",115:"gansu",116:"qinghai",117:"ningxia",118:"ningxia",119:"xinjiang",120:"xinjiang"
}

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
allHis();
