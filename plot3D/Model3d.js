








//import flash.system.fscommand;
var Model3dEvalMode=true;
function Model3d(width0,height0,funcName0,xseg0,yseg0,scaleShape0,hideBack0,scaleU0,scaleV0,rotationType0,useSmooth0){
	if(arguments.length<11)useSmooth0=false;
	if(arguments.length<10)rotationType0=0;
	if(arguments.length<9)scaleV0=1;
	if(arguments.length<8)scaleU0=1;
	if(arguments.length<7)hideBack0=0;
	if(arguments.length<6)scaleShape0=1;
	if(arguments.length<5)yseg0=50;
	if(arguments.length<4)xseg0=50;
	if(arguments.length<3)funcName0="";//构造方法
	
	
	this.model=null;
	var evalMode=true;
	
	//var renderingVector.<Number>=new Vector.<Number>(4);
	//var renderingVector2.<Number>=new Vector.<Number>(4);
	//var meshBmd=null;//网格相应的位图
	var functionMaxLeng=100;
	var num1;//f(x,y)的数值和返回地址表
	var oper1;//f(x,y)的运算符表（为正时表示用的是数值，为负时表示用的是链接地址，为零时表示返回或结束）
	var num2;//g(x,y)的数值和返回地址表
	var oper2;//g(x,y)的运算符表（为正时表示用的是数值，为负时表示用的是链接地址，为零时表示返回或结束）
	var num3;//h(x,y)的数值和返回地址表
	var oper3;//h(x,y)的运算符表（为正时表示用的是数值，为负时表示用的是链接地址，为零时表示返回或结束）
	var con1;//f(x,y)的常量表
	var con2;//g(x,y)的常量表
	var con3;//h(x,y)的常量表
	var stackMaxLeng=50;
	var stack0;//公式编译用的字符串索引“栈”（表左括号后第一个字符的索引）
	var stack1;//公式编译用的返回地址“栈”（表括号内运算后返回的（数值和返回地址表）的地址）
	var stackTop=-1;//编译用的“栈”顶端索引
	var numLengArray=[0,0,0];
	var conLengArray=[0,0,0];//var strkh:String;//加了括号的字符串
	var strFunc1="";//f(x)的公式字符串
	var strFunc2="";//g(x)的公式字符串
	var strFunc3="";//h(x)的公式字符串
	this.xseg,this.yseg;//x方向分段，y方向分段
	var funcName="";//函数全名
	this.cnt;//常量
	this.drawType2=0;//函数呈现方式
	this.strResult1="empty";//函数编译结果情况
	this.strResult2="empty";
	this.strResult3="empty";
	this.scaleU;//u贴图坐标缩放比例
	this.scaleV;//v贴图坐标缩放比例
	this.useArgumentFormula=false;
	this.uclosed=false;//模型为参数方程时，沿贴图u方向闭合
	this.vclosed=false;//模型为参数方程时，沿贴图v方向闭合
	this.NaNMode=2;//非数值的处理方式
	this.modelHeight=0;
	this.funcArray=[];
	
	this.createNew=createNew0;
	this.updateFunction=Model3dEvalMode?updateFunction0:updateFunction0Old;
	this.prePlotGrid=prePlotGrid0;
	this.calculateArray=calculateArray0;
	this.createNew(width0,height0,funcName0,xseg0,yseg0,scaleShape0,hideBack0,scaleU0,scaleV0,rotationType0,useSmooth0);
	function createNew0(width0,height0,funcName0,xseg0,yseg0,scaleShape0,hideBack0,scaleU0,scaleV0,rotationType0,useSmooth0){
		
		var a=0,b=1,c=1,d=0.61803398874989484820,e=Math.E,f=0.5772156649015328;//h(x,y)的运算符表（为正时表示用的是数值，为负时表示用的是链接地址，为零时表示返回或结束）
		var pipeStart=funcName0.indexOf("|");//f(x,y)的常量表
		var fileName=pipeStart>=0?funcName0.substring(pipeStart):"";//g(x,y)的常量表
		this.model=new Viewer3d(width0,height0,fileName,hideBack0,rotationType0,useSmooth0);
		funcName=pipeStart>=0?funcName0.substring(0,pipeStart):funcName0;//h(x,y)的常量表
		this.xseg=xseg0;
		this.yseg=yseg0;//公式编译用的字符串索引“栈”（表左括号后第一个字符的索引）
		this.cnt=[a,b,c,d,e,f];//公式编译用的返回地址“栈”（表括号内运算后返回的（数值和返回地址表）的地址）
		var lf=functionMaxLeng;
		num1=new Array(lf);
		oper1=new Array(lf);
		num2=new Array(lf);
		oper2=new Array(lf);
		num3=new Array(lf);
		oper3=new Array(lf);
		con1=new Array(lf);//获取彩虹等高线的渲染程序，需要事先申请到context3d。//渲染程序
		con2=new Array(lf);//着色范围是色相环的六分之rate
		con3=new Array(lf);//色相环的高度
		var ls=functionMaxLeng;
		stack0=new Array(ls);
		stack1=new Array(ls);
		this.model.scaleShape=scaleShape0;
		this.scaleU=scaleU0;
		this.scaleV=scaleV0;
		
		this.updateFunction(funcName);
	}
	
	function updateFunction0(funcName0,hideBack0,xseg0,yseg0,useUvm20){
		if(arguments.length<=4)useUvm20=-1;
		if(arguments.length<=3)yseg0=0;
		if(arguments.length<=2)xseg0=0;
		if(arguments.length<=1)hideBack0=-2;
		if(arguments.length<=0)funcName0="";
		var funcArray=String(funcName0).split(",");
		var braceLevel=0;
		var i,j,k,l;
		var str;
		i=0;
		while(i<funcArray.length){
			str=funcArray[i];
			braceLevel=0;
			for(j=0;j<str.length;j++){
				if(str.charAt(j)=="("){
					braceLevel++;
				}else if(str.charAt(j)==")"){
					braceLevel--;
				}
			}
			if(braceLevel>0 && i+1<funcArray.length){
				funcArray[i]+=","+funcArray[i+1];
				funcArray.splice(i+1,1);
			}else{
				i++;
			}
		}
		var mode=-1;
		
		for(i=0;i<funcArray.length;i++){
			str=funcArray[i];
			str=str.replace(/([xyz\\)])([a-z\(])/g,"$1*$2");
			str=str.replace(/([xyz])([xyz])/g,"$1*$2");
			str=str.replace(/([A-Z])([xyz])/g,"$1*$2");
			str=str.replace(/([xyz])([A-Z])/g,"$1*$2");
			str=str.replace(/(^|\W)([0-9.])+([A-Za-z])/g,"$1$2*$3");
			str=str.replace(/([a-w][a-w0-9]*\()/g,"Math.$1");
			str=str.replace(/(^|\W)([A-Z][A-Z0-9_]*)(\W|$)/g,"$1Math.$2$3");
			str=str.replace(/(^|\W)Math.Math./g,"$1Math.");
			str=str.replace(/(^|\W)Math\.P(\W|$)/g,"$1Math.PI$2");
			str=str.replace(/(^|\W)Math\.max\*\(/g,"$1Math.max(");
			j=str.indexOf("^");
			mode=-1;
			while(j>=0){
				k=j-1;
				l=j+1;
				braceLevel=0;
				mode=-1;
				if(k>=0 && str.charAt(k).match(/[A-Za-z0-9_\.]/)){
					mode=0;
				}else if(k>=0 && str.charAt(k)==")"){
					mode=1;
					braceLevel=1;
				}
				if(mode==-1){
					break;
				}
				k--;
				while(k>=0){
					if(mode==0 && !str.charAt(k).match(/[A-Za-z0-9_\.]/)){
						break;
					}else if(mode==1 && str.charAt(k)==")"){
						braceLevel++;
					}else if(mode==1 && str.charAt(k)=="("){
						braceLevel--;
						if(braceLevel<=0){
							mode=0;
						}
					}
					k--;
				}
				k++;
				
				if(l<str.length && str.charAt(l).match(/[A-Za-z0-9_\.]/)){
					mode=0;
				}else if(l<str.length && str.charAt(l)=="("){
					mode=1;
					braceLevel=1;
				}
				if(mode==-1){
					break;
				}
				l++;
				while(l<str.length){
					if(mode==0 && str.charAt(l)=="("){
						mode=1;
						braceLevel=1;
					}else if(mode==0 && !str.charAt(l).match(/[A-Za-z0-9_\.]/)){
						break;
					}else if(mode==1 && str.charAt(l)=="("){
						braceLevel++;
					}else if(mode==1 && str.charAt(l)==")"){
						braceLevel--;
						if(braceLevel<=0){
							l++;
							break;
						}
					}
					l++;
				}
				if(k<0 || l>str.length){
					break;
				}
				str=str.substring(0,k)+"Math.pow("+str.substring(k,j)+","+str.substring(j+1,l)+")"+(l<str.length?str.substring(l):"");
				j=str.indexOf("^");
			}
			
			funcArray[i]=str;
			//console.log(funcArray[i]);
		}
		this.funcArray=funcArray;
		this.drawType2=funcArray.length;
		if(funcArray.length<=3||funcArray[3].length<=0){
			this.uclosed=false;
			this.vclosed=false;
		}else if(funcArray[3].length==1){
			this.uclosed=funcArray[3]=="%";
			this.vclosed=false;
		}else{
			this.uclosed=funcArray[3].substr(0,1)=="%";
			this.vclosed=funcArray[3].substr(1,1)=="%";
		}
		if(hideBack0==0||hideBack0==1||hideBack0==-1){
			this.model.hideBack=hideBack0;
		}
		if(xseg0>0){
			this.xseg=xseg0;
		}
		if(yseg0>0){
			this.yseg=yseg0;
		}
		if(useUvm20==0||useUvm20==1){
			useUvm2=useUvm20!=0;
		}
		this.prePlotGrid(true);
	}
	
	function updateFunction0Old(funcName0,hideBack0,xseg0,yseg0,useUvm20){
		if(arguments.length<=4)useUvm20=-1;
		if(arguments.length<=3)yseg0=0;
		if(arguments.length<=2)xseg0=0;
		if(arguments.length<=1)hideBack0=-2;
		if(arguments.length<=0)funcName0="";
		var func=funcName0.split(",");
		this.drawType2=func.length<=3?func.length:3;
		if(this.drawType2>=1){
			strFunc1=func[0];
			strFunc1=readstring(strFunc1,1);
			this.strResult1=compileWithStack(strFunc1,num1,oper1,con1,0);
		}else{
			strFunc1="";
		}//trace("______________________________");
		//trace(num1);
		//trace(oper1);
		//trace(con1);
		if(this.drawType2>=2){
			strFunc2=func[1];
			strFunc2=readstring(strFunc2,2);
			this.strResult2=compileWithStack(strFunc2,num2,oper2,con2,1);
		}else{
			strFunc2="";
		}
		if(this.drawType2>=3){
			strFunc3=func[2];
			strFunc3=readstring(strFunc3,3);
			this.strResult3=compileWithStack(strFunc3,num3,oper3,con3,2);
			this.useArgumentFormula=true;
		}else{
			strFunc3="";
			this.useArgumentFormula=false;
		}
		if(func.length<=3||func[3].length<=0){
			this.uclosed=false;
			this.vclosed=false;
		}else if(func[3].length==1){
			this.uclosed=func[3]=="%";
			this.vclosed=false;
		}else{
			this.uclosed=func[3].substr(0,1)=="%";
			this.vclosed=func[3].substr(1,1)=="%";
		}
		if(hideBack0==0||hideBack0==1||hideBack0==-1){
			this.model.hideBack=hideBack0;
		}
		if(xseg0>0){
			this.xseg=xseg0;
		}
		if(yseg0>0){
			this.yseg=yseg0;
		}
		if(useUvm20==0||useUvm20==1){
			useUvm2=useUvm20!=0;
		}
		if(strFunc1==""||strFunc2==""||strFunc3==""){
		}
		this.prePlotGrid(true);
		
		//this.modelHeight=maxz-minz;//plot();
	}
	
	
	
	function readstring(strFunc0,numLengid){
		if(arguments.length<2)numLengid=1;//预编译字符串，包括加入必要的乘号
		var strFunc=strFunc0;
		while(strFunc.indexOf("\r")>=0){
			strFunc=strFunc.replace("\r","");
		}
		while(strFunc.indexOf(" ")>=0){
			strFunc=strFunc.replace(" ","");
		}
		var strLeng=strFunc.length;
		var i=0,j=0,grade=1,nstrFunc,numflag=false;
		nstrFunc="";
		for(i=0;i<strLeng;i++){
			if((strFunc.charCodeAt(i-1)>=48&&strFunc.charCodeAt(i-1)<=57||strFunc.charAt(i-1)=="."||strFunc.charAt(i-1)==")"||strFunc.charCodeAt(i-1)>=65&&strFunc.charCodeAt(i-1)<=70||strFunc.charAt(i-1)=="x"||strFunc.charAt(i-1)=="y"||strFunc.charAt(i-1)=="P")&&(strFunc.charAt(i)=="x"||strFunc.charAt(i)=="y"||strFunc.charAt(i)=="P"||strFunc.charAt(i)=="("||strFunc.charCodeAt(i)>=65&&strFunc.charCodeAt(i)<=70||strFunc.charCodeAt(i)>=97&&strFunc.charCodeAt(i)<=119)&&i>=1){
				nstrFunc+=strFunc.substring(j,i)+"*";
				j=i;
			}
		}
		nstrFunc+=strFunc.substring(j,i);
		strFunc=nstrFunc;
		nstrFunc="";
		strLeng=strFunc.length;
		j=0;
		stackTop=-1;
		return strFunc;
	}
	
	function compileWithStack(strFunc,num,oper,con,numConLengId){
		//借助堆栈编译字符串，函数字符串可省略乘号和右括号
		var beginIndex=0,returni=-1;
		var strLeng=strFunc.length;
		numLengArray[numConLengId]=0;
		conLengArray[numConLengId]=0;
		var numLeng=0;
		var stackTopPrev=0;
		if(strFunc==""){
			numLeng=0;
			numLengArray[numConLengId]=numLeng;
			conLengArray[numConLengId]=0;
			return "empty";
		}
		var i=beginIndex,j=beginIndex;
		var khlevel=0;
		var numflag=false;
		var operstr;
		var operstrj=0;
		var operi=0;
		var numBegin=numLeng;
		var numLeng2=0;
		var firstPlusFlag=false;
		var stackTop0=stackTop+1;
		var stackTopt=stackTop0;
		var willAdjustPower=false;
		var firstTimesFlag=false;
		var numLeng2m=0;
		var resultStr="";
		var isNum=false;//判断某位是否可作为为数值、自变量或常量
		var strji="";//截取后的数值字符串
		do{
			i=beginIndex,j=beginIndex;
			khlevel=0;
			numflag=false;
			operstrj=0;
			operi=0;
			numBegin=numLeng;
			numLeng2=0;
			firstPlusFlag=false;
			stackTop0=stackTop+1;
			stackTopt=stackTop0;
			willAdjustPower=false;
			firstTimesFlag=false;
			numLeng2m=0;
			resultStr="";
			isNum=false;//判断某位是否可作为为数值、自变量或常量
			strji="";//截取后的数值字符串
			if(numLeng>=100-1){
				numLeng=0;
				numLengArray[numConLengId]=numLeng;
				conLengArray[numConLengId]=0;
				return "numLeng error";
			}
			for(i=beginIndex;i<strLeng;i++){
				isNum=(strFunc.charCodeAt(i)>=48&&strFunc.charCodeAt(i)<=57||strFunc.charAt(i)=="."||strFunc.charAt(i)=="x"||strFunc.charAt(i)=="y"||strFunc.charAt(i)=="P"||strFunc.charCodeAt(i)>=65&&strFunc.charCodeAt(i)<=70);
				if(khlevel==0&&isNum){
					if(numflag==false){
						numflag=true;
						j=i;
					}
				}
				if(numflag&&(!isNum||khlevel!=0||i==strLeng-1)){
					numflag=false;
					strji=strFunc.substring(j,isNum?i+1:i);
					if(conLengArray[numConLengId]>=100-1){
						numLeng=0;
						numLengArray[numConLengId]=numLeng;
						conLengArray[numConLengId]=0;
						return "conLeng error";
					}
					if(strji=="x"){
						num[numLeng]=-1;
					}else if(strji=="P"){
						con[conLengArray[numConLengId]]=Math.PI;
						num[numLeng]=conLengArray[numConLengId];
						conLengArray[numConLengId]++;
					}else if(!isNaN(Number(strji))){
						con[conLengArray[numConLengId]]=Number(strji);
						num[numLeng]=conLengArray[numConLengId];
						conLengArray[numConLengId]++;
					}else{
						num[numLeng]=-1;
					}
					if(j==beginIndex){
						oper[numLeng]=1;
					}else{
						operstr=strFunc.charAt(j-1);
						switch(operstr){
							case "+":oper[numLeng]=1;
							break;
							case "-":oper[numLeng]=2;
							break;
							case "*":oper[numLeng]=3;
							break;
							case "/":oper[numLeng]=4;
							break;
							case "^":oper[numLeng]=5;
							break;
							case "%":oper[numLeng]=6;
							break;
							/*case ")" :
									break;*/
							default:numLeng=0;
							numLengArray[numConLengId]=numLeng;
							conLengArray[numConLengId]=0;
							return "opeator error";
							break;
						}
					}
					if(strji=="y"&&oper[numLeng]>0){
						oper[numLeng]+=8;
					}else if(strji=="A"&&oper[numLeng]>0){
						oper[numLeng]+=16;
					}else if(strji=="B"&&oper[numLeng]>0){
						oper[numLeng]+=24;
					}else if(strji=="C"&&oper[numLeng]>0){
						oper[numLeng]+=32;
					}else if(strji=="D"&&oper[numLeng]>0){
						oper[numLeng]+=40;
					}else if(strji=="E"&&oper[numLeng]>0){
						oper[numLeng]+=48;
					}else if(strji=="F"&&oper[numLeng]>0){
						oper[numLeng]+=56;
					}
					if(num[numLeng]<0&&strji!="x"&&oper[numLeng]<8){
						//未识别的数值
						numLeng=0;
						numLengArray[numConLengId]=numLeng;
						conLengArray[numConLengId]=0;
						return "number error";
					}
					j=i;
					numLeng++;
				}
				if(i==strLeng-1&&!isNum&&strFunc.charAt(i)!=")"){
					//函数不完整
					numLeng=0;
					numLengArray[numConLengId]=numLeng;
					conLengArray[numConLengId]=0;
					return "not complete error";
				}
				if(strFunc.charAt(i)=="("){
					if(khlevel==0){
						num[numLeng]=-1;
						if(stackTop>=50-1){
							numLeng=0;
							numLengArray[numConLengId]=numLeng;
							conLengArray[numConLengId]=0;
							return "stack error";
						}else{
							stackTop++;
							stack0[stackTop]=i+1;
							stack1[stackTop]=numLeng;
						}
						if(i>=6&&strFunc.substring(i-6,i)=="arcsin"){
							oper[numLeng]=-56;
							operstrj=i-7;
						}else if(i>=6&&strFunc.substring(i-6,i)=="arccos"){
							oper[numLeng]=-64;
							operstrj=i-7;
						}else if(i>=6&&strFunc.substring(i-6,i)=="arctan"){
							oper[numLeng]=-72;
							operstrj=i-7;
						}else if(i>=3&&strFunc.substring(i-3,i)=="sin"){
							oper[numLeng]=-8;
							operstrj=i-4;
						}else if(i>=3&&strFunc.substring(i-3,i)=="cos"){
							oper[numLeng]=-16;
							operstrj=i-4;
						}else if(i>=3&&strFunc.substring(i-3,i)=="tan"){
							oper[numLeng]=-24;
							operstrj=i-4;
						}else if(i>=2&&strFunc.substring(i-2,i)=="ln"){
							oper[numLeng]=-32;
							operstrj=i-3;
						}else if(i>=3&&strFunc.substring(i-3,i)=="lif"){
							oper[numLeng]=-40;
							operstrj=i-4;
						}else if(i>=4&&strFunc.substring(i-4,i)=="sqrt"){
							oper[numLeng]=-48;
							operstrj=i-5;
						}else if(i>=3&&strFunc.substring(i-3,i)=="rif"){
							oper[numLeng]=-80;
							operstrj=i-4;
						}else if(i>=3&&strFunc.substring(i-3,i)=="bif"){
							oper[numLeng]=-88;
							operstrj=i-4;
						}else if(i>=3&&strFunc.substring(i-3,i)=="abs"){
							oper[numLeng]=-96;
							operstrj=i-4;
						}else if(i>=3&&strFunc.substring(i-3,i)=="fif"){
							oper[numLeng]=-104;
							operstrj=i-4;
						}else if(i>=5&&strFunc.substring(i-5,i)=="floor"){
							oper[numLeng]=-112;
							operstrj=i-6;
						}else{
							oper[numLeng]=0;
							operstrj=i-1;
						}
						if(operstrj<beginIndex){
							oper[numLeng]+=-1;
						}else{
							operstr=strFunc.charAt(operstrj);
							switch(operstr){
								case "+":oper[numLeng]+=-1;
								break;
								case "-":oper[numLeng]+=-2;
								break;
								case "*":oper[numLeng]+=-3;
								break;
								case "/":oper[numLeng]+=-4;
								break;
								case "^":oper[numLeng]+=-5;
								break;
								case "%":oper[numLeng]+=-6;
								break;
								case "(":break;
								default:numLeng=0;
								numLengArray[numConLengId]=numLeng;
								conLengArray[numConLengId]=0;
								return "minus operator error";
								break;
							}
						}
						numLeng++;
						khlevel++;
					}else{
						khlevel++;
					}
				}else if(strFunc.charAt(i)==")"){
					if(khlevel==0){
						num[numLeng]=returni;
						oper[numLeng]=0;
						numLeng++;
						break;
					}else if(khlevel>0){
						khlevel--;
					}else{
						numLeng=0;
						numLengArray[numConLengId]=numLeng;
						conLengArray[numConLengId]=0;
						return "quote error";
					}
				}
				if(numLeng>=100-1){
					numLeng=0;
					numLengArray[numConLengId]=numLeng;
					conLengArray[numConLengId]=0;
					return "numLeng error";
				}
			}
			if(numLeng>0&&oper[numLeng-1]!=0||numLeng==0){
				num[numLeng]=returni;
				oper[numLeng]=0;
				numLeng++;
			}
			numLeng2=numLeng;
			if(numLeng>=100-1){
				numLeng=0;
				numLengArray[numConLengId]=numLeng;
				conLengArray[numConLengId]=0;
				return "numLeng error";
			}
			numLeng2=numLeng;
			firstPlusFlag=true;
			firstTimesFlag=true;//trace(numLeng);
			for(i=numBegin;i<numLeng;i++){
				//抽取运算主干。抽取的是加减法，和第一项无取反运算时该项的乘除法，并将操作数改成抽取源的位置编号。
				operi=oper[i]>=0?(oper[i]&7):(oper[i]|120);
				if(operi==1&&i>numBegin||operi==2||operi==-1&&i>numBegin||operi==-2){
					num[numLeng2]=i;//oper[numLeng2]=oper[i]>=0?oper[i]+(j<<7):oper[i]-(j<<7);
					oper[numLeng2]=oper[i];
					numLeng2++;
					firstPlusFlag=false;
				}else if(operi==1||operi==-1||(operi==3||operi==4||operi==5||operi==6||operi==-3||operi==-4||operi==-5||operi==-6)&&firstPlusFlag||operi==0){
					num[numLeng2]=i;
					oper[numLeng2]=oper[i];
					numLeng2++;
				}
				if(operi==1||operi==-1||operi==2||operi==-2||operi==0){
					firstTimesFlag=true;
				}else if(operi==3||operi==4||operi==6||operi==-3||operi==-4||operi==-6){
					firstTimesFlag=false;
				}else if(!firstTimesFlag&&(operi==5||operi==-5)){
					willAdjustPower=true;
				}
				if(numLeng2>=100-1){
					numLeng=0;
					numLengArray[numConLengId]=numLeng;
					conLengArray[numConLengId]=0;
					return "numLeng2 error";
				}
			}//cal1Count=((numLeng2-numLeng)>>1);
			numLeng2m=numLeng2;
			firstPlusFlag=true;
			for(i=numLeng;i<numLeng2m&&i<100-2;i++){
				//i++
				//j=oper[i]>=0?oper[i]>>7:(-oper[i])>>7;
				//oper+=oper[i]>0?-(j<<7):j<<7;
				j=num[i];
				operi=oper[i]>=0?(oper[i]&7):(oper[i]|120);
				if(firstPlusFlag&&(operi==1&&i>numLeng||operi==2||operi==-1&&i>numLeng||operi==-2)){
					firstPlusFlag=false;
				}
				operi=oper[j+1]>=0?(oper[j+1]&7):(oper[j+1]|120);
				if(!firstPlusFlag&&(operi==3||operi==4||operi==5||operi==6||operi==-3||operi==-4||operi==-5||operi==-6)){
					if(oper[i]>0){
						num[i]=numLeng2-numLeng+numBegin;
						num[numLeng2]=num[j];
						oper[numLeng2]=((oper[i]&120)|1);
						oper[i]=-(oper[i]&7);//
						numLeng2++;
					}else if(oper[i]<0){
						num[i]=numLeng2-numLeng+numBegin;
						num[numLeng2]=num[j];
						oper[numLeng2]=(oper[i]|7);
						oper[i]=(oper[i]|120);
						while(stackTopt<=stackTop){
							if(stack1[stackTopt]==j){
								stack1[stackTopt]=num[i];
								break;
							}
							stackTopt++;
						}
						numLeng2++;
					}else{
						num[i]=num[j];
						break;
					}
					if(numLeng2>=100-1){
						numLeng=0;
						numLengArray[numConLengId]=numLeng;
						conLengArray[numConLengId]=0;
						return "numLeng2 error";
					}
					operi=oper[j+1]>=0?(oper[j+1]&7):(oper[j+1]|120);
					firstTimesFlag=true;
					for(j=j+1;operi==3||operi==4||operi==5||operi==6||operi==-3||operi==-4||operi==-5||operi==-6;j++){
						num[numLeng2]=num[j];
						oper[numLeng2]=oper[j];
						while(operi<0&&stackTopt<=stackTop){
							if(stack1[stackTopt]==j){
								stack1[stackTopt]=numLeng2-numLeng+numBegin;
								break;
							}
							stackTopt++;
						}
						numLeng2++;
						if(numLeng2>=100-1){
							numLeng=0;
							numLengArray[numConLengId]=numLeng;
							conLengArray[numConLengId]=0;
							return "numLeng2 error";
						}
						operi=oper[j+1]>=0?(oper[j+1]&7):(oper[j+1]|120);
					}
					num[numLeng2]=i-numLeng+numBegin;
					oper[numLeng2]=0;
					numLeng2++;
					if(numLeng2>=100-1){
						numLeng=0;
						numLengArray[numConLengId]=numLeng;
						conLengArray[numConLengId]=0;
						return "numLeng2 error";
					}
				}else{
					num[i]=num[j];
				}
				/*if (oper[i+1]==0) {
						num[i+1]=num[num[i+1]];
					}*/
			}
			for(i=numLeng,j=numBegin;i<numLeng2;i++,j++){
				//if (oper[i]==7) {
				//i++;
				//}
				num[j]=num[i];
				oper[j]=oper[i];
			}
			numLeng=j;
			if(willAdjustPower){
				numLeng2=numLeng;
				stackTopt=stackTop0;
				firstTimesFlag=true;//trace(numLeng);
				for(i=numBegin;i<numLeng;i++){
					//抽取运算主干。
					operi=oper[i]>=0?(oper[i]&7):(oper[i]|120);
					if(operi==1||operi==-1||operi==2||operi==-2){
						num[numLeng2]=i;
						oper[numLeng2]=oper[i];
						numLeng2++;
						firstTimesFlag=true;
					}else if(operi==3||operi==4||operi==6||operi==-3||operi==-4||operi==-6){
						num[numLeng2]=i;
						oper[numLeng2]=oper[i];
						numLeng2++;
						firstTimesFlag=false;
					}else if(firstTimesFlag&&(operi==5||operi==-5)||operi==0){
						num[numLeng2]=i;
						oper[numLeng2]=oper[i];
						numLeng2++;
					}
					if(numLeng2>=100-1){
						numLeng=0;
						numLengArray[numConLengId]=numLeng;
						conLengArray[numConLengId]=0;
						return "numLeng2 error";
					}
				}
				numLeng2m=numLeng2;
				firstTimesFlag=true;
				for(i=numLeng;i<numLeng2m&&i<100-2;i++){
					//i++
					//j=oper[i]>=0?oper[i]>>7:(-oper[i])>>7;
					//oper+=oper[i]>0?-(j<<7):j<<7;
					j=num[i];
					operi=oper[i]>=0?(oper[i]&7):(oper[i]|120);
					if(operi==1||operi==-1||operi==2||operi==-2){
						firstTimesFlag=true;
					}else if(operi==3||operi==4||operi==6||operi==-3||operi==-4||operi==-6){
						firstTimesFlag=false;
					}
					operi=oper[j+1]>=0?(oper[j+1]&7):(oper[j+1]|120);
					if(!firstTimesFlag&&(operi==5||operi==-5)){
						if(oper[i]>0){
							num[i]=numLeng2-numLeng+numBegin;
							num[numLeng2]=num[j];
							oper[numLeng2]=((oper[i]&120)|1);
							oper[i]=-(oper[i]&7);//
							numLeng2++;
						}else if(oper[i]<0){
							num[i]=numLeng2-numLeng+numBegin;
							num[numLeng2]=num[j];
							oper[numLeng2]=(oper[i]|7);
							oper[i]=(oper[i]|120);
							stackTopt=stackTop0;
							while(stackTopt<=stackTop){
								if(stack1[stackTopt]==j){
									stack1[stackTopt]=num[i];
									break;
								}
								stackTopt++;
							}
							numLeng2++;
						}else{
							num[i]=num[j];
							break;
						}
						if(numLeng2>=100-1){
							numLeng=0;
							numLengArray[numConLengId]=numLeng;
							conLengArray[numConLengId]=0;
							return "numLeng2 error";
						}
						operi=oper[j+1]>=0?(oper[j+1]&7):(oper[j+1]|120);
						firstTimesFlag=true;
						for(j=j+1;operi==5||operi==-5;j++){
							num[numLeng2]=num[j];
							oper[numLeng2]=oper[j];
							stackTopt=stackTop0;
							while(operi<0&&stackTopt<=stackTop){
								if(stack1[stackTopt]==j){
									stack1[stackTopt]=numLeng2-numLeng+numBegin;
									break;
								}
								stackTopt++;
							}
							numLeng2++;
							if(numLeng2>=100-1){
								numLeng=0;
								numLengArray[numConLengId]=numLeng;
								conLengArray[numConLengId]=0;
								return "numLeng2 error";
							}
							operi=oper[j+1]>=0?(oper[j+1]&7):(oper[j+1]|120);
						}
						num[numLeng2]=i-numLeng+numBegin;
						oper[numLeng2]=0;
						numLeng2++;
						if(numLeng2>=100-1){
							numLeng=0;
							numLengArray[numConLengId]=numLeng;
							conLengArray[numConLengId]=0;
							return "numLeng2 error";
						}
					}else{
						num[i]=num[j];
					}
					/*if (oper[i+1]==0) {
							num[i+1]=num[num[i+1]];
						}*/
				}
				for(i=numLeng,j=numBegin;i<numLeng2;i++,j++){
					//if (oper[i]==7) {
					//i++;
					//}
					num[j]=num[i];
					oper[j]=oper[i];
				}
				numLeng=j;
			}
			stackTopPrev=stackTop;
			if(stackTop>=0){
				//trace(stackTop);
				num[stack1[stackTop]]=numLeng;
				stackTop--;
				beginIndex=stack0[stackTop+1],returni=stack1[stackTop+1];
			}
		}while(stackTopPrev>=0);
		for(i=numLeng;i<100;i++){
			if(num[i]==null&&oper[i]==null){
				break;
			}
			num[i]=null;
			oper[i]=null;
		}
		for(i=conLengArray[numConLengId];i<100;i++){
			if(con[i]==null){
				break;
			}
			con[i]=null;
		}
		numLengArray[numConLengId]=numLeng;
		return "complete";
	}
	
	function calculateArray0(xt,yt,num,oper,con,numConLengId){
		//计算函数
		var i=0;
		stackTop=0;
		stack0[0]=0;
		var numi=0;
		var operi=0;
		var operfi=0;
		var numLeng=numLengArray[numConLengId];
		var conLeng=conLengArray[numConLengId];
		if(numLeng<=0||numLeng>100){
			return NaN;
		}
		if(conLeng>100){
			return NaN;
		}//trace(xt);
		//var opergot:Number=0;
		for(i=0;i<numLeng;i++){
			if(oper[i]>0){
				numi=num[i]<0?(oper[i]<8?xt:(oper[i]<16?yt:this.cnt[(oper[i]>>3)-2])):(num[i]<conLeng?con[num[i]]:NaN);
			}else{
				numi=num[i];
			}
			operi=oper[i]>=0?(oper[i]&7):(oper[i]|120);//operfi=oper[i]>=0?0:(-oper[i])>>3;
			if(isNaN(stack0[stackTop])){
				return NaN;
			}else if(operi==1){
				stack0[stackTop]+=numi;
			}else if(operi==2){
				stack0[stackTop]-=numi;
			}else if(operi==3){
				stack0[stackTop]*=numi;
			}else if(operi==4){
				stack0[stackTop]=numi!=0?stack0[stackTop]/numi:NaN;
			}else if(operi==5){
				stack0[stackTop]=(stack0[stackTop]==0&&numi<=0)?NaN:Math.pow(stack0[stackTop],numi);
			}else if(operi==6){
				if(numi==0){
					stack0[stackTop]=NaN;
				}else{
					stack0[stackTop]=stack0[stackTop]-Math.floor(stack0[stackTop]/Math.abs(numi))*Math.abs(numi);
				}
			}else if(operi==0){
				if(stackTop<=0){
					return stack0[0];
				}else{
					if(parseInt(num[i])<0){
						return NaN;
					}
					i=parseInt(num[i]);//trace(stack0[stackTop]);
					numi=stack0[stackTop];
					operi=oper[i]>=0?(oper[i]&7):(oper[i]|120);
					operfi=oper[i]>=0?0:(-oper[i])>>3;
					if(isNaN(numi)){
						return NaN;
					}else if(operfi==0){
					}else if(operfi==1){
						numi=Math.sin(numi);
					}else if(operfi==2){
						numi=Math.cos(numi);
					}else if(operfi==3){
						numi=Math.tan(numi);
						if(numi>9.9||numi<-9.9)numi=NaN;
					}else if(operfi==4){
						numi=numi!=0?Math.log(numi):NaN;
					}else if(operfi==5){
						numi=xt>=numi?1:NaN;
					}else if(operfi==6){
						numi=Math.sqrt(numi);
					}else if(operfi==7){
						numi=Math.asin(numi);
					}else if(operfi==8){
						numi=Math.acos(numi);
					}else if(operfi==9){
						numi=Math.atan(numi);
					}else if(operfi==10){
						numi=xt<=numi?1:NaN;
					}else if(operfi==11){
						numi=yt>=numi?1:NaN;
					}else if(operfi==12){
						numi=Math.abs(numi);
					}else if(operfi==13){
						numi=yt<=numi?1:NaN;
					}else if(operfi==14){
						numi=numi>=0?parseInt(numi):parseInt(numi)-1;
					}
					if(operi==-1){
						stack0[stackTop-1]+=numi;
					}else if(operi==-2){
						stack0[stackTop-1]-=numi;
					}else if(operi==-3){
						stack0[stackTop-1]*=numi;
					}else if(operi==-4){
						stack0[stackTop-1]=numi!=0?stack0[stackTop-1]/numi:NaN;
					}else if(operi==-5){
						stack0[stackTop-1]=(stack0[stackTop-1]==0&&numi<=0)?NaN:Math.pow(stack0[stackTop-1],numi);
					}else if(operi==-6){
						stack0[stackTop-1]%=numi;
					}else{
						return NaN;
					}
					stackTop--;
				}
			}else if(operi<0){
				i=parseInt(num[i])-1;
				if(stackTop>=50-1||i<0){
					return NaN;
				}else{
					stackTop++;
					stack0[stackTop]=0;
				}
			}else{
				return NaN;
				break;
			}
		}
		return stack0[0];
	}
	
	this.calculateFromFuncNum=function(xt,yt,funcnum){
		var result=NaN;
		if(!Model3dEvalMode){
			switch(funcnum){
				case 1:result=this.calculateArray(xt,yt,num1,oper1,con1,0);break;
				case 2:result=this.calculateArray(xt,yt,num2,oper2,con2,1);break;
				case 3:result=this.calculateArray(xt,yt,num3,oper3,con3,2);break;
				default:result=NaN;break;
			}
		}else if(this.funcArray && funcnum<this.funcArray.length){
			var funcArray=this.funcArray;
			if(funcnum==1){
				if(!this.funcArray0)eval("this.funcArray"+(funcnum-1)+"=function(x,y){return ("+funcArray[funcnum-1]+")}");
				result=this.funcArray0?this.funcArray0(xt,yt):NaN;
			}else if(funcnum==2){
				if(!this.funcArray1)eval("this.funcArray"+(funcnum-1)+"=function(x,y){return ("+funcArray[funcnum-1]+")}");
				result=this.funcArray1?this.funcArray1(xt,yt):NaN;
			}else if(this.funcnum==3){
				if(!funcArray2)eval("this.funcArray"+(funcnum-1)+"=function(x,y){return ("+funcArray[funcnum-1]+")}");
				result=this.funcArray2?this.funcArray2(xt,yt):NaN;
			}
		}
		return result;
	}
	
	function prePlotGrid0(updateCoord0,willCreateN){
		if(arguments.length<2)willCreateN=true;
		if(arguments.length<1)updateCoord0=true;
		if(!Model3dEvalMode){
			if(this.strResult1!="complete"||this.drawType2>=2&&this.strResult2!="complete"||this.drawType2>=3&&this.strResult3!="complete"){
				this.model.point=[];
				this.model.coord=[];
				this.model.createN(true);
				return;
			}
		}else{
			var funcArray=this.funcArray;
			
			if(funcArray==null || funcArray.length==0){
				return;
			}
			for(i=0;i<funcArray.length;i++){
				eval("var funcArray"+i+"=function(x,y){return ("+funcArray[i]+")};this.funcArray"+i+"=funcArray"+i+";");				
			}
		}
		//从函数生成平面信息
		var point,coord,uv,coord2;
		var i=0;//循环变量		
		var j=0;
		var k=0;
		var l=0;
		var m=0;
		var n=0;//var zxy:Number;
		var xseg1=this.xseg+1;//行向分段数加一
		var yseg1=this.yseg+1;//列后向分段数加一
		var xsegp=(this.drawType2==3&&this.uclosed)?this.xseg:xseg1;//每行的顶点数
		var ysegp=(this.drawType2==3&&this.vclosed)?this.yseg:yseg1;//每列的顶点数
		var pointTotal=xsegp*ysegp;//总顶点数
		var coordTotal=this.xseg*this.yseg;//最大面积数
		var uvTotal=xseg1*yseg1;//最大面积数
		var xseg0=this.xseg/2;//每行分段数（四边形个数）的一半
		var yseg0=this.yseg/2;//每列分段数（四边形个数）的一半
		//trace(xseg0);
		var zseg=Math.max(xseg1,yseg1);//横纵向分段数的较大值
		var shapeCount=this.drawType2==2?2:1;//模型数
		var dxseg=2*Math.PI/this.xseg;//计算参数方程中过程中，x和y的增加幅度
		var dyseg=2*Math.PI/this.yseg;
		var updateCoord=updateCoord0||coord==null||coord.length!=coordTotal*shapeCount;//是否更新顶点
		var arrp;//point[i0]对应的数组
		var arrc;//coord[i0]对应的数组
		var coordAvailable=true;//四边形平面是否可用		
		var hasNaNPoint=false;//是否含有值为NaN的顶点
		var myNaNMode=(!this.uclosed&&!this.vclosed)?this.NaNMode:0;//参数方程中实际使用的非数值处理方式
		var coord2Total=(this.drawType2>=3&&(this.uclosed||this.vclosed))?coordTotal:0;//coord2应有的长度
		var pointcur=0;//处理闭合曲面时用的当前顶点号
		if(point==null||point.length!=pointTotal*shapeCount||uv==null||uv.length!=uvTotal*shapeCount){
			point=new Array(pointTotal*shapeCount);//pointt=new Array(pointTotal*shapeCount);
			uv=new Array(uvTotal*shapeCount);
			for(k=0;k<uvTotal;k++){
				if(k<pointTotal){
					point[k]=new Array(3);
					if(shapeCount>1){
						point[k+pointTotal]=new Array(3);
					}
				}
				uv[k]=[this.model.hideBack==-1?(1-m/this.xseg*this.scaleU):m/this.xseg*this.scaleU,(1-n/this.yseg)*this.scaleV];
				if(shapeCount>1){
					point[k+pointTotal]=new Array(3);
					uv[k+uvTotal]=[m/this.xseg*this.scaleU,(1-n/this.yseg)*this.scaleV];
				}
				j++;
				if(j>=ysegp){
					j=0;
					i++;
				}
				n++;
				if(n>=yseg1){
					n=0;
					m++;
				}
			}
		}//trace(drawType2>=3 && (uclosed || vclosed));
		if(coord==null||coord.length!=coordTotal*shapeCount){
			coord=new Array(coordTotal*shapeCount);
			for(k=0;k<coordTotal;k++){
				coord[k]=new Array(4);
				if(shapeCount>1){
					coord[k+coordTotal]=new Array(4);
				}
			}
		}
		if(coord2==null||coord2.length!=coord2Total){
			coord2=new Array(coord2Total);
			for(k=0;k<coord2Total;k++){
				coord2[k]=new Array(4);
			}
		}//trace(coord.length);
		l=0;
		i=0;
		j=0;
		k=0;
		if(this.drawType2>=1&&this.drawType2<3){
			hasNaNPoint=false;
			for(k=0;k<pointTotal;k++){
				point[k][0]=500*(i-xseg0)/zseg;
				point[k][1]=500*(j-yseg0)/zseg;
				if(!Model3dEvalMode){
					point[k][2]=this.calculateArray(10*(i-xseg0)/zseg,10*(j-yseg0)/zseg,num1,oper1,con1,0)*50;
				}else{
					point[k][2]=funcArray0(10*(i-xseg0)/zseg,10*(j-yseg0)/zseg)*50;
				}
				if(isNaN(point[k][2])){
					if(this.NaNMode==0){
						point[k][2]=0;
					}
					hasNaNPoint=true;
					updateCoord=true;
				}
				j++;
				if(j>=yseg1){
					j=0;
					i++;
				}
			}
			i=0;
			j=0;
			for(k=0;k<pointTotal;k++){
				if(updateCoord){
					if(i!=0&&j!=0){
						arrc=coord[l];
						arrc[0]=k-1;
						arrc[1]=k;
						arrc[2]=k-yseg1-1;
						arrc[3]=k-yseg1;
						if(hasNaNPoint){
							coordAvailable=true;
							if(this.NaNMode==2&&(isNaN(point[arrc[0]][2])||isNaN(point[arrc[1]][2])||isNaN(point[arrc[2]][2])||isNaN(point[arrc[3]][2]))){
								coordAvailable=false;
							}
							if(this.NaNMode==1&&isNaN(point[arrc[0]][2])&&isNaN(point[arrc[1]][2])&&isNaN(point[arrc[2]][2])&&isNaN(point[arrc[3]][2])){
								coordAvailable=false;
							}
							if(coordAvailable){
								l++;
							}
						}else{
							l++;
						}
					}
					if(l>=coordTotal){
						break;
					}
				}
				j++;
				if(j>=yseg1){
					j=0;
					i++;
				}
			}
			if(this.NaNMode!=0&&hasNaNPoint){
				for(k=0;k<pointTotal;k++){
					if(isNaN(point[k][2])){
						point[k][2]=0;
					}
				}
			}
			gridWid=500*this.xseg/this.scaleU/zseg;
			gridHei=500*this.yseg/this.scaleV/zseg;
		}else if(this.drawType2==3){
			for(k=0;k<pointTotal;k++){
				if(!Model3dEvalMode){
					point[k][0]=this.calculateArray(i*dxseg,j*dyseg,num1,oper1,con1,0);
					point[k][1]=this.calculateArray(i*dxseg,j*dyseg,num2,oper2,con2,1);
					point[k][2]=this.calculateArray(i*dxseg,j*dyseg,num3,oper3,con3,2);
				}else{
					point[k][0]=funcArray0(i*dxseg,j*dyseg,num1,oper1,con1,0);
					point[k][1]=funcArray1(i*dxseg,j*dyseg,num2,oper2,con2,1);
					point[k][2]=funcArray2(i*dxseg,j*dyseg,num3,oper3,con3,2);
				}
				if(isNaN(point[k][0])){
					if(myNaNMode==0){
						point[k][2]=0;
					}
					hasNaNPoint=true;
					updateCoord=true;
				}
				if(isNaN(point[k][1])){
					if(myNaNMode==0){
						point[k][2]=0;
					}
					hasNaNPoint=true;
					updateCoord=true;
				}
				if(isNaN(point[k][2])){
					if(myNaNMode==0){
						point[k][2]=0;
					}
					hasNaNPoint=true;
					updateCoord=true;
				}
				j++;
				if(j>=ysegp){
					j=0;
					i++;
				}
			}
			i=0;
			j=0;
			k=0;
			l=0;
			pointcur=0;
			for(k=0;k<uvTotal;k++){
				if(updateCoord){
					if(!this.uclosed&&!this.vclosed&&i!=0&&j!=0){
						arrc=coord[l];
						arrc[0]=k-1;
						arrc[1]=k;
						arrc[2]=k-yseg1-1;
						arrc[3]=k-yseg1;
						if(hasNaNPoint){
							coordAvailable=true;
							if(myNaNMode==2&&(isNaN(point[arrc[0]][0])||isNaN(point[arrc[0]][1])||isNaN(point[arrc[0]][2])||isNaN(point[arrc[1]][0])||isNaN(point[arrc[1]][1])||isNaN(point[arrc[1]][2])||isNaN(point[arrc[2]][0])||isNaN(point[arrc[2]][1])||isNaN(point[arrc[2]][2])||isNaN(point[arrc[3]][0])||isNaN(point[arrc[3]][1])||isNaN(point[arrc[3]][2]))){
								coordAvailable=false;
							}
							if(myNaNMode==1&&(isNaN(point[arrc[0]][0])||isNaN(point[arrc[0]][1])||isNaN(point[arrc[0]][2]))&&(isNaN(point[arrc[1]][0])||isNaN(point[arrc[1]][1])||isNaN(point[arrc[1]][2]))&&(isNaN(point[arrc[2]][0])||isNaN(point[arrc[2]][1])||isNaN(point[arrc[2]][2]))&&(isNaN(point[arrc[3]][0])||isNaN(point[arrc[3]][1])||isNaN(point[arrc[3]][2]))){
								coordAvailable=false;
							}
							if(coordAvailable){
								l++;
							}
						}else{
							l++;
						}
					}else if(i!=0&&j!=0){
						pointcur=i*ysegp+j;
						coord[l][0]=(this.uclosed&&i==this.xseg)?j-1:pointcur-1;
						coord[l][1]=(this.vclosed&&j==this.yseg)?((this.uclosed&&i==this.xseg)?0:pointcur-j):((this.uclosed&&i==this.xseg)?j:pointcur);
						coord[l][2]=pointcur-ysegp-1;
						coord[l][3]=(this.vclosed&&j==this.yseg)?pointcur-ysegp-j:pointcur-ysegp;
						coord2[l][0]=k-1;
						coord2[l][1]=k;
						coord2[l][2]=k-yseg1-1;
						coord2[l][3]=k-yseg1;
						l++;
					}
					if(l>=coordTotal){
						break;
					}
				}
				j++;
				if(j>=yseg1){
					j=0;
					i++;
				}
			}
			if(myNaNMode!=0&&hasNaNPoint){
				for(k=0;k<pointTotal;k++){
					if(isNaN(point[k][2])){
						point[k][2]=0;
					}
				}
			}
		}
		i=0;
		j=0;
		if(this.drawType2==2){
			hasNaNPoint=false;
			for(k=pointTotal;k<(pointTotal<<1);k++){
				point[k][0]=500*(i-xseg0)/zseg;
				point[k][1]=500*(j-yseg0)/zseg;
				if(!Model3dEvalMode){
					point[k][2]=this.calculateArray(10*(i-xseg0)/zseg,10*(j-yseg0)/zseg,num2,oper2,con2,1)*50;
				}else{
					point[k][2]=funcArray1(10*(i-xseg0)/zseg,10*(j-yseg0)/zseg)*50;
				}
				if(isNaN(point[k][2])){
					if(this.NaNMode==0){
						point[k][2]=0;
					}
					hasNaNPoint=true;
					updateCoord=true;
				}
				j++;
				if(j>=yseg1){
					j=0;
					i++;
				}
			}
			i=0;
			j=0;
			for(k=pointTotal;k<(pointTotal<<1);k++){
				if(updateCoord){
					if(i!=0&&j!=0){
						arrc=coord[l];
						arrc[0]=k-1;
						arrc[1]=k;
						arrc[2]=k-yseg1-1;
						arrc[3]=k-yseg1;
						if(hasNaNPoint){
							coordAvailable=true;
							if(this.NaNMode==2&&(isNaN(point[arrc[0]][2])||isNaN(point[arrc[1]][2])||isNaN(point[arrc[2]][2])||isNaN(point[arrc[3]][2]))){
								coordAvailable=false;
							}
							if(this.NaNMode==1&&isNaN(point[arrc[0]][2])&&isNaN(point[arrc[1]][2])&&isNaN(point[arrc[2]][2])&&isNaN(point[arrc[3]][2])){
								coordAvailable=false;
							}
							if(coordAvailable){
								l++;
							}
						}else{
							l++;
						}
					}
					if(l>=(coordTotal<<1)){
						break;
					}
				}
				j++;
				if(j>=yseg1){
					j=0;
					i++;
				}
			}
			if(this.NaNMode!=0&&hasNaNPoint){
				for(k=pointTotal;k<(pointTotal<<1);k++){
					if(isNaN(point[k][2])){
						point[k][2]=0;
					}
				}
			}
		}
		if(l<coordTotal){
			coord.length=l;
			updateCoord=true;
		}//trace(l);
		//trace(coord.length);
		this.model.point=point;
		this.model.coord=coord;
		this.model.uv=uv;
		this.model.coord2=coord2;
		if(willCreateN){
			this.model.createN(updateCoord);
		}
	}
}

function Sphere(wid,hei,r,material,jseg,wseg,hideBack,rotationType){
	if(arguments.length<8)rotationType=0;
	if(arguments.length<7)hideBack=1;
	if(arguments.length<6)wseg=20;
	if(arguments.length<5)jseg=40;
	if(arguments.length<4)material=0xffffff;//生成由四边形构成的球体			
	var str=r+"sin(y/2)cos(x),"+r+"sin(y/2)sin(x),-"+r+"cos(y/2),%";
	if(typeof(material)=="string"){
		str+="|"+material;
	}
	var model=new Model3d(wid,hei,str,jseg,wseg,1,hideBack,1,1,rotationType);
	if(typeof(material)=="number"){
		model.model.colour=material;//model.plot();
	}
	return model.model;
}

function Sphere2(wid,hei,r,material,cols,rows,hideBack,rotationType){
	if(arguments.length<8)rotationType=0;
	if(arguments.length<7)hideBack=1;
	if(arguments.length<6)rows=20;
	if(arguments.length<5)cols=40;
	if(arguments.length<4)material=0xffffff;//生成由三角形构成的球体
	var str="";
	if(typeof(material)=="string"){
		str+="|"+material;
	}
	var model=new Viewer3d(wid,hei,str,hideBack,rotationType);
	var i,j;
	model.point=new Array((rows+1)*cols);
	model.coord=new Array(rows*cols);
	model.uv=new Array(model.point.length);
	model.coord2=new Array(rows*cols);
	var dtheta=2*Math.PI/cols;
	var dphi=Math.PI/rows;
	var du=1/cols;
	var dv=1/rows;
	var k=0,l=0;
	var cols1=cols+1;
	for(i=0;i<=rows;i++){
		for(j=0;j<=cols;j++){
			model.point[k]=[r*Math.sin(i*dphi)*Math.cos(j*dtheta),r*Math.sin(i*dphi)*Math.sin(j*dtheta),r*Math.cos(i*dphi)];
			model.uv[k]=[hideBack>=0?du*j:1-du*j,dv*i];
			k++;
			if(i>0&&i<rows&&j<cols){
				model.coord[l]=j<cols-1?[i*cols1+j+1+cols1,i*cols1+j+1,i*cols1+j,-1]:[i*cols1+cols1,i*cols1,i*cols1+j,-1];
				model.coord2[l]=[i*cols1+j+1+cols1,i*cols1+j+1,i*cols1+j,-1];
				l++;
			}
			if(i<rows-1&&j<cols){
				model.coord[l]=j<cols-1?[i*cols1+j,i*cols1+j+cols1,i*cols1+j+1+cols1,-1]:[i*cols1+j,i*cols1+j+cols1,i*cols1+cols1,-1];
				model.coord2[l]=[i*cols1+j,i*cols1+j+cols1,i*cols1+j+1+cols1,-1];
				l++;
			}
		}
	}
	if(l<model.coord.length){
		//model.coord[l]=[-1,0,0,0];
		model.coord.length=l;
	}
	model.createN();
	if(typeof(material)=="number"){
		model.colour=material;//model.plot();
	}
	return model;
}

function Cone(wid,hei,r,h,material,jseg,wseg,hideBack,rotationType){
	if(arguments.length<9)rotationType=0;
	if(arguments.length<8)hideBack=0;
	if(arguments.length<7)wseg=20;
	if(arguments.length<6)jseg=40;
	if(arguments.length<5)material=0xffffff;
	//生成圆锥，若需要底面，则jseg（经度分段）必须为偶数
	var str=(r/(2*Math.PI))+"(2P-y)cos(x),"+(r/(2*Math.PI))+"(2P-y)sin(x),"+(h/(2*Math.PI))+"(y-P),%";
	if(typeof(material)=="string"){
		str+="|"+material;
	}
	var model=new Model3d(wid,hei,str,jseg,wseg,1,hideBack,1,1,rotationType);
	if(typeof(material)=="number"){
		model.model.colour=material;//model.plot();
	}
	return model.model;
}

function ConeEx(wid,hei,rbottom,rtop,h,material,jseg,wseg,hideBack,rotationType){
	//生成圆台
	if(arguments.length<10)rotationType=0;
	if(arguments.length<9)hideBack=0;
	if(arguments.length<8)wseg=20;
	if(arguments.length<7)jseg=40;
	if(arguments.length<6)material=0xffffff;
	var k=(rtop-rbottom)/(2*Math.PI);
	var b=rbottom;
	var str="("+k+"*y+"+b+")*cos(x),"+"("+k+"*y+"+b+")*sin(x),"+(h/(2*Math.PI))+"*(y-P),%";
	if(typeof(material)=="string"){
		str+="|"+material;
	}
	var model=new Model3d(wid,hei,str,jseg,wseg,1,hideBack,1,1,rotationType);
	if(typeof(material)=="number"){
		model.model.colour=material;//model.plot();
	}
	return model.model;
}

function Cylinder(wid,hei,r,h,material,jseg,wseg,hideBack,rotationType){
	if(arguments.length<9)rotationType=0;
	if(arguments.length<8)hideBack=0;
	if(arguments.length<7)wseg=20;
	if(arguments.length<6)jseg=40;
	if(arguments.length<5)material=0xffffff;//生成圆柱，若需要底面，则jseg（经度分段）必须为偶数
	var str=r+"cos(x),"+r+"sin(x),"+(h/(2*Math.PI))+"(y-P),%";
	if(typeof(material)=="string"){
		str+="|"+material;
	}
	var model=new Model3d(wid,hei,str,jseg,wseg,1,hideBack,1,1,rotationType);
	if(typeof(material)=="number"){
		model.model.colour=material;
		//model.plot();
	}//model.child=new Array(1);
	//model.child[0]=RoundPlane(wid,hei,r,material,jseg,hideBack,rotationType);
	//model.child[0].tz=h;
	return model.model;
}

function Ring(wid,hei,r1,r2,material,jseg,wseg,hideBack,rotationType){
	if(arguments.length<9)rotationType=0;
	if(arguments.length<8)hideBack=1;
	if(arguments.length<7)wseg=20;
	if(arguments.length<6)jseg=40;
	if(arguments.length<5)material=0xffffff;//生成圆环
	var str="("+r1+"+"+r2+"cos(y))*cos(x),("+r1+"+"+r2+"cos(y))*sin(x),"+r2+"sin(y),%%";
	if(typeof(material)=="string"){
		str+="|"+material;
		
	}
	var model=new Model3d(wid,hei,str,jseg,wseg,1,hideBack,1,1,rotationType);
	if(typeof(material)=="number"){
		model.model.colour=material;//model.plot();
	}
	return model.model;
}

function Plane(wid,hei,a,b,c,d,material,xseg,yseg,hideBack,rotationType,scaleU,scaleV){
	if(arguments.length<13)scaleV=1;
	if(arguments.length<12)scaleU=1;
	if(arguments.length<11)rotationType=0;
	if(arguments.length<10)hideBack=0;
	if(arguments.length<9)yseg=10;
	if(arguments.length<8)xseg=10;
	if(arguments.length<7)material=0xffffff;//生成四边形ABCD构成的平面
	var str="";
	if(typeof(material)=="string"){
		str+="|"+material;
	}
	var model=new Viewer3d(wid,hei,str,hideBack,rotationType);
	var xseg1=xseg+1;
	var yseg1=yseg+1;
	var pointTotal=xseg1*yseg1;
	var coordTotal=xseg*yseg;
	var i=0;
	var j=0;
	var k=0;
	var l=0;
	var point=new Array;
	var coord=new Array;
	var uv=new Array;
	point=new Array(pointTotal);
	uv=new Array(point.length);
	for(k=0;k<pointTotal;k++){
		point[k]=new Array(3);
		uv[k]=[hideBack==-1?(i/xseg)*scaleU:(1-i/xseg)*scaleU,j/yseg*scaleV];
		j++;
		if(j>=yseg1){
			j=0;
			i++;
		}
	}
	coord=new Array(coordTotal);
	for(k=0;k<coordTotal;k++){
		coord[k]=new Array(4);
	}
	l=0;
	i=0;
	j=0;
	for(k=0;k<pointTotal;k++){
		point[k][0]=a[0]*i*j/coordTotal+b[0]*(xseg-i)*j/coordTotal+c[0]*(xseg-i)*(yseg-j)/coordTotal+d[0]*i*(yseg-j)/coordTotal;
		point[k][1]=a[1]*i*j/coordTotal+b[1]*(xseg-i)*j/coordTotal+c[1]*(xseg-i)*(yseg-j)/coordTotal+d[1]*i*(yseg-j)/coordTotal;
		point[k][2]=a[2]*i*j/coordTotal+b[2]*(xseg-i)*j/coordTotal+c[2]*(xseg-i)*(yseg-j)/coordTotal+d[2]*i*(yseg-j)/coordTotal;
		if(i!=0&&j!=0){
			coord[l][0]=k-1;
			coord[l][1]=k;
			coord[l][2]=k-yseg1-1;
			coord[l][3]=k-yseg1;
			l++;
		}
		if(l>=coordTotal){
			break;
		}
		j++;
		if(j>=yseg1){
			j=0;
			i++;
		}
	}
	model.point=point;
	model.coord=coord;
	model.uv=uv;
	model.createN();
	if(typeof(material)=="number"){
		model.colour=material;//model.plot();
	}
	return model;
}

function RoundPlane(wid,hei,r,material,seg,hideBack,rotationType){
	if(arguments.length<7)rotationType=0;
	if(arguments.length<6)hideBack=0;
	if(arguments.length<5)seg=10;
	if(arguments.length<4)material=0xffffff;
	//生成圆盘，圆盘的分段必须为偶数段
	var str="";
	if(typeof(material)=="string"){
		str+="|"+material;
	}
	var model=new Viewer3d(wid,hei,str,hideBack,rotationType);
	var i;
	var j;
	var k;
	var l;
	var lprev;
	var point=new Array;
	var coord=new Array;
	var uv=new Array;
	if(seg%2!=0){
		seg++;
	}
	var dseg=2*Math.PI/seg;
	k=0;
	l=0;
	for(i=0;i<=(seg>>1);i++){
		lprev=l;
		l=i<=(seg>>2)?2*i+1:2*((seg>>1)-i)+1;//每行点数
		//trace(i,l,-(l>>1));
		for(j=0;j<l;j++){
			point.push([r*Math.sin((j-(l>>1))*dseg),r*Math.cos(i*dseg),0]);
			uv.push([0.5*Math.sin((j-(l>>1))*dseg)+0.5,-0.5*Math.cos(i*dseg)+0.5,0]);
			
			if(i!=0){
				if(j==1 && i<=(seg>>2)){
					coord.push([k-lprev-1,k-1,k,-1]);							
				}else if(j==0 && i>(seg>>1)-(seg>>2)){
					coord.push([k-lprev,k,k-lprev+1,-1]);
					if(j==l-1){
						coord.push([k-l-1,k,k-l,-1]);	
					}
				}else if(j==l-1 && i<=(seg>>2)){
					coord.push([k-l,k-1,k,-1]);			
				}else if(j==l-1 && i>(seg>>1)-(seg>>2)){
					coord.push([k-lprev,k-1,k-lprev+1,k]);
					coord.push([k-l-1,k,k-l,-1]);		
				}else if(j>1 && i<=(seg>>2)){
					coord.push([k-l,k-1,k-l+1,k]);
				}else if(i>(seg>>1)-(seg>>2)){
					coord.push([k-lprev,k-1,k-lprev+1,k]);
				}else if(j>0){
					coord.push([k-l-1,k-1,k-l,k]);
				}
			}
			k++;
		}
	}
	model.point=point;
	model.coord=coord;
	model.uv=uv;
	model.createN();
	if(typeof(material)=="number"){
		model.colour=material;//model.plot();
	}
	return model;
}

function CuboidSimple(wid0,hei0,a0,b0,c0,material,hideBack,rotationType){
	if(arguments.length<=7)rotationType=0;
	if(arguments.length<=6)hideBack=0;
	if(arguments.length<=5)material=0xffffff;
	var a=a0*0.5;
	var b=b0*0.5;
	var c=c0*0.5;
	var model=new Viewer3d(wid0,hei0,"",hideBack,rotationType);
	var point0=[[a,b,-c],[-a,b,-c],[-a,-b,-c],[a,-b,-c],[a,b,c],[-a,b,c],[-a,-b,c],[a,-b,c]];
	var coord0=[[4,5,7,6],[3,2,0,1],[1,2,5,6],[4,7,0,3],[2,3,6,7],[0,1,4,5]];
	var i=0;
	var arrp;
	var arrc;
	var arru;
	model.point=new Array(24);//model.createN();
	for(i=0;i<24;i+=4){
		arrc=coord0[i>>2];
		arrp=point0[arrc[0]];
		model.point[i]=[arrp[0],arrp[1],arrp[2],arrp[3]];
		arrp=point0[arrc[1]];
		model.point[i+1]=[arrp[0],arrp[1],arrp[2],arrp[3]];
		arrp=point0[arrc[2]];
		model.point[i+2]=[arrp[0],arrp[1],arrp[2],arrp[3]];
		arrp=point0[arrc[3]];
		model.point[i+3]=[arrp[0],arrp[1],arrp[2],arrp[3]];
	}
	model.coord=new Array(6);
	for(i=0;i<6;i++){
		model.coord[i]=[i<<2,i<<2|1,i<<2|2,i<<2|3];
	}
	var uv0=new Array(14);
	for(i=0;i<7;i++){
		uv0[2*i]=[i,0];
		uv0[2*i+1]=[i,1];
	}
	var coord2_0=[[8,10,9,11],[10,12,11,13],[5,3,4,2],[6,8,7,9],[3,1,2,0],[7,5,6,4]];
	model.uv=new Array(24);
	for(i=0;i<24;i+=4){
		arrc=coord2_0[i>>2];
		arru=uv0[arrc[0]];
		model.uv[i]=[arru[0],arru[1]];
		arru=uv0[arrc[1]];
		model.uv[i+1]=[arru[0],arru[1]];
		arru=uv0[arrc[2]];
		model.uv[i+2]=[arru[0],arru[1]];
		arru=uv0[arrc[3]];
		model.uv[i+3]=[arru[0],arru[1]];
	}
	model.createN();
	if(typeof(material)=="number"){
		model.colour=material;
	}
	//simplify(model,false);
	return model;
}

function Cuboid(wid,hei,a,b,c,material,aseg,bseg,cseg,hideBack,rotationType){
	if(arguments.length<11)rotationType=0;
	if(arguments.length<10)hideBack=0;
	if(arguments.length<9)cseg=10;
	if(arguments.length<8)bseg=10;
	if(arguments.length<7)aseg=10;
	if(arguments.length<6)material=null;//生成长方体，旋转中心在中点
	if(material==null||material.length<=0){
		material=[0xffffff,0xffffff,0xffffff,0xffffff,0xffffff,0xffffff];
	}
	var leng=material.length;
	var i;
	if(leng<6){
		for(i=leng;i<6;i++){
			material.push(material[leng-1]);
		}
	}
	var model=new Viewer3d(wid,hei,"",hideBack,rotationType);
	model.child=new Array(6);
	model.child[0]=Plane(wid,hei,[-a*0.5,-b*0.5,c*0.5],[a*0.5,-b*0.5,c*0.5],[a*0.5,b*0.5,c*0.5],[-a*0.5,b*0.5,c*0.5],material[0],aseg,bseg,hideBack,rotationType);
	model.child[1]=Plane(wid,hei,[-a*0.5,b*0.5,-c*0.5],[a*0.5,b*0.5,-c*0.5],[a*0.5,-b*0.5,-c*0.5],[-a*0.5,-b*0.5,-c*0.5],material[1],aseg,bseg,hideBack,rotationType);
	model.child[2]=Plane(wid,hei,[-a*0.5,b*0.5,-c*0.5],[-a*0.5,-b*0.5,-c*0.5],[-a*0.5,-b*0.5,c*0.5],[-a*0.5,b*0.5,c*0.5],material[2],bseg,cseg,hideBack,rotationType);
	model.child[3]=Plane(wid,hei,[a*0.5,-b*0.5,-c*0.5],[a*0.5,b*0.5,-c*0.5],[a*0.5,b*0.5,c*0.5],[a*0.5,-b*0.5,c*0.5],material[3],bseg,cseg,hideBack,rotationType);
	model.child[4]=Plane(wid,hei,[-a*0.5,-b*0.5,-c*0.5],[a*0.5,-b*0.5,-c*0.5],[a*0.5,-b*0.5,c*0.5],[-a*0.5,-b*0.5,c*0.5],material[4],aseg,cseg,hideBack,rotationType);
	model.child[5]=Plane(wid,hei,[a*0.5,b*0.5,-c*0.5],[-a*0.5,b*0.5,-c*0.5],[-a*0.5,b*0.5,c*0.5],[a*0.5,b*0.5,c*0.5],material[5],aseg,cseg,hideBack,rotationType);//trace(material[5]);
	model.updateRelation();
	return model;
}
	
function TreeCross(wid,hei,treewid,treehei,material,material2,xseg,yseg,hideBack,rotationType){
	if(arguments.length<10)rotationType=0;
	if(arguments.length<9)hideBack=0;
	if(arguments.length<8)yseg=10;
	if(arguments.length<7)xseg=10;
	if(arguments.length<6)material2=null;
	if(arguments.length<5)material=0xffffff;//生成十字交叉树
	if(material2==null){
		material2=material;
	}
	var model=Plane(wid,hei,[-treewid*0.5,0,0],[treewid*0.5,0,0],[treewid*0.5,0,treehei],[-treewid*0.5,0,treehei],material,xseg,yseg,hideBack,rotationType);
	var model2=Plane(wid,hei,[-treewid*0.5,0,0],[treewid*0.5,0,0],[treewid*0.5,0,treehei],[-treewid*0.5,0,treehei],material2,xseg,yseg,hideBack,rotationType);
	model2.rz=90;
	model.child=[model2];
	model.updateRelation();
	return model;
}