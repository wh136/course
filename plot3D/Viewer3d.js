








//import flash.system.fscommand;
function Viewer3d(width0,height0,fname,hideBack0,rotationType0,useSmooth0,useSpecular0,sight0){
	if(arguments.length<8)sight0=55.00000001;
	if(arguments.length<7)useSpecular0=true;
	if(arguments.length<6)useSmooth0=false;
	if(arguments.length<5)rotationType0=0;
	if(arguments.length<4)hideBack0=0;
	if(arguments.length<3)fname="";//构造方法
	
	this.shape=null;
	this.graphics=null;
	
	var tanS;//视角的一半的正切值
	this.mdx;//画面垂直线的灭点横坐标
	this.mdy;//画面垂直线的灭点纵坐标
	var sx;//站点横坐标
	var sy;//站点与画面的距离
	//var s1:Number,s2:Number;//求得的透视图的点坐标
	//var zoomy:Number;//与真实横、竖坐标的缩放比值		
	var facesMax=21000;//var fgrid:Array;
	//var ggrid:Array;
	//var board:MovieClip;
	this.spotx=275,this.spoty=0,this.spotz=0,this.spotk=true;//点光源坐标和比例系数（0和1），spotk为0时为平行光源。
	this.spotInten=0.8;//光强。
	this.ambientr=67,this.ambientg=67,this.ambientb=70;//环境光。
	this.ks=0.25,this.ns=5;//高光强度和光泽度
	this.tx=0,this.ty=0,this.tz=0;//形体的位置。
	this.rx=0;//形体的旋转角度。
	this.ry=0;
	this.rz=0;
	this.rw=NaN;//rw不为NaN时为四元数旋转，为NaN时为欧拉角旋转（先z再y然后x）
	this.scaleShape=1;//视图的缩放比例。
	//形体需手工定义部分
	this.point=new Array();//形体原始点集。
	this.coord=new Array();//形体用点下标表示的平面集。
	this.uv=new Array();//uv坐标集（二维点集），取值范围为[0,1]（可选，缺省则无贴图）。
	this.coord2=new Array();//每个平面上每点对应的uv坐标集（可选，缺省则uv与point的每个元素相对应，否则与coord的元素相对应）。
	this.colour=0x00ccff;//形体的颜色。	
	this.bmpd=null;//贴图，导入完外界后自动调用createUVMatrix方法对uv进行矩阵生成，位图的大小改变时需要重新更新。
	this.pattern=null;
	this.child;//子模型，使用这个模型的局部坐标
	this.comrade;//伙伴模型，使用这个模型的绝对坐标，渲染当前模型时会自动独立渲染伙伴模型。
	//形体自动生成部分
	var pointt=new Array();//形体变形后点集。
	var coordn=new Array();//平面的法向量。
	this.coordc=new Array();//平面的颜色。
	var pointn=new Array();//顶点的法向量。
	this.pointc=new Array();//顶点的颜色。
	var coorda=new Array();//用于additionalFix的附加信息
	this.uvm=new Array();//uv和位图大小对应的uv转换矩阵，与coord的元素相对应。
	this.uvm2=new Array();//uv和位图大小对应的第二个uv转换矩阵，仅用于四边形透视贴图中。
	this.planeArray=new Array();//用来排序和呈现的平面的信息集，只有前面一部分有效。
	var ul;
	//var loader=new Loader;
	this.useSpecular;//应用镜面反射。
	this.useSmooth=false;//应用平滑，想应用但之前未应用时需要将这个属性设为true后调用createN方法重新生成法向量。
	this.highSmooth=false;//应用三色之间的平滑（否则为应用二色之间的平滑）
	this.hideBack;//背面消隐，1表示消隐背面，0表示不消隐，-1表示消隐正面。
	this.trimEnabled=true;//隐藏外面模式开启。
	this.trimEnabled2=true;//裁剪模式开启（未实现）。
	this.rotationType=0;//旋转模式，分0和1两种。
	this.wid,this.hei=0;//构造方法所定义的宽高度
	this.ymins=10;//原纵坐标小于sy/ymins时视为无效坐标（裁剪式关闭时）或限制其深度（裁剪模式开启时）。
	this.ymax=Infinity;//原纵坐标大于ymax时视为无效坐标（裁剪式关闭时）或限制其深度（裁剪模式开启时）。
	var ntrim=2;//近处下限，比ymins小，原纵坐标小于sy/ymins时被切割。
	this.pxedge=50;//裁剪模式下，透视图上横坐标小于-pxedge或大于wid+pxedge时视为出界。		
	this.pyedge=50;//裁剪模式下，透视图上纵坐标大于wid+pyedge时视为出界。
	this.pyedge2=-this.mdy;//裁剪模式下，透视图上纵坐标小于mdy+pyedge2时视为出界。
	this.gridWid=100,this.gridHei=100;//每格宽高度
	var matrix2=new Matrix();//bmpdMatrix所用的中间矩阵
	this.useUvm2=true;//使用四边形双重贴图
	this.usePerspective=true;//一般采用透视图，为false时显示成轴测图	
	this.modelArr=new Array();
	this.n=0;//有效面数
	this.m=0;//有效贴图数
	this.childymin=0;//作为子模型的最近距离
	this.childymax=Infinity;//作为子模型的最远距离
	this.renderedPlaneMax=facesMax;
	this.quickSortEnabled=true;//允许按每个最大深度排序。
	this.additionalFixEnabled=false;//允许进行排序后的进一步修正。
	this.depthMode=0;//深度判断模式（additionalFixEnabled为false时有效）
	this.angleLimit=45;//点拆分时的临界角
	this.frameList;//影片剪辑帧序列图片数组
	this.frameListRect;//影片剪辑每帧的包围矩形数组
	this.frameListi;//影片剪辑帧序列播放状态
	this.usePerspectiveRotation=true;//影片剪辑帧序列显示时应用由透视关系引发的旋转（需要保证加载时旋转方向正确，即加载后的序列左右方向顺时针旋转，上下方向向下旋转）
	this.useListRotationx=false;//影片剪辑帧序列播放状态是否表示上下旋转
	this.listrxmin=-90;//影片剪辑能表示的上下旋转角度的最小值
	this.listrxmax=90;//影片剪辑能表示的上下旋转角度的最大值
	this.rootModel=this;
	this.parentModel;
	this.uncomradeModel;//public var centy:Number=100;//旋转的中心坐标离站点的距离	
	this.useExpandPixel=true;
	this.expandFillRange=0.5;
	this.expandFillRate=1.05;
	this.patternType="repeat";
	
	this.set_bitmap=set_bitmap0;
	this.get_bitmap=get_bitmap0;
	this.onloadBitmapComplete=null;//图片加载成功时的响应函数
	this.onloadBitmapError=null;//图片加载失败时的响应函数
	
	this.createNew=createNew0;	
	this.createNew(width0,height0,fname,hideBack0,rotationType0,useSmooth0,useSpecular0,sight0);	
	function createNew0(width0,height0,fname,hideBack0,rotationType0,useSmooth0,useSpecular0,sight0){
		
		//构造方法
		var colorf=0x00ccff,spotInten0=0.8,spotx0=363,spoty0=0,spotz0=0;
		tanS=Math.tan(sight0/2*Math.PI/180);//视角的一半的正切值
		this.mdx=width0/2;//画面垂直线的灭点横坐标
		this.mdy=height0/2;//画面垂直线的灭点纵坐标
		
		sx=width0/2;//站点横坐标
		sy=width0/(2*tanS);//站点与画面的距离
		this.wid=width0;
		this.hei=height0;
		this.spotx=this.wid/2;
		var i;	
		this.spotx=spotx0;
		this.spoty=spoty0;
		this.spotz=spotz0;
		this.spotInten=spotInten0;
		this.colour=colorf;//dcolour=dcolorf;
		this.hideBack=hideBack0;
		this.rotationType=rotationType0;
		this.useSmooth=useSmooth0;
		this.useSpecular=useSpecular0;
		this.rootModel=this;
		this.parentModel=this;
		this.uncomradeModel=this;
		var fnameArray=fname.split("|");
		//if(fnameArray[0]!=""){
		//	this.loadRequiredFile(fnameArray[0]);
		//}
		if(fnameArray.length>1){
			this.set_bitmap(fnameArray[1]);
			
		}
	}
	
	this.createShape=function(){
		this.shape=document.createElement("canvas");
		this.shape.width=this.wid;
		this.shape.height=this.hei;
		this.graphics=this.shape.getContext("2d");
	}
	
	this.updateRelation=function(){
		//更新其下子模型的传递信息
		var i=0;
		var leng=0;
		var model=null;
		if(this.child!=null&&this.child.length>0){
			leng=this.child.length;
			for(i=0;i<leng;i++){
				model=this.child[i];
				if(model==null){
					continue;
				}
				model.parentModel=this;
				model.rootModel=this.rootModel;
				if(this.rotationType>=0){
					model.rotationType=model.rotationType>=0?(this.rotationType==2?1:this.rotationType):(this.rotationType==2?-2:-1-this.rotationType);
				}else{
					model.rotationType=model.rotationType>=0?-1-this.rotationType:this.rotationType;
				}
				if(model.child!=null&&model.child.length>0 || 
				   model.comrade!=null&&model.comrade.length>0){
					model.updateRelation();
				}
			}
		}
		if(this.comrade!=null&&this.comrade.length>0){
			leng=this.child.length;
			model=this.comrade[i];
			for(i=0;i<leng;i++){
				model=this.comrade[i];
				if(model==null){
					continue;
				}
				model.uncomradeModel=this;
				//model.rootModel=this.rootModel;
				if(this.rotationType>=0){
					model.rotationType=model.rotationType>=0?(this.rotationType==2?1:this.rotationType):(this.rotationType==2?-2:-1-this.rotationType);
				}else{
					model.rotationType=model.rotationType>=0?-1-this.rotationType:this.rotationType;
				}
				if(model.child!=null&&model.child.length>0 || 
				   model.comrade!=null&&model.comrade.length>0){
					model.updateRelation();
				}
			}
		}
	}
	
	/*this.loadBitmapFile=function(event){
		event=event||window.event;//加载位图文件
		this.bmpd=(loader.content).bitmapData;
		if(uvm.length<=0){
			this.createUVMatrix();
		}
		this.plot();
		dispatchEvent(new Event("Texture Complete"));
	}*/
		
	this.createN=function(arg0,arg1){
		//生成顶点和面的法向量(单位向量)，并初步纠正一些错误的平面。（模型或平滑属性改变时需要）
		//arg0,arg1为保留参数
		var point=this.point;
		var coord=this.coord;
		var uv=this.uv;
		var coord2=this.coord2;
		var vx,vy,vz,vx2,vy2,vz2;
		var leng=point.length;
		var leng2=coord.length;
		var pointc=this.pointc;
		var i,j;
		var d1,d2,d3,dmax;//距离
		if(pointt.length!=point.length){
			pointt=new Array(leng);//数量不匹配时则初始化
			for(i=0;i<leng;i++){
				pointt[i]=new Array(3);
			}
		}
		if(coordn.length!=leng2){
			coordn=new Array(leng2);//数量不匹配时则初始化
			for(i=0;i<leng2;i++){
				coordn[i]=new Array(4);
			}
		}
		if(this.coordc.length!=leng2){
			this.coordc=new Array(leng2);//数量不匹配时则初始化	
		}
		if(this.useSmooth){
			if(pointn.length!=point.length){
				pointn=new Array(leng);//数量不匹配时则初始化
				pointc=new Array(leng);//数量不匹配时则初始化
				this.pointc=pointc;
				for(i=0;i<leng;i++){
					pointn[i]=new Array(3);
				}
			}
			for(i=0;i<leng;i++){
				pointn[i][0]=0;
				pointn[i][1]=0;
				pointn[i][2]=0;
			}
		}
		for(i=0;i<leng2;i++){
			if(coord[i][3]==undefined||coord[i][2]==undefined||coord[i][1]==undefined||coord[i][0]==undefined||coord[i][0]<0||coord[i][0]>=leng||coord[i][1]<0||coord[i][1]>=leng||coord[i][2]<0||coord[i][2]>=leng||coord[i][3]>=leng){
				//trace(coord[i]);
				coord[i]=[0,0,0,-1];//纠正错误
				coordn[i]=[0,1,0,0];
				continue;
			}//trace(coord[2]);
			if(coord[i][3]>=0){
				vx=point[coord[i][1]][0]-point[coord[i][2]][0];
				vy=point[coord[i][1]][1]-point[coord[i][2]][1];
				vz=point[coord[i][1]][2]-point[coord[i][2]][2];
				vx2=point[coord[i][3]][0]-point[coord[i][0]][0];
				vy2=point[coord[i][3]][1]-point[coord[i][0]][1];
				vz2=point[coord[i][3]][2]-point[coord[i][0]][2];
				/*d1=vx*vx+vy*vy+vz*vz;
					d2=vx2*vx2+vy2*vy2+vz2*vz2;
				//生成渐变关键点编号*/
					coordn[i][3]=d1>d2?1:3;
			}else{
				vx=point[coord[i][1]][0]-point[coord[i][0]][0];
				vy=point[coord[i][1]][1]-point[coord[i][0]][1];
				vz=point[coord[i][1]][2]-point[coord[i][0]][2];
				vx2=point[coord[i][2]][0]-point[coord[i][0]][0];
				vy2=point[coord[i][2]][1]-point[coord[i][0]][1];
				vz2=point[coord[i][2]][2]-point[coord[i][0]][2];
				/*d1=vx*vx+vy*vy+vz*vz;
					d2=vx2*vx2+vy2*vy2+vz2*vz2;
					d3=(vx2-vx)*(vx2-vx)+(vy2-vy)*(vy2-vy)+(vz2-vz)*(vy2-vz);
					dmax=0;
					if(d1>d2){
						dmax=d1;
						coordn[i][3]=0;//生成渐变关键点编号
					}else{
						dmax=d2;
						coordn[i][3]=2;
					}
					if(dmax<d3){
						dmax=d3;
						coordn[i][3]=1;
					}*/
			}
			coordn[i][0]=vz*vy2-vy*vz2;//生成法向量
			coordn[i][1]=vx*vz2-vz*vx2;
			coordn[i][2]=vy*vx2-vx*vy2;
			d1=Math.sqrt(coordn[i][0]*coordn[i][0]+coordn[i][1]*coordn[i][1]+coordn[i][2]*coordn[i][2]);
			if(d1!=0){
				coordn[i][0]/=d1;//将平面法向量数乘成单位向量
				coordn[i][1]/=d1;
				coordn[i][2]/=d1;
			}
			coordn[i][3]=-(coordn[i][0]*point[coord[i][0]][0]+coordn[i][1]*point[coord[i][0]][1]+coordn[i][2]*point[coord[i][0]][2]);
			if(coord[i][3]>=0){
				coordn[i][3]-=coordn[i][0]*point[coord[i][1]][0]+coordn[i][1]*point[coord[i][1]][1]+coordn[i][2]*point[coord[i][1]][2];
				coordn[i][3]-=coordn[i][0]*point[coord[i][2]][0]+coordn[i][1]*point[coord[i][2]][1]+coordn[i][2]*point[coord[i][2]][2];
				coordn[i][3]-=coordn[i][0]*point[coord[i][3]][0]+coordn[i][1]*point[coord[i][3]][1]+coordn[i][2]*point[coord[i][3]][2];
				coordn[i][3]*=0.25;
			}
			if(this.useSmooth){
				j=coord[i][0];//生成点法向量
				pointn[j][0]+=coordn[i][0];
				pointn[j][1]+=coordn[i][1];
				pointn[j][2]+=coordn[i][2];
				j=coord[i][1];
				pointn[j][0]+=coordn[i][0];
				pointn[j][1]+=coordn[i][1];
				pointn[j][2]+=coordn[i][2];
				j=coord[i][2];
				pointn[j][0]+=coordn[i][0];
				pointn[j][1]+=coordn[i][1];
				pointn[j][2]+=coordn[i][2];
				j=coord[i][3];
				if(j>=0){
					pointn[j][0]+=coordn[i][0];
					pointn[j][1]+=coordn[i][1];
					pointn[j][2]+=coordn[i][2];
				}
			}//trace(coord[i]);
		}
		if(this.useSmooth){
			for(i=0;i<leng;i++){
				d1=Math.sqrt(pointn[i][0]*pointn[i][0]+pointn[i][1]*pointn[i][1]+pointn[i][2]*pointn[i][2]);//将点法向量数乘成单位向量
				pointn[i][0]/=d1;
				pointn[i][1]/=d1;
				pointn[i][2]/=d1;
			}
		}
	}
	
	this.createUVMatrix=function(coordm){
		if(arguments.length<1)coordm=null;//建立UV相对于位图的转换矩阵。（贴图大小（宽度或高度）或uv改变时需要）
		var point=this.point;
		var coord=this.coord;
		var uv=this.uv;
		var coord2=this.coord2;
		var uvm=this.uvm;
		var uvm2=this.uvm2;
		if(this.bmpd==null||uv.length<=0){
			return;
		}
		if(coordm==null){
			coordm=(coord2!=null&&coord2.length>0)?coord2:coord;
		}
		var leng=coordm.length;
		var i=0;
		var j=0;
		uvm=new Array(leng);
		this.uvm=uvm;
		var arrc;
		var ux1,uy1,ux2,uy2,ux3,uy3;
		var bmpw=this.bmpd.width,bmph=this.bmpd.height;
		var matrix;
		var uvm2Leng=uvm2.length;
		for(i=0;i<leng;i++){
			arrc=coordm[i];
			matrix=new Matrix();
			ux1=uv[arrc[0]][0]*bmpw;
			uy1=uv[arrc[0]][1]*bmph;
			ux2=uv[arrc[1]][0]*bmpw;
			uy2=uv[arrc[1]][1]*bmph;
			ux3=uv[arrc[2]][0]*bmpw;
			uy3=uv[arrc[2]][1]*bmph;
			matrix.a=(ux2-ux1)/bmpw;
			matrix.b=(uy2-uy1)/bmpw;
			matrix.c=(ux3-ux2)/bmph;
			matrix.d=(uy3-uy2)/bmph;
			matrix.tx=ux1;
			matrix.ty=uy1;
			matrix.invert();
			uvm[i]=matrix;
			if(arrc[3]>=0){
				if(uvm2Leng<=0){
					uvm2=new Array(leng);
					this.uvm2=uvm2;
					uvm2Leng=leng;
				}
				matrix=new Matrix();
				ux1=uv[arrc[1]][0]*bmpw;
				uy1=uv[arrc[1]][1]*bmph;
				ux2=uv[arrc[2]][0]*bmpw;
				uy2=uv[arrc[2]][1]*bmph;
				ux3=uv[arrc[3]][0]*bmpw;
				uy3=uv[arrc[3]][1]*bmph;
				matrix.a=(ux2-ux1)/bmpw;
				matrix.b=(uy2-uy1)/bmpw;
				matrix.c=(ux3-ux2)/bmph;
				matrix.d=(uy3-uy2)/bmph;
				matrix.tx=ux1;
				matrix.ty=uy1;
				matrix.invert();
				uvm2[i]=matrix;
			}//trace(uvm[0]);
			//trace(uvm2[0]);
		}//plot();
	}
	
	this.updateTexture=function(){
		this.createUVMatrix();
	}
	
	this.createVrmlFile=function(){
		//生成vrml文件
		var fileStr="#VRML V2.0 utf8\r\n\r\n";
		var dateConvert=new Date();
		var pointStr="";
		var coordStr="";
		var m=0;
		var n=0;
		var zxy;
		var x3d,y3d,z3d,temp;
		var leng=this.point.length;
		var leng2=this.coord.length;
		fileStr+="#Produced By Viewer3d ver 1.0\r\n";
		fileStr+="#Date:"+dateConvert.toLocaleString()+"\r\n\r\n";
		fileStr+="DEF v3d Transform {\r\n";
			fileStr+="    translation "+this.tx+" "+this.tz+" "+(-this.ty)+"\r\n";
			fileStr+="    children [\r\n";
			fileStr+="        Shape {\r\n";
				fileStr+="            appearance Appearance {\r\n";
					fileStr+="                material Material {\r\n";
						fileStr+="                    diffuseColor "+((this.colour>>16&0xff)/255.0)+" "+((this.colour>>8&0xff)/255.0)+" "+((this.colour&0xff)/255.0)+"\r\n";
						fileStr+="                }\r\n";
					fileStr+="            }\r\n";
				fileStr+="            geometry DEF v3df IndexedFaceSet {\r\n";
					fileStr+="                creaseAngle 1\r\n";
					fileStr+="                ccw TRUE\r\n";
					fileStr+="                solid FALSE\r\n";
					fileStr+="                convex TRUE\r\n";
					fileStr+="                coord DEF v3dc Coordinate { point [\r\n";
						for(n=0;n<leng;n++){
							if(m==0){
								pointStr+="                    ";
							}
							x3d=this.point[n][0]*this.scaleShape;
							y3d=this.point[n][2]*this.scaleShape;
							z3d=-this.point[n][1]*this.scaleShape;
							;
							pointStr+=x3d.toPrecision(5)+" "+y3d.toPrecision(5)+" "+z3d.toPrecision(5)+", ";
							if(n==leng-1){
								pointStr=pointStr.substr(0,pointStr.length-2);
								break;
							}
							m++;
							if(m>=5){
								pointStr+="\r\n";
								m=0;
							}
						}
						m=0;
						for(n=0;n<leng2;n++){
							if(m==0){
								coordStr+="                    ";
							}
							coordStr+=this.coord[n][0]+", "+this.coord[n][1]+", ";
							if(this.coord[n][3]<0){
								coordStr+=this.coord[n][2]+", -1, ";
							}else{
								coordStr+=this.coord[n][3]+", "+this.coord[n][2]+", -1, ";
							}
							if(n>=leng2-1||this.coord[n+1][0]==-1){
								coordStr=coordStr.substr(0,coordStr.length-2);
								break;
							}
							m++;
							if(m>=5){
								coordStr+="\r\n";
								m=0;
							}
						}
						fileStr+=pointStr+"]\r\n";
						fileStr+="                }\r\n";
					fileStr+="                coordIndex [\r\n";
					fileStr+=coordStr+"]\r\n";
					fileStr+="            }\r\n";
				fileStr+="        }\r\n";
			fileStr+="    ]\r\n";
			fileStr+="}\r\n";
		return fileStr;
	}
	
	function expandPolygen(arrt,arr,numBegin,count,rate){
		var i=numBegin;
		var j=0;
		var numOut=numBegin+(count<<1);
		if(rate==1){
			while(i<numOut){
				arrt[j]=arr[i];
				i++;j++;
				arrt[j]=arr[i];
				i++;j++;
			}
			return;
		}
		
		var midx=0;
		var midy=0;
		while(i<numOut){
			midx+=arr[i];
			i++;
			midy+=arr[i];
			i++;
		}
		midx/=count;
		midy/=count;	
			
		i=numBegin;
		j=0;
		while(i<numOut){
			arrt[j]=midx+(arr[i]-midx)*rate;
			i++;j++;
			arrt[j]=midy+(arr[i]-midy)*rate;
			i++;j++;
		}
	}
	
	function expandPolygenByPixel(arrt,arr,numBegin,count,pixel){
		var i=numBegin;
		var j=0;
		var numOut=numBegin+(count<<1);
		if(pixel==0){
			while(i<numOut){
				arrt[j]=arr[i];
				i++;j++;
				arrt[j]=arr[i];
				i++;j++;
			}
			return;
		}
		
		var dx,dy;
		var dxa,dya;
		var x0,y0,xt,yt;
		var x1,y1,x2,y2;
		var offset=2*pixel;
		var anotherOffset;
		//i=numBegin;
		//j=0;
		while(i<numOut){
			x0=arr[i];
			y0=arr[i+1];
			if(i+3<numOut){				
				xt=arr[i+2];
				yt=arr[i+3];				
			}else{
				xt=arr[numBegin];
				yt=arr[numBegin+1];
			}
			dx=xt-x0;
			dy=yt-y0;
			dxa=dx>=0?dx:-dx;
			dya=dy>=0?dy:-dy;
			if(dxa==0 && dya==0){
				x1=x0;
				x2=xt;
				y1=y0;
				y2=yt;
			}else if (dxa>dya) {
				if (xt>=x0) {
					x1=x0-offset;
					x2=xt+offset;
				} else {
					x1=x0+offset;
					x2=xt-offset;
				}
				anotherOffset=offset*dya/dxa;
				if (yt>y0) {
					y1=y0-anotherOffset;
					y2=yt+anotherOffset;
				} else {
					y1=y0+anotherOffset;
					y2=yt-anotherOffset;
				}
			} else {
				anotherOffset=offset*dxa/dya;
				if (xt>x0) {
					x1=x0-anotherOffset;
					x2=xt+anotherOffset;
				} else {
					x1=x0+anotherOffset;
					x2=xt-anotherOffset;
				}
				
				if (yt>y0) {
					y1=y0-offset;
					y2=yt+offset;
				} else {
					y1=y0+offset;
					y2=yt-offset;
				}
			}
			if(i==numBegin){
				arrt[j]=x1;
				arrt[j+1]=y1;
				arrt[j+2]=x2;
				arrt[j+3]=y2;
			}else if(i+3<numOut){
				arrt[j]=(arrt[j]+x1)*0.5;
				arrt[j+1]=(arrt[j+1]+y1)*0.5;
				arrt[j+2]=x2;
				arrt[j+3]=y2;
			}else{
				arrt[j]=(arrt[j]+x1)*0.5;
				arrt[j+1]=(arrt[j+1]+y1)*0.5;
				arrt[0]=(arrt[0]+x2)*0.5;
				arrt[1]=(arrt[1]+y2)*0.5;
			}
			i+=2;
			j+=2;
		}
	}
	
	function expandPolygenByPixelOld(arrt,arr,numBegin,count,pixel){
		var i=numBegin;
		var j=0;
		var numOut=numBegin+(count<<1);
		if(pixel==0){
			while(i<numOut){
				arrt[j]=arr[i];
				i++;j++;
				arrt[j]=arr[i];
				i++;j++;
			}
			return;
		}
		
		var midx=0;
		var midy=0;
		while(i<numOut){
			midx+=arr[i];
			i++;
			midy+=arr[i];
			i++;
		}
		midx/=count;
		midy/=count;
		
		var dx=0,dy=0,d2,d2max=0;
		i=numBegin;
		while(i<numOut){
			dx=arr[i]-midx;			
			i++;
			dy=arr[i]-midy;			
			i++;
			
			if(dx<0)dx=-dx;
			if(dy<0)dy=-dy;
			d2=dx>=dy?dx:dy;
			
			//d2=dx*dx+dy*dy;
			
			//if(dx<0)dx=-dx;
			//if(dy<0)dy=-dy;
			//d2=Math.abs(dx)+Math.abs(dy);			
			
			if(d2max<d2){
				d2max=d2;
			}
		}
		
		var d=d2;
		//var d=Math.sqrt(d2);
		//var d=d2*0.5;		
		var rate=d>0?(d+pixel)/d:1;
			
		i=numBegin;
		j=0;
		while(i<numOut){
			arrt[j]=midx+(arr[i]-midx)*rate;
			i++;j++;
			arrt[j]=midy+(arr[i]-midy)*rate;
			i++;j++;
		}
	}

	function transformPointsWithTexture(arr,mt){
		var x0=arr[0];
		var y0=arr[1];
		arr[0]=x0*mt.a+y0*mt.c+mt.tx;
		arr[1]=x0*mt.b+y0*mt.d+mt.ty;
		
		x0=arr[2];
		y0=arr[3];
		arr[2]=x0*mt.a+y0*mt.c+mt.tx;
		arr[3]=x0*mt.b+y0*mt.d+mt.ty;
		
		x0=arr[4];
		y0=arr[5];
		arr[4]=x0*mt.a+y0*mt.c+mt.tx;
		arr[5]=x0*mt.b+y0*mt.d+mt.ty;
	}
	
	this.plot=function(){
		//重绘实体
		if(this.rootModel!=null && this.rootModel!=this){
			this.rootModel.plot();
		}
		var point=this.point;
		var coord=this.coord;
		var uv=this.uv;
		var coord2=this.coord2;
		var planeArray=this.planeArray;
		var modelArr=this.modelArr;
		var m=this.m;
		var n=this.n;
		var i=0;//循环变量
		var j=0;
		var x1,x2,y1,y2;
		var arr,arrc,arrcn;//planeArray元素，coord元素，coordn元素
		var smoothi;//光滑情况
		var useBitmap=(this.bmpd!=null&&uv.length>0);//是否采用贴图			
		var d,sind,cosd;
		//var garr=[0,0xffffff],garra=[1,1],garrr=[0,255];
		//var garr2=[0,0x7f7f7f,0xffffff],garra2=[1,1,1],garrr2=[0,127,255];
		//var mg=new Matrix();//光滑的渐变填充所用的矩阵
		var model,bmdt,uvmt;//非当前模型和它的贴图和uv矩阵
		//var useOtherModel:Boolean=true;//m>1//是否启用非当前模型信息
		var i0=n-this.renderedPlaneMax<=0?0:n-this.renderedPlaneMax;
		var modelUseUvm2=true;//trace(i0);
		this.attachPlane();
		m=this.m;
		n=this.n;
		if(this.quickSortEnabled&&!this.additionalFixEnabled&&this.depthMode<=2){
			this.quickSort(0,n-1);
		}else if(this.additionalFixEnabled||this.depthMode==3){
			this.quickSort2(0,n-1);
		}
		var matrixa=new Matrix();//uvm对应点坐标
		var matrixb=new Matrix();//uvm2对应
		var arre=new Array(8),arre2=new Array(8);
		var expandFillRate=this.expandFillRate;
		var useExpandPixel=this.useExpandPixel;
		var expandFillRange=this.expandFillRange;
		var graphics=this.graphics;
		
		/*if(quickSortEnabled && additionalFixEnabled){
				additionalFix(n);
			}*/
			
		if(graphics==null){
			return;
		}
		
		graphics.clearRect(0,0,this.wid,this.hei);
		graphics.beginPath();		
		for(i=i0;i<n;i++){
			arr=planeArray[i];
			//if(arr[0]<=sy/50){
			//break;
			//}
			//if(useOtherModel){
			model=modelArr[arr[10]];
			bmdt=model.bmpd;
			uvmt=model.uvm;
			useBitmap=(bmdt!=null&&uvmt.length>0);
			modelUseUvm2=model.useUvm2;//}				
			smoothi=model.coordc[arr[9]];
			if(useBitmap){
				model.bmpdMatrix(matrixa,bmdt.width,bmdt.height,arr[1],arr[2],arr[3],arr[4],arr[5],arr[6],uvmt[arr[9]]);
				graphics.fillStyle=model.pattern;
				graphics.setTransform(matrixa.a,matrixa.b,matrixa.c,matrixa.d,matrixa.tx,matrixa.ty);				
				graphics.beginPath();
			}else if(!modelUseUvm2){
				graphics.fillStyle=toColorString(smoothi);
				graphics.beginPath();
			}else if(smoothi<0){
				arrc=model.coord[arr[9]];
				graphics.fillStyle=this.gradientInfo(arr[1],arr[2],arr[3],
							arr[4],arr[5],arr[6],
							model.pointc[arrc[0]],model.pointc[arrc[1]],
							model.pointc[arrc[2]],model.highSmooth);
				
				graphics.beginPath();
			}else{
				graphics.fillStyle=toColorString(smoothi);
				graphics.beginPath();
			}
			if(!isNaN(arr[7])&&(!useBitmap||!modelUseUvm2)){
				if(useExpandPixel){
					expandPolygenByPixel(arre,arr,1,4,expandFillRange);
				}else{
					expandPolygen(arre,arr,1,4,expandFillRate);
				}
				graphics.moveTo(arre[0],arre[1]);
				graphics.lineTo(arre[2],arre[3]);			
				graphics.lineTo(arre[6],arre[7]);
				graphics.lineTo(arre[4],arre[5]);				
			}else{
				if(useExpandPixel){
					expandPolygenByPixel(arre,arr,1,3,expandFillRange);
				}else{
					expandPolygen(arre,arr,1,3,expandFillRate);
				}
				
				if(useBitmap){
					matrixa.invert();
					transformPointsWithTexture(arre,matrixa);
				}
				graphics.moveTo(arre[0],arre[1]);
				graphics.lineTo(arre[2],arre[3]);
				graphics.lineTo(arre[4],arre[5]);
			}
			if(!isNaN(arr[7])&&(useBitmap||smoothi<0)&&modelUseUvm2){
				//graphics.closePath();
				graphics.fill();
				if(useBitmap){
					uvmt=model.uvm2;
					model.bmpdMatrix(matrixb,bmdt.width,bmdt.height,arr[3],arr[4],arr[5],arr[6],arr[7],arr[8],uvmt[arr[9]]);
					graphics.fillStyle=model.pattern;					
					graphics.setTransform(matrixb.a,matrixb.b,matrixb.c,matrixb.d,matrixb.tx,matrixb.ty);
					graphics.beginPath();
				}else{
					graphics.fillStyle=this.gradientInfo(arr[3],arr[4],arr[5],
								arr[6],arr[7],arr[8],
								model.pointc[arrc[1]],model.pointc[arrc[2]],
								model.pointc[arrc[3]],model.highSmooth);
					graphics.beginPath();
				}
				
				//graphics.moveTo(arr[3],arr[4]);
				//graphics.lineTo(arr[5],arr[6]);
				//graphics.lineTo(arr[7],arr[8]);
				if(useExpandPixel){
					expandPolygenByPixel(arre,arr,3,3,expandFillRange);
				}else{
					expandPolygen(arre,arr,3,3,expandFillRate);
				}
				if(useBitmap){
					matrixb.invert();
					transformPointsWithTexture(arre,matrixb);
				}
				graphics.moveTo(arre[0],arre[1]);
				graphics.lineTo(arre[2],arre[3]);
				graphics.lineTo(arre[4],arre[5]);
			}
			//graphics.closePath();
			graphics.fill();
			if(useBitmap){
				graphics.setTransform(1,0,0,1,0,0);
			}
			//graphics.stroke();
		}//trace(this.filters.length);
	}
	
	this.attachPlane=function(planeArrayt,n,modelArr,m,scaleShape,tx0,ty0,tz0,rm0){
		if(arguments.length<9)rm0=null;
		if(arguments.length<8)tz0=0;
		if(arguments.length<7)ty0=0;
		if(arguments.length<6)tx0=0;
		if(arguments.length<5)scaleShape=1;
		if(arguments.length<4)m=0;
		if(arguments.length<3)modelArr=null;
		if(arguments.length<2)n=0;
		if(arguments.length<1)planeArrayt=null;//将当前模型的planeArrayt清空（有效长度变为零），并将当前模型、子模型和兄弟模型的平面信息逐个加入到这个planeArrayt当中。
		var point=this.point;
		var coord=this.coord;
		var uv=this.uv;
		var coord2=this.coord2;
		var coordc=this.coordc;
		var i=0;//循环变量
		var j=0;
		var tx=this.tx;
		var ty=this.ty;
		var tz=this.tz;
		var rx=this.rx;
		var ry=this.ry;
		var rz=this.rz;
		if(planeArrayt==null){
			planeArrayt=this.planeArray;
		}
		if(planeArrayt==null||planeArrayt.length<facesMax){
			for(i=0;i<facesMax;i++){
				planeArrayt[i]=[-1,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,0,0,-1];
			}
		}
		if(coordn==null||coordn.length<=0||this.useSmooth&&(pointn==null||pointn.length<=0)){
			this.createN();
		}
		if(this.rootModel.additionalFixEnabled&&coorda.length!=coord.length){
			coorda=new Array(coord.length);
			for(i=0;i<coorda.length;i++){
				coorda[i]=new Array(16);
			}
		}
		if(modelArr==null){
			modelArr=this.modelArr;
		}
		scaleShape*=this.scaleShape;
		var pointc=this.pointc;
		var pxmin=-this.pxedge;//左边界
		var pxmax=this.wid+this.pxedge;//右边界
		var pymin=this.mdy+this.pyedge2;//上边界
		var pymax=this.hei+this.pyedge;//下边界
		var x3d,y3d,z3d,temp,temp2;//平面法向量和临时变量
		var x3d2,y3d2,z3d2;//顶点法向量
		var x1,x2,x3,x4,x5,x6;//空间顶点坐标和顶点最值	
		var y1,y2,y3,y4,y5,y6;
		var z1,z2,z3,z4,z5,z6;
		var arr,arrc,arrcn;//planeArrayt元素，coord元素，coordn元素
		//var m:int=0;
		var leng=pointt.length;//顶点数
		var leng2=coord.length<facesMax?coord.length:facesMax;//面数
		//var sinrx:Number=Math.sin((rx+rx0)*Math.PI/180),cosrx:Number=Math.cos((rx+rx0)*Math.PI/180),sinry:Number=Math.sin((ry+ry0)*Math.PI/180),cosry:Number=Math.cos((ry+ry0)*Math.PI/180),sinrz:Number=Math.sin((rz+rz0)*Math.PI/180),cosrz:Number=Math.cos((rz+rz0)*Math.PI/180);//算出旋转的三角函数值
		arr=this.toRotationMatrix(rx,ry,rz,this.rw);
		var rm;
		if(rm0!=null){
			rm=[arr[0]*rm0[0]+arr[1]*rm0[3]+arr[2]*rm0[6],arr[0]*rm0[1]+arr[1]*rm0[4]+arr[2]*rm0[7],arr[0]*rm0[2]+arr[1]*rm0[5]+arr[2]*rm0[8],arr[3]*rm0[0]+arr[4]*rm0[3]+arr[5]*rm0[6],arr[3]*rm0[1]+arr[4]*rm0[4]+arr[5]*rm0[7],arr[3]*rm0[2]+arr[4]*rm0[5]+arr[5]*rm0[8],arr[6]*rm0[0]+arr[7]*rm0[3]+arr[8]*rm0[6],arr[6]*rm0[1]+arr[7]*rm0[4]+arr[8]*rm0[7],arr[6]*rm0[2]+arr[7]*rm0[5]+arr[8]*rm0[8]];
		}else{
			rm=arr;
		}
		var r1=rm[0],r2=rm[1],r3=rm[2],r4=rm[3],r5=rm[4],r6=rm[5],r7=rm[6],r8=rm[7],r9=rm[8];
		var txp;
		var typ;
		var tzp;
		var rmp;
		var rxp;
		var ryp;
		var rzp;
		var rxpi=0;
		var rzpi=0;
		var sinryp;
		var cosryp;
		if(this.rotationType<0){
			if(this.rotationType==-1){
				txp=tx+tx0+sx;
				typ=ty+ty0+sy+sy;
				tzp=tz+tz0;
			}else{
				txp=(tx+tx0)*r1+(ty+ty0)*r4+(tz+tz0)*r7+sx;
				typ=(tx+tx0)*r2+(ty+ty0)*r5+(tz+tz0)*r8;
				tzp=(tx+tx0)*r3+(ty+ty0)*r6+(tz+tz0)*r9;
			}
			if(this.usePerspective&&this.usePerspectiveRotation){
				arr=this.toRotationMatrix(Math.atan((this.mdy-tzp)/(2*sy))*180/Math.PI,0,Math.atan((this.mdx-txp)/(2*sy))*180/Math.PI);
				rmp=[rm[0]*arr[0]+rm[1]*arr[3]+rm[2]*arr[6],rm[0]*arr[1]+rm[1]*arr[4]+rm[2]*arr[7],rm[0]*arr[2]+rm[1]*arr[5]+rm[2]*arr[8],rm[3]*arr[0]+rm[4]*arr[3]+rm[5]*arr[6],rm[3]*arr[1]+rm[4]*arr[4]+rm[5]*arr[7],rm[3]*arr[2]+rm[4]*arr[5]+rm[5]*arr[8],rm[6]*arr[0]+rm[7]*arr[3]+rm[8]*arr[6],rm[6]*arr[1]+rm[7]*arr[4]+rm[8]*arr[7],rm[6]*arr[2]+rm[7]*arr[5]+rm[8]*arr[8]];
			}else{
				rmp=rm;
			}
			if((rmp[1]!=0||rmp[4]!=0)&&(rmp[6]!=0||rmp[8]!=0)){
				rxp=Math.asin(-rmp[7])*180/Math.PI;
				ryp=Math.atan2(rmp[6],rmp[8])*180/Math.PI;
				rzp=Math.atan2(-rmp[1],rmp[4])*180/Math.PI;
			}else{
				//万向锁
				rxp=rmp[7]>0?-90:90;
				ryp=0;
				rzp=Math.atan2(rmp[3],rmp[0])*180/Math.PI;
			}
			sinryp=Math.sin(ryp*Math.PI/180);
			cosryp=Math.cos(ryp*Math.PI/180);
			if(this.frameList!=null&&this.frameListRect!=null&&this.frameList.length>0&&this.frameListRect.length>0){
				if(!this.useListRotationx){
					rxpi=this.frameListi%this.frameList.length;
					if(rxpi<0){
						rxpi+=this.frameList.length;
					}
				}else{
					rxpi=Math.round((rxp-this.listrxmin)*this.frameList.length/(this.listrxmax-this.listrxmin));
					if(rxpi>=this.frameList.length){
						rxpi=this.frameList.length-1;
					}
					if(rxpi<0){
						rxpi=0;
					}
				}
				rzpi=Math.round(rzp*this.frameList[rxpi].length/360);
				if(rzpi>=this.frameList[rxpi].length){
					rzpi-=this.frameList[rxpi].length;
				}
				if(rzpi<0){
					rzpi+=this.frameList[rxpi].length;
				}
				point[0][0]=this.frameListRect[rxpi][rzpi].left;
				point[0][2]=-this.frameListRect[rxpi][rzpi].bottom;
				point[1][0]=this.frameListRect[rxpi][rzpi].right;
				point[1][2]=-this.frameListRect[rxpi][rzpi].bottom;
				point[2][0]=this.frameListRect[rxpi][rzpi].left;
				point[2][2]=-this.frameListRect[rxpi][rzpi].top;
				point[3][0]=this.frameListRect[rxpi][rzpi].right;
				point[3][2]=-this.frameListRect[rxpi][rzpi].top;
				this.bmpd=this.frameList[rxpi][rzpi];
				this.createN();
				this.createUVMatrix();
			}
		}
		var smoothi;//光滑情况
		//var mg:Matrix=new Matrix();//光滑的渐变填充所用的矩阵
		var tsorder=0;//透视图中点的旋向（区分正面还是背面）
		var useBitmap=(this.bmpd!=null&&uv.length>0);//是否采用贴图
		var cpx,cpy;//裁减后的空间点横坐标和纵坐标
		var ntrim2=sy/ntrim;//裁减时的近处下限
		var tx2;
		var ty2;
		var tz2;
		var rx2;
		var ry2;
		var rz2;
		var rw2;
		var model;
		var mc;
		var zoomy;
		var zoomy0=this.wid/(2*tanS);
		var mdxt=this.mdx;
		var mdyt=this.mdy;
		var ymin=sy/this.ymins;
		if(this.rotationType==2){
			tx2=tx>=0?tx%(this.gridWid*scaleShape):tx%(this.gridWid*scaleShape)+this.gridWid*scaleShape;
			ty2=ty>=0?ty%(this.gridHei*scaleShape):ty%(this.gridWid*scaleShape)+this.gridHei*scaleShape;
		}
		for(i=0;i<leng;i++){
			if(this.rotationType==0){
				x3d=point[i][0]*scaleShape;
				y3d=point[i][1]*scaleShape;
				z3d=point[i][2]*scaleShape;
				temp=x3d*r1+y3d*r4+z3d*r7;
				temp2=x3d*r2+y3d*r5+z3d*r8;
				z3d=x3d*r3+y3d*r6+z3d*r9;
				x3d=temp;
				y3d=temp2;
				pointt[i][0]=x3d+tx+tx0+sx;
				pointt[i][1]=y3d+ty+ty0+sy+sy;
				pointt[i][2]=z3d+tz+tz0;
			}else if(this.rotationType==1){
				x3d=point[i][0]*scaleShape+tx+tx0;
				y3d=point[i][1]*scaleShape+ty+ty0;
				z3d=point[i][2]*scaleShape+tz+tz0;
				temp=x3d*r1+y3d*r4+z3d*r7;
				temp2=x3d*r2+y3d*r5+z3d*r8;
				z3d=x3d*r3+y3d*r6+z3d*r9;
				x3d=temp;
				y3d=temp2;
				pointt[i][0]=x3d+sx;
				pointt[i][1]=y3d;
				pointt[i][2]=z3d;
			}else if(this.rotationType==2){
				x3d=point[i][0]*scaleShape+tx2+tx0;
				y3d=point[i][1]*scaleShape+ty2+ty0;
				z3d=point[i][2]*scaleShape+tz+tz0;
				temp=x3d*r1+y3d*r4+z3d*r7;
				temp2=x3d*r2+y3d*r5+z3d*r8;
				z3d=x3d*r3+y3d*r6+z3d*r9;
				x3d=temp;
				y3d=temp2;
				pointt[i][0]=x3d+sx;
				pointt[i][1]=y3d;
				pointt[i][2]=z3d;
			}else if(this.rotationType<0){
				x3d=point[i][0]*scaleShape;
				y3d=point[i][1]*scaleShape;
				z3d=point[i][2]*scaleShape;
				temp=x3d*cosryp+z3d*sinryp;
				z3d=z3d*cosryp-x3d*sinryp;
				x3d=temp;
				pointt[i][0]=x3d+txp;
				pointt[i][1]=y3d+typ;
				pointt[i][2]=z3d+tzp;
			}
			if(this.useSmooth){
				pointc[i]=-1;
			}
		}
		for(i=0;i<leng2;i++){
			//trace(coord[i]);	
			arr=planeArrayt[n];
			if(arr==null){
				break;
			}
			arrc=coord[i];
			
			arrcn=coordn[i];
			j=arrc[0];
			x1=pointt[j][0];
			y1=pointt[j][1];
			z1=pointt[j][2];
			if(y1>ymin){
				zoomy=zoomy0/y1;
				arr[1]=parseInt((x1-mdxt)*zoomy+mdxt);
				arr[2]=parseInt(-(z1-mdyt)*zoomy+mdyt);
			}else{
				continue;
			}
			j=arrc[1];
			x2=pointt[j][0];
			y2=pointt[j][1];
			z2=pointt[j][2];
			if(y2>ymin){
				zoomy=zoomy0/y2;
				arr[3]=parseInt((x2-mdxt)*zoomy+mdxt);
				arr[4]=parseInt(-(z2-mdyt)*zoomy+mdyt);
			}else{
				continue;
			}
			j=arrc[2];
			x3=pointt[j][0];
			y3=pointt[j][1];
			z3=pointt[j][2];
			if(y3>ymin){
				zoomy=zoomy0/y3;
				arr[5]=parseInt((x3-mdxt)*zoomy+mdxt);
				arr[6]=parseInt(-(z3-mdyt)*zoomy+mdyt);
			}else{
				continue;
			}
			j=arrc[3];
			if(j>=0){
				x4=pointt[j][0];
				y4=pointt[j][1];
				z4=pointt[j][2];
				if(y4>ymin){
					zoomy=zoomy0/y4;
					arr[7]=parseInt((x4-mdxt)*zoomy+mdxt);
					arr[8]=parseInt(-(z4-mdyt)*zoomy+mdyt);
				}else{
					continue;
				}
				if(this.trimEnabled&&this.ymax<Infinity&&y1>this.ymax&&y2>this.ymax&&y3>this.ymax&&y4>this.ymax){
					continue;
				}
				if(this.trimEnabled&&(arr[2]<pymin||arr[2]>=pymax||arr[1]<pxmin||arr[1]>=pxmax)&&(arr[4]<pymin||arr[4]>=pymax||arr[3]<pxmin||arr[3]>=pxmax)&&(arr[6]<pymin||arr[6]>=pymax||arr[5]<pxmin||arr[5]>=pxmax)&&(arr[8]<pymin||arr[8]>=pymax||arr[7]<pxmin||arr[7]>=pxmax)){
					continue;
				}
				y4=pointt[j][1];
				if(this.quickSortEnabled){
					y6=Math.max(y1,y2,y3,y4);
					if(this.depthMode==0||this.depthMode==1){
						y5=Math.min(y1,y2,y3,y4);
					}
					if(this.depthMode==0){
						x5=Math.min(x1,x2,x3,x4);
						x6=Math.max(x1,x2,x3,x4);
						z5=Math.min(z1,z2,z3,z4);
						z6=Math.max(z1,z2,z3,z4);
					}
				}
			}else{
				if(this.trimEnabled&&this.ymax<Infinity&&y1>this.ymax&&y2>this.ymax&&y3>this.ymax){
					continue;
				}
				if(this.trimEnabled&&(arr[2]<pymin||arr[2]>=pymax||arr[1]<pxmin||arr[1]>=pxmax)&&(arr[4]<pymin||arr[4]>=pymax||arr[3]<pxmin||arr[3]>=pxmax)&&(arr[6]<pymin||arr[6]>=pymax||arr[5]<pxmin||arr[5]>=pxmax)){
					continue;
				}
				arr[7]=NaN;
				arr[8]=NaN;
				if(this.quickSortEnabled){
					y6=Math.max(y1,y2,y3);
					if(this.depthMode==1||this.depthMode==0){
						y5=Math.min(y1,y2,y3);
					}
					if(this.depthMode==0){
						x5=Math.min(x1,x2,x3);
						x6=Math.max(x1,x2,x3);
						z5=Math.min(z1,z2,z3);
						z6=Math.max(z1,z2,z3);
					}
				}
			}
			if(this.rootModel.additionalFixEnabled){
				arr[0]=y6;
				arr[11]=y5;
			}else if(this.quickSortEnabled){
				arr[0]=this.depthMode==0?(x5+x6-2*this.mdx)*(x5+x6-2*this.mdx)+(y5+y6)*(y5+y6)+(z5+z6-2*this.mdy)*(z5+z6-2*this.mdy):this.depthMode==1?y5+y6:y6;
				arr[11]=-1;
			}else{
				arr[0]=2*ymin;
				arr[11]=-1;
			}
			if(this.hideBack!=0){
				tsorder=arrc[3]<0?(arr[3]-arr[1])*(arr[6]-arr[2])-(arr[4]-arr[2])*(arr[5]-arr[1]):(arr[7]-arr[1])*(arr[6]-arr[4])-(arr[8]-arr[2])*(arr[5]-arr[3]);
				if(tsorder>0&&this.hideBack>0||tsorder<0&&this.hideBack<0){
					continue;
				}
			}
			if(!useBitmap||this.rootModel.additionalFixEnabled){
				x3d=arrcn[0];
				y3d=arrcn[1];
				z3d=arrcn[2];
				temp=x3d*r1+y3d*r4+z3d*r7;
				temp2=x3d*r2+y3d*r5+z3d*r8;
				z3d=x3d*r3+y3d*r6+z3d*r9;
				x3d=temp;
				y3d=temp2;
				coordc[i]=-1;
			}
			if(this.rootModel.additionalFixEnabled){
				coorda[i][0]=x3d;
				coorda[i][1]=y3d;
				coorda[i][2]=z3d;
				coorda[i][3]=-(x3d*x1+y3d*y1+z3d*z1);
				coorda[i][4]=x1;
				coorda[i][5]=y1;
				coorda[i][6]=z1;
				coorda[i][7]=x2;
				coorda[i][8]=y2;
				coorda[i][9]=z2;
				coorda[i][10]=x3;
				coorda[i][11]=y3;
				coorda[i][12]=z3;
				if(coordn[i][3]==-1){
					coorda[i][13]=NaN;
					coorda[i][14]=NaN;
					coorda[i][15]=NaN;
				}else{
					coorda[i][13]=x4;
					coorda[i][14]=y4;
					coorda[i][15]=z4;
				}
			}
			if(useBitmap){
				coordc[i]=-1;
			}else if(!useBitmap&&this.useSmooth){
				j=arrc[0];
				if(pointc[j]<0){
					x3d2=pointn[j][0];
					y3d2=pointn[j][1];
					z3d2=pointn[j][2];
					temp=x3d2*r1+y3d2*r4+z3d2*r7;
					temp2=x3d2*r2+y3d2*r5+z3d2*r8;
					z3d2=x3d2*r3+y3d2*r6+z3d2*r9;
					x3d2=temp;
					y3d2=temp2;
					pointc[j]=this.useSpecular?this.specularColour(this.colour,x1,y1,z1,x3d2,y3d2,z3d2,this.spotInten,this.spotInten*0.7):this.diffuseColour(this.colour,x1,y1,z1,x3d2,y3d2,z3d2,this.spotInten,this.spotInten*0.7);
				}
				j=arrc[1];
				if(pointc[j]<0){
					x3d2=pointn[j][0];
					y3d2=pointn[j][1];
					z3d2=pointn[j][2];
					temp=x3d2*r1+y3d2*r4+z3d2*r7;
					temp2=x3d2*r2+y3d2*r5+z3d2*r8;
					z3d2=x3d2*r3+y3d2*r6+z3d2*r9;
					x3d2=temp;
					y3d2=temp2;
					pointc[j]=this.useSpecular?this.specularColour(this.colour,x2,y2,z2,x3d2,y3d2,z3d2,this.spotInten,this.spotInten*0.7):this.diffuseColour(this.colour,x2,y2,z2,x3d2,y3d2,z3d2,this.spotInten,this.spotInten*0.7);
				}
				j=arrc[2];
				if(pointc[j]<0){
					x3d2=pointn[j][0];
					y3d2=pointn[j][1];
					z3d2=pointn[j][2];
					temp=x3d2*r1+y3d2*r4+z3d2*r7;
					temp2=x3d2*r2+y3d2*r5+z3d2*r8;
					z3d2=x3d2*r3+y3d2*r6+z3d2*r9;
					x3d2=temp;
					y3d2=temp2;
					pointc[j]=this.useSpecular?this.specularColour(this.colour,x3,y3,z3,x3d2,y3d2,z3d2,this.spotInten,this.spotInten*0.7):this.diffuseColour(this.colour,x3,y3,z3,x3d2,y3d2,z3d2,this.spotInten,this.spotInten*0.7);
				}
				j=arrc[3];
				if(j>=0&&pointc[j]<0){
					x3d2=pointn[j][0];
					y3d2=pointn[j][1];
					z3d2=pointn[j][2];
					temp=x3d2*r1+y3d2*r4+z3d2*r7;
					temp2=x3d2*r2+y3d2*r5+z3d2*r8;
					z3d2=x3d2*r3+y3d2*r6+z3d2*r9;
					x3d2=temp;
					y3d2=temp2;
					pointc[j]=this.useSpecular?this.specularColour(this.colour,x4,y4,z4,x3d2,y3d2,z3d2,this.spotInten,this.spotInten*0.7):this.diffuseColour(this.colour,x4,y4,z4,x3d2,y3d2,z3d2,this.spotInten,this.spotInten*0.7);
				}
				coordc[i]=-1;
			}else if(this.useSpecular){
				coordc[i]=this.specularColour(this.colour,(x5+x6)*0.5,(y5+y6)*0.5,(z5+z6)*0.5,x3d,y3d,z3d,this.spotInten,this.spotInten*0.7);
			}else{
				//trace(coordc);
				coordc[i]=this.diffuseColour(this.colour,(x5+x6)*0.5,(y5+y6)*0.5,(z5+z6)*0.5,x3d,y3d,z3d,this.spotInten,this.spotInten*0.7);
			}
			arr[9]=i;
			arr[10]=m;//if(trimEnabled2){
			//if(y1<)
			//}
			
			
			n++;
		}
		if(m<modelArr.length){
			modelArr[m]=this;
		}else{
			modelArr.push(this);
		}
		m++;
		if(this.child!=null&&this.child.length>0){
			leng=this.child.length;
			for(i=0;i<leng;i++){
				model=this.child[i];
				if(model==null){
					continue;
				}
				tx2=model.tx;
				ty2=model.ty;
				tz2=model.tz;
				if(this.rotationType==0||this.rotationType==-1){
					x3d=tx2*scaleShape;
					y3d=ty2*scaleShape;
					z3d=tz2*scaleShape;
					temp=x3d*r1+y3d*r4+z3d*r7;
					temp2=x3d*r2+y3d*r5+z3d*r8;
					z3d=x3d*r3+y3d*r6+z3d*r9;
					x3d=temp;
					y3d=temp2;
					tx2=x3d+tx+tx0-tx2;
					ty2=y3d+ty+ty0-ty2;
					tz2=z3d+tz+tz0-tz2;
				}else{
					rx2=model.rx;
					ry2=model.ry;
					rz2=model.rz;
					rw2=model.rw;
					x3d=tx+tx0;
					y3d=ty+ty0;
					z3d=tz+tz0;
					arr=this.toRotationMatrix(rx2,ry2,rz2,rw2);//旋转矩阵是正交矩阵，即逆矩阵和转置矩阵相同
					temp=x3d*arr[0]+y3d*arr[1]+z3d*arr[2];
					temp2=x3d*arr[3]+y3d*arr[4]+z3d*arr[5];
					z3d=x3d*arr[6]+y3d*arr[7]+z3d*arr[8];
					x3d=temp;
					y3d=temp2;
					tx2+=x3d/scaleShape;
					ty2+=y3d/scaleShape;
					tz2+=z3d/scaleShape;
					tx2*=scaleShape;
					ty2*=scaleShape;
					tz2*=scaleShape;
				}
				model.spotx=this.spotx;
				model.spoty=this.spoty;
				model.spotz=this.spotz;
				model.pxedge=this.pxedge;
				model.pyedge=this.pyedge;
				model.pyedge2=this.pyedge2;
				model.mdx=this.mdx;
				model.mdy=this.mdy;
				model.parentModel=this;
				model.rootModel=this.rootModel;
				if(this.rotationType>=0){
					model.rotationType=model.rotationType>=0?(this.rotationType==2?1:this.rotationType):(this.rotationType==2?-2:-1-this.rotationType);
				}else{
					model.rotationType=model.rotationType>=0?-1-this.rotationType:this.rotationType;
				}
				arr=model.attachPlane(planeArrayt,n,modelArr,m,scaleShape,tx2,ty2,tz2,rm);
				n=arr[0];
				m=arr[1];
			}
		}
		if(this.comrade!=null&&this.comrade.length>0){
			leng2=this.comrade.length;
			for(i=0;i<leng2;i++){
				if(this.comrade[i] instanceof  Viewer3d){
					model=this.comrade[i];
					if(model==null){
						continue;
					}
					model.scaleShape=scaleShape;
					model.tx=tx+tx0;
					model.ty=ty+ty0;
					model.tz=tz+tz0;
					/* trace(rm);
						model.rx=rx;
						model.ry=ry;
						model.rz=rz;
						trace(rx,ry,rz); */
					if((r1!=0||r4!=0)&&(r8!=0||r9!=0)){
						model.rx=Math.atan2(-r8,r9)*180/Math.PI;
						model.rz=Math.atan2(r4,r1)*180/Math.PI;
						model.ry=Math.asin(r7)*180/Math.PI;
					}else{
						//万向锁
						model.ry=r7>=0?90:-90;
						model.rz=Math.atan2(-r2,r5);
						model.rx=0;
					}//trace(Math.atan2(-r8,r9),Math.atan2(r7,-r8/Math.sin(model.rx)),Math.atan2(r4,r1));
					model.spotx=this.spotx;
					model.spoty=this.spoty;
					model.spotz=this.spotz;
					model.pxedge=this.pxedge;
					model.pyedge=this.pyedge;
					model.pyedge2=this.pyedge2;
					model.mdx=this.mdx;
					model.mdy=this.mdy;
					model.uncomradeModel=this;
					//model.rootModel=this.rootModel;
					if(this.rotationType>=0){
						model.rotationType=model.rotationType>=0?(this.rotationType==2?1:this.rotationType):(this.rotationType==2?-2:-1-this.rotationType);
					}else{
						model.rotationType=model.rotationType>=0?-1-this.rotationType:this.rotationType;
					}
					model.plot();
				}else{
					/*mc=comrade[i];				
						var matrix3d:Matrix3D=new Matrix3D();						
						if(rotationType==0 || rotationType==-1){
							matrix3d.appendScale(scaleShape,scaleShape,scaleShape);
							matrix3d.append(new Matrix3D(new <Number>[r1,-r3,r2,0,
																	  -r7,r9,-r8,0,
																	  r4,-r6,r5,0,
																	  0,0,0,1]));
							matrix3d.appendTranslation(tx+tx0+sx,hei-tz-tz0,ty+ty0+sy);
					
						}else{
							matrix3d.appendScale(scaleShape,scaleShape,scaleShape);
							matrix3d.appendTranslation(tx+tx0,-tz-tz0,ty+ty0);
							
							matrix3d.append(new Matrix3D(new <Number>[r1,-r3,r2,0,
																	  -r7,r9,-r8,0,
																	  r4,-r6,r5,0,
																	  0,0,0,1]));
							matrix3d.appendTranslation(sx,hei,-sy);
						}
						if(hideBack!=0){
							var v1:Vector3D=new Vector3D(0,0,0,0);							
							var v2:Vector3D=new Vector3D(1/scaleShape,0,0,0);
							var v3:Vector3D=new Vector3D(0,-1/scaleShape,0,0);
							var v4:Vector3D=matrix3d.transformVector(v1);
							var v5:Vector3D=matrix3d.transformVector(v2);
							var v6:Vector3D=matrix3d.transformVector(v3);

							v5.z+=2*sy-v4.z;
							v6.z+=2*sy-v4.z;
							v4.z=2*sy;
							//toushi(v4.x,v4.z,hei-v4.y);
							//x1=s1;
							//y1=s2;
							//toushi(v5.x,v5.z,hei-v5.y);
							//x2=s1;
							//y2=s2;							
							//toushi(v6.x,v6.z,hei-v6.y);
							//x3=s1;
							//y3=s2;
							tsorder=(x2-x1)*(y3-y1)-(y2-y1)*(x3-x1);
							
						}else{
							tsorder=0;
						}
						if(tsorder>0 && hideBack>0 || tsorder<0 && hideBack<0){
							mc.visible=false;
						}else{
							mc.visible=true;
							mc.transform.matrix3D=matrix3d;
						}*/
				}
			}
		}
		if(planeArrayt==this.planeArray){
			this.n=n;
			this.m=m;
		}
		return[n,m];
	}
	
	this.getQuaternion=function(){
		//欧拉角转四元数
		if(!isNaN(rw)){
			return[rx,ry,rz,rw];
		}
		var arr=this.toRotationMatrix(rx,ry,rz,NaN);
		var rxrw=(arr[5]-arr[7])*0.25;
		var ryrw=(arr[6]-arr[2])*0.25;
		var rzrw=(arr[1]-arr[3])*0.25;
		var rwt;
		if(arr[0]+arr[4]+arr[8]>=1){
			//rwt=Math.sqrt(0.5+Math.sqrt(0.25-rxrw*rxrw-ryrw*ryrw-rzrw*rzrw));
			rwt=Math.sqrt(Math.abs(0.5+Math.sqrt(Math.abs(0.25-rxrw*rxrw-ryrw*ryrw-rzrw*rzrw))));
		}else{
			//rwt=Math.sqrt(0.5-Math.sqrt(0.25-rxrw*rxrw-ryrw*ryrw-rzrw*rzrw));
			rwt=Math.sqrt(Math.abs(0.5-Math.sqrt(Math.abs(0.25-rxrw*rxrw-ryrw*ryrw-rzrw*rzrw))));
		}
		if(rwt!=0){
			return[rxrw/rwt,ryrw/rwt,rzrw/rwt,rwt];
		}else{
			//增根
			var rxt=Math.sqrt(Math.abs((arr[4]+arr[8])*(-0.5)));
			var ryt=Math.sqrt(Math.abs((arr[0]+arr[8])*(-0.5)));
			var rzt=Math.sqrt(Math.abs((arr[0]+arr[4])*(-0.5)));
			if(arr[5]<0||arr[2]<0||arr[1]<0){
				if(arr[5]>0){
					rxt=-rxt;
				}
				if(arr[2]>0){
					ryt=-ryt;
				}
				if(arr[1]>0){
					rzt=-rzt;
				}
			}
			return[rxt,ryt,rzt,0];
		}
	}
	
	this.getEulerAngles=function(){
		//四元数转欧拉角
		if(isNaN(rw)){
			return[rx,ry,rz,NaN];
		}
		var arr=this.toRotationMatrix(rx,ry,rz,rw);
		var rxt;
		var ryt;
		var rzt;
		if(this.rotationType==0||this.rotationType==-1||(this.rootModel!=null&&this.rootModel!=this)){
			if((arr[0]!=0||arr[3]!=0)&&(arr[7]!=0||arr[8]!=0)){
				rxt=Math.atan2(-arr[7],arr[8])*180/Math.PI;
				rzt=Math.atan2(arr[3],arr[0])*180/Math.PI;
				ryt=Math.asin(arr[6])*180/Math.PI;
			}else{
				//万向锁
				ryt=arr[6]>=0?90:-90;
				rzt=Math.atan2(-arr[1],arr[4]);
				rxt=0;
			}
		}else{
			if((arr[1]!=0||arr[0]!=0)&&(arr[5]!=0||arr[8]!=0)){
				rxt=Math.atan2(arr[5],arr[8])*180/Math.PI;
				ryt=Math.atan2(-arr[1],arr[0])*180/Math.PI;
				rzt=-Math.asin(arr[2])*180/Math.PI;
			}else{
				//万向锁
				rxt=-arr[2]>=0?90:-90;
				ryt=Math.atan2(arr[3],arr[4]);
				rzt=0;
			}
		}
		return[rxt,ryt,rzt,NaN];
	}
	
	this.getAxisRotation=function(){
		//获得当前旋转所绕的轴和旋转的角度数
		var axsw;
		var aysw;
		var azsw;
		var cw;
		var sw;
		var arr;
		if(isNaN(rw)){
			arr=this.getQuaternion();
			axsw=arr[0];
			aysw=arr[1];
			azsw=arr[2];
			cw=arr[3];
		}else{
			axsw=rx;
			aysw=ry;
			azsw=rz;
			cw=rw;
		}
		sw=Math.sqrt(1-cw*cw);
		var angle=Math.acos(cw)*360/Math.PI;
		if(angle<0){
			sw=-sw;
		}
		if(cw==1||cw==-1||sw==0){
			return[0,0,1,0];
		}else{
			return[axsw/sw,aysw/sw,azsw/sw,angle];
		}
	}
	
	Viewer3d.getQuaternionArrayFromAxis=function(ax,ay,az,angle){
		//从环绕的旋转轴和其角度中获得四元数(旋转轴向量，旋转轴角度)
		var d=Math.sqrt(ax*ax+ay*ay+az*az);
		var cosw_2=Math.cos(angle*Math.PI/360);
		var sinw_2=Math.sin(angle*Math.PI/360);
		return[ax*sinw_2/d,ay*sinw_2/d,az*sinw_2/d,cosw_2];
	}
	
	this.updateQuaternionFromAxis=function(ax,ay,az,angle){
		//从环绕的旋转轴和其角度中获得四元数并更新到当前的旋转属性(旋转轴向量，旋转轴角度)
		var arr=Viewer3df11.getQuaternionArrayFromAxis(ax,ay,az,angle);
		this.rx=arr[0];
		this.ry=arr[1];
		this.rz=arr[2];
		this.rw=arr[3];
	}
	
	this.concatAxisRotation=function(ax,ay,az,angle){
		//追加一个绕某个轴旋转的角度
		var arr;
		var rx0;
		var ry0;
		var rz0;
		var rw0;
		if(isNaN(rw)){
			arr=this.getQuaternion();
			rx0=arr[0];
			ry0=arr[1];
			rz0=arr[2];
			rw0=arr[3];
		}else{
			rx0=rx;
			ry0=ry;
			rz0=rz;
			rw0=rw;
		}
		arr=Viewer3df11.getQuaternionArrayFromAxis(ax,ay,az,angle);
		this.rx=rx0*arr[3]+rw0*arr[0]+rz0*arr[1]-ry0*arr[2];
		this.ry=ry0*arr[3]+rw0*arr[1]+rx0*arr[2]-rz0*arr[0];
		this.rz=rz0*arr[3]+rw0*arr[2]+ry0*arr[0]-rx0*arr[1];
		this.rw=rw0*arr[3]-rx0*arr[0]-ry0*arr[1]-rz0*arr[2];
	}
	
	this.concatAxisRotationFromVelocity=function(r,vx,vy,vz,nx,ny,nz){
		if(arguments.length<7)nz=1;
		if(arguments.length<6)ny=0;
		if(arguments.length<5)nx=0;
		if(arguments.length<4)vz=0;//从运动速度和所附着平面的法向量，追加一个绕某个轴滚动的角度
		if(vx==0&&vy==0&&vz==0){
			return;
		}
		this.concatAxisRotation(ny*vz-vy*nz,vx*nz-nx*vz,nx*vy-vx*ny,(Math.sqrt(vx*vx+vy*vy+vz*vz)*180)/(Math.PI*r));
	}
	
	this.concatAngles=function(rx2,ry2,rz2,rw2){
		if(arguments.length<4)rw2=NaN;
		var rx3;
		var ry3;
		var rz3;
		var rw3;
		if(isNaN(rw2)){
			var arr=this.toRotationMatrix(this.rx,this.ry,this.rz,this.rw);
			var arr2=this.toRotationMatrix(rx2,ry2,rz2);
			var arr3=[arr[0]*arr2[0]+arr[1]*arr2[3]+arr[2]*arr2[6],arr[0]*arr2[1]+arr[1]*arr2[4]+arr[2]*arr2[7],arr[0]*arr2[2]+arr[1]*arr2[5]+arr[2]*arr2[8],arr[3]*arr2[0]+arr[4]*arr2[3]+arr[5]*arr2[6],arr[3]*arr2[1]+arr[4]*arr2[4]+arr[5]*arr2[7],arr[3]*arr2[2]+arr[4]*arr2[5]+arr[5]*arr2[8],arr[6]*arr2[0]+arr[7]*arr2[3]+arr[8]*arr2[6],arr[6]*arr2[1]+arr[7]*arr2[4]+arr[8]*arr2[7],arr[6]*arr2[2]+arr[7]*arr2[5]+arr[8]*arr2[8]];
			if((arr3[0]!=0||arr3[3]!=0)&&(arr3[7]!=0||arr3[8]!=0)){
				rx3=Math.atan2(-arr3[7],arr3[8])*180/Math.PI;
				rz3=Math.atan2(arr3[3],arr3[0])*180/Math.PI;
				ry3=Math.asin(arr3[6])*180/Math.PI;
			}else{
				//万向锁
				ry3=arr3[6]>=0?90:-90;
				rz3=Math.atan2(-arr3[1],arr3[4]);
				rx3=0;
			}
			rw3=NaN;
		}else{
			rx3=this.rw*rx2+this.rx*rw2+this.ry*rz2-this.rz*ry2;
			ry3=this.rw*ry2-this.rx*rz2+this.ry*rw2+this.rz*rx2;
			rz3=this.rw*rz2+this.rx*ry2-this.ry*rx2+this.rz*rw2;
			rw3=this.rw*rw2-this.rx*rx2-this.ry*ry2-this.rz*rz2;
		}
		this.rx=rx3;
		this.ry=ry3;
		this.rz=rz3;
		this.rw=rw3;
	}
	
	this.toRotationMatrix=function(rx,ry,rz,rw){
		if(arguments.length<4)rw=NaN;
		if(isNaN(rw)){
			var sx=Math.sin(rx*Math.PI/180);
			var cx=Math.cos(rx*Math.PI/180);
			var sy=Math.sin(ry*Math.PI/180);
			var cy=Math.cos(ry*Math.PI/180);
			var sz=Math.sin(rz*Math.PI/180);
			var cz=Math.cos(rz*Math.PI/180);
			return[cy*cz,-cx*sz+sx*sy*cz,-sx*sz-cx*sy*cz,cy*sz,cx*cz+sx*sy*sz,sx*cz-cx*sy*sz,sy,-sx*cy,cx*cy];
		}else{
			return[rw*rw+rx*rx-ry*ry-rz*rz,2*(rx*ry+rz*rw),2*(rx*rz-ry*rw),2*(rx*ry-rz*rw),rw*rw-rx*rx+ry*ry-rz*rz,2*(ry*rz+rx*rw),2*(rx*rz+ry*rw),2*(ry*rz-rx*rw),rw*rw-rx*rx-ry*ry+rz*rz];
		}
	}
	
	this.quickSort=function(minn,maxn){
		//面片按最大深度的逆序快速排序
		var planeArray=this.planeArray;
		var i;
		var j;
		var temp;
		var k=(minn+maxn)>>1;
		if(k!=minn){
			temp=planeArray[k];
			planeArray[k]=planeArray[minn];
			planeArray[minn]=temp;
		}else if(maxn-minn==1&&planeArray[maxn][0]>planeArray[k][0]){
			temp=planeArray[k];
			planeArray[k]=planeArray[maxn];
			planeArray[maxn]=temp;
			return;
		}
		k=minn;
		var flag=true;
		var flagprev=true;
		i=minn;
		j=maxn;
		while(i<=j){
			flagprev=flag;
			if(flag&&planeArray[j][0]>planeArray[k][0]){
				temp=planeArray[k];
				planeArray[k]=planeArray[j];
				planeArray[j]=temp;
				k=j;
				flag=!flag;
			}else if(!flag&&planeArray[i][0]<planeArray[k][0]){
				temp=planeArray[k];
				planeArray[k]=planeArray[i];
				planeArray[i]=temp;
				k=i;
				flag=!flag;
			}
			flagprev?j-=Number(1):i++;
		}
		temp=null;
		if(k-minn>1){
			this.quickSort(minn,k-1);
		}
		if(maxn-k>1){
			this.quickSort(k+1,maxn);
		}
	}
	
	this.quickSort2=function(minn,maxn){
		//面片按comparePlane的比较算法的逆序快速排序
		var planeArray=this.planeArray;
		var i;
		var j;
		var temp;
		var k=(minn+maxn)>>1;
		if(k!=minn){
			temp=planeArray[k];
			planeArray[k]=planeArray[minn];
			planeArray[minn]=temp;
		}else if(maxn-minn==1&&this.comparePlane(planeArray[maxn],planeArray[k])){
			temp=planeArray[k];
			planeArray[k]=planeArray[maxn];
			planeArray[maxn]=temp;
			return;
		}
		k=minn;
		var flag=true;
		var flagprev=true;
		i=minn;
		j=maxn;
		while(i<=j){
			flagprev=flag;
			if(flag&&this.comparePlane(planeArray[j],planeArray[k])){
				temp=planeArray[k];
				planeArray[k]=planeArray[j];
				planeArray[j]=temp;
				k=j;
				flag=!flag;
			}else if(!flag&&!this.comparePlane(planeArray[i],planeArray[k])){
				temp=planeArray[k];
				planeArray[k]=planeArray[i];
				planeArray[i]=temp;
				k=i;
				flag=!flag;
			}
			flagprev?j-=Number(1):i++;
		}
		temp=null;
		if(k-minn>1){
			this.quickSort(minn,k-1);
		}
		if(maxn-k>1){
			this.quickSort(k+1,maxn);
		}
	}
	
	this.comparePlane=function(planeArrayi1,planeArrayi2){
		var y1=planeArrayi1[0];
		var y2=planeArrayi2[0];
		var p1=planeArrayi1[9];
		var p2=planeArrayi2[9];
		var m1=this.modelArr[planeArrayi1[10]];
		var m2=this.modelArr[planeArrayi2[10]];
		var coorda1=m1.coorda[p1];
		var coorda2=m2.coorda[p2];
		var A=coorda1[0];
		var B=coorda1[1];
		var C=coorda1[2];
		var D=coorda1[3];
		var d0=A*coorda2[4]+B*coorda2[5]+C*coorda2[6]+D;
		var d1=A*coorda2[7]+B*coorda2[8]+C*coorda2[9]+D;
		var d2=A*coorda2[10]+B*coorda2[11]+C*coorda2[12]+D;
		var d3=isNaN(coorda1[13])?0:A*coorda2[13]+B*coorda2[14]+C*coorda2[15]+D;
		var lumda;
		var lumdamin=1-0.0001;
		var lumdamax=1+0.0001;
		if(d0>=0&&d1>=0&&d2>=0&&d3>=0||d0<=0&&d1<=0&&d2<=0&&d3>=0){
			lumda=(-D)/(A*coorda2[4]+B*coorda2[5]+C*coorda2[6]);
			trace(lumda);
			if(lumda<lumdamin||lumda>lumdamax){
				return lumda>1;
			}
			lumda=(-D)/(A*coorda2[7]+B*coorda2[8]+C*coorda2[9]);
			if(lumda<lumdamin||lumda>lumdamax){
				return lumda>1;
			}
			lumda=(-D)/(A*coorda2[10]+B*coorda2[11]+C*coorda2[12]);
			return lumda>1;
		}
		A=coorda2[0];
		B=coorda2[1];
		C=coorda2[2];
		D=coorda2[3];
		d0=A*coorda1[4]+B*coorda1[5]+C*coorda1[6]+D;
		d1=A*coorda1[7]+B*coorda1[8]+C*coorda1[9]+D;
		d2=A*coorda1[10]+B*coorda1[11]+C*coorda1[12]+D;
		d3=isNaN(coorda1[13])?0:A*coorda1[13]+B*coorda1[14]+C*coorda1[15]+D;
		if(d0>=0&&d1>=0&&d2>=0&&d3>=0||d0<=0&&d1<=0&&d2<=0&&d3>=0){
			lumda=(-D)/(A*coorda1[4]+B*coorda1[5]+C*coorda1[6]);
			trace("$"+lumda);
			if(lumda<lumdamin||lumda>lumdamax){
				return lumda<1;
			}
			lumda=(-D)/(A*coorda1[7]+B*coorda1[8]+C*coorda1[9]);
			if(lumda<lumdamin||lumda>lumdamax){
				return lumda<1;
			}
			lumda=(-D)/(A*coorda1[10]+B*coorda1[11]+C*coorda1[12]);
			return lumda<1;
		}
		return planeArrayi1[0]>planeArrayi2[0];
	}
	
	this.additionalFix=function(leng){
		//抗破面
		var i,j,k,l;
		var arr;
		var arr2;
		var isTriangle;
		var model=null;
		var model2=null;
		var d;
		var d1;
		var d2;
		var d3;
		var d4;
		var temp;
		var pointti;
		var coordi;
		var coordni;
		var pointti2;
		var coordi2;
		var coordni2;
		var flag=false;
		var flagprev=false;
		for(i=0;i<leng-1;i++){
			arr=this.planeArray[i];
			arr2=this.planeArray[i+1];
			if(arr[11]>=arr2[0]){
				flagprev=flag;
				flag=false;
			}else{
				if(!flag&&i<leng-2){
					isTriangle=isNaN(arr[7]);
					if((isTriangle?Math.min(arr[1],arr[3],arr[5]):Math.min(arr[1],arr[3],arr[5],arr[7]))>=(isTriangle?Math.max(arr2[1],arr2[3],arr2[5]):Math.max(arr2[1],arr2[3],arr2[5],arr2[7]))){
						continue;
					}
					if((isTriangle?Math.max(arr[1],arr[3],arr[5]):Math.min(arr[1],arr[3],arr[5],arr[7]))<=(isTriangle?Math.min(arr2[1],arr2[3],arr2[5]):Math.max(arr2[1],arr2[3],arr2[5],arr2[7]))){
						continue;
					}
					if((isTriangle?Math.min(arr[2],arr[4],arr[6]):Math.min(arr[2],arr[4],arr[6],arr[8]))>=(isTriangle?Math.max(arr2[2],arr2[4],arr2[6]):Math.max(arr2[2],arr2[4],arr2[6],arr2[8]))){
						continue;
					}
					if((isTriangle?Math.max(arr[2],arr[4],arr[6]):Math.min(arr[2],arr[4],arr[6],arr[8]))<=(isTriangle?Math.min(arr2[2],arr2[4],arr2[6]):Math.max(arr2[2],arr2[4],arr2[6],arr2[8]))){
						continue;
					}
				}
				k=arr[9];
				l=arr2[9];
				model=this.modelArr[arr[10]];
				model2=this.modelArr[arr2[10]];//coordi=model.coord[k];
				//pointti=model.pointt[coordi[0]];
				coordni=model.coorda[k];
				coordi2=model2.coord[l];
				pointti2=model2.pointt[coordi2[0]];//coordni2=model2.coordn[k];
				d=coordni[0]*this.mdx+coordni[2]*this.mdy+coordni[3];
				d1=coordni[0]*pointti2[0]+coordni[1]*pointti2[1]+coordni[2]*pointti2[2]+coordni[3];
				pointti2=model2.pointt[coordi2[1]];
				d2=coordni[0]*pointti2[0]+coordni[1]*pointti2[1]+coordni[2]*pointti2[2]+coordni[3];
				pointti2=model2.pointt[coordi2[2]];
				d3=coordni[0]*pointti2[0]+coordni[1]*pointti2[1]+coordni[2]*pointti2[2]+coordni[3];
				if(coordi2[3]>=0){
					pointti2=model2.pointt[coordi2[3]];
					d4=coordni[0]*pointti2[0]+coordni[1]*pointti2[1]+coordni[2]*pointti2[2]+coordni[3];
				}else{
					d4=0;
				}
				if(d*(d1+d2+d3+d4)<0){
					flagprev=flag;
					flag=true;
					if(!flagprev){
						j=i;
					}
				}else{
					flagprev=flag;
					flag=false;
				}
			}
			if(flagprev&&(!flag||i==leng-2)){
				k=!flag?j+((i-j+1)>>1):j+((i-j+2)>>1);
				while(j<k){
					temp=this.planeArray[k-j-1];
					this.planeArray[k-j-1]=this.planeArray[j];
					this.planeArray[j]=temp;
					j++;
				}
			}
		}
	}
	
	this.diffuseColour=function(colour,px,py,pz,nx,ny,nz,hl,rl){
		if(arguments.length<9)rl=0.927;
		if(arguments.length<8)hl=1.5;//根据某点坐标p、该点法向量n和点光源坐标（或平行光源向量）(spotx,spoty,spotz,spotk)，结合高光强度(正面用hl，背面用rl）和颜色colour生成一个点的漫反射颜色
		var r=(colour>>16)&0xff;
		var g=(colour>>8)&0xff;
		var b=colour&0xff;
		var nd=nx*nx+ny*ny+nz*nz;
		var spx,spy,spz,spd;
		var costheta;
		if(this.spotk){
			spx=px-this.spotx;
			spy=py-this.spoty;
			spz=pz-this.spotz;
			spd=spx*spx+spy*spy+spz*spz;
			costheta=(nx*spx+ny*spy+nz*spz)/Math.sqrt(spd*nd);
		}else{
			spd=this.spotx*this.spotx+this.spoty*this.spoty+this.spotz*this.spotz;
			costheta=(nx*this.spotx+ny*this.spoty+nz*this.spotz)/Math.sqrt(spd*nd);
		}
		if(costheta<=0){
			costheta=-costheta;
			r=(r-this.ambientr)*costheta*rl+this.ambientr;
			g=(g-this.ambientg)*costheta*rl+this.ambientg;
			b=(b-this.ambientb)*costheta*rl+this.ambientb;
		}else{
			r=(r-this.ambientr)*costheta*hl+this.ambientr;
			g=(g-this.ambientg)*costheta*hl+this.ambientg;
			b=(b-this.ambientb)*costheta*hl+this.ambientb;
		}//r=(r-ambientr)*costheta*1.5+ambientr;
		//g=(g-ambientg)*costheta*1.5+ambientg;
		//b=(b-ambientb)*costheta*1.5+ambientb;
		r=(r-this.ambientr)*1.5+this.ambientr;
		g=(g-this.ambientg)*1.5+this.ambientg;
		b=(b-this.ambientb)*1.5+this.ambientb;
		if(r<this.ambientr){
			r=this.ambientr;
		}
		if(g<this.ambientg){
			g=this.ambientg;
		}
		if(b<this.ambientb){
			b=this.ambientb;
		}
		if(r>255){
			r=255;
		}
		if(g>255){
			g=255;
		}
		if(b>255){
			b=255;
		}
		return(r<<16)|(g<<8)|b;
	}
	
	this.specularColour=function(colour,px,py,pz,nx,ny,nz,hl,rl){
		if(arguments.length<9)rl=0.927;
		if(arguments.length<8)hl=1.5;//,ks:Number=0.25,ns:Number=5):int{
		//根据某点坐标p、该点法向量n和点光源坐标（或平行光源向量）(spotx,spoty,spotz,spotk)，结合漫反射高光强度(正面用hl，背面用rl）、镜面反射高光强度ks、光泽度ns和颜色colour生成一个点的镜面反射颜色
		var r=(colour>>16)&0xff;
		var g=(colour>>8)&0xff;
		var b=colour&0xff;
		var nd=Math.sqrt(nx*nx+ny*ny+nz*nz);
		var spx,spy,spz,spd;
		var spx2,spy2,spz2,spd2;
		var costheta;
		var cosphi;
		var lumda;
		if(this.spotk){
			spx=px-this.spotx;
			spy=py-this.spoty;
			spz=pz-this.spotz;
		}else{
			spx=this.spotx;
			spy=this.spoty;
			spz=this.spotz;
		}
		spd=Math.sqrt(spx*spx+spy*spy+spz*spz);
		costheta=(nx*spx+ny*spy+nz*spz)/(spd*nd);
		lumda=Math.abs(nd/(costheta*spd));
		if(costheta>=0.1){
			spx2=spx*lumda-2*nx;
			spy2=spy*lumda-2*ny;
			spz2=spz*lumda-2*nz;
		}else if(costheta<=-0.1){
			spx2=spx*lumda+2*nx;
			spy2=spy*lumda+2*ny;
			spz2=spz*lumda+2*nz;
		}else{
			lumda=1;
			spx2=spx;
			spy2=spy;
			spz2=spz;
		}
		cosphi=-spy2/(spd*lumda);
		cosphi=Math.pow(cosphi,this.ns);
		if(costheta<=0){
			costheta=-costheta;
			r=(r-this.ambientr)*costheta*hl+this.ambientr;
			g=(g-this.ambientg)*costheta*hl+this.ambientg;
			b=(b-this.ambientb)*costheta*hl+this.ambientb;
		}else{
			//costheta=-costheta;
			r=(r-this.ambientr)*costheta*rl+this.ambientr;
			g=(g-this.ambientg)*costheta*rl+this.ambientg;
			b=(b-this.ambientb)*costheta*rl+this.ambientb;
		}
		if(cosphi>=0){
			//r+=(255-r)*cosphi*ks;
			//g+=(255-g)*cosphi*ks;
			//b+=(255-b)*cosphi*ks;
			r+=127*this.ks*cosphi;
			g+=127*this.ks*cosphi;
			b+=127*this.ks*cosphi;
		}//r=(r-ambientr)*costheta*1.5+ambientr;
		//g=(g-ambientg)*costheta*1.5+ambientg;
		//b=(b-ambientb)*costheta*1.5+ambientb;
		r=(r-this.ambientr)*1.5+this.ambientr;
		g=(g-this.ambientg)*1.5+this.ambientg;
		b=(b-this.ambientb)*1.5+this.ambientb;
		if(r<this.ambientr){
			r=this.ambientr;
		}
		if(g<this.ambientg){
			g=this.ambientg;
		}
		if(b<this.ambientb){
			b=this.ambientb;
		}
		if(r>255){
			r=255;
		}
		if(g>255){
			g=255;
		}
		if(b>255){
			b=255;
		}
		return(r<<16)|(g<<8)|b;
	}
	
	this.bmpdMatrix=function(matrix,bmpw,bmph,px1,py1,px2,py2,px3,py3,uvMatrix){
		//由uv矩阵和透视图上的点坐标生成
		if(uvMatrix==null){
			//matrix.identity();				
			return;
		}
		matrix.a=uvMatrix.a;
		matrix.b=uvMatrix.b;
		matrix.c=uvMatrix.c;
		matrix.d=uvMatrix.d;
		matrix.tx=uvMatrix.tx;
		matrix.ty=uvMatrix.ty;//var matrix2:Matrix=new Matrix();
		matrix2.a=(px2-px1)/bmpw;
		matrix2.b=(py2-py1)/bmpw;
		matrix2.c=(px3-px2)/bmph;
		matrix2.d=(py3-py2)/bmph;
		matrix2.tx=px1;
		matrix2.ty=py1;
		matrix.concat(matrix2);
		//matrix2.invertFrom(matrix);
	}
	
	this.gradientInfo=function(x1,y1,x2,y2,x3,y3,c1,c2,c3,highSmooth){
		if(arguments.length<10)highSmooth=false;
		//生成渐变填充有关的颜色数组、位置数组和变形矩阵
		var s=0.5*Math.abs((x2-x1)*(y3-y1)-(x3-x1)*(y2-y1));
		if(s<0.1){
			var rAverage=parseInt(((c1>>16&0xff)+(c2>>16&0xff)+(c3>>16&0xff))/3);
			var gAverage=parseInt(((c1>>8&0xff)+(c2>>8&0xff)+(c3>>8&0xff))/3);
			var bAverage=parseInt(((c1&0xff)+(c2&0xff)+(c3&0xff))/3);
			return toColorString(rAverage<<16|gAverage<<8|bAverage);
		}
		var z1=(c1>>16&0xff)*0.3/255+(c1>>8&0xff)*0.6/255+(c1&0xff)*0.1/255;
		var z2=(c2>>16&0xff)*0.3/255+(c2>>8&0xff)*0.6/255+(c2&0xff)*0.1/255;
		var z3=(c3>>16&0xff)*0.3/255+(c3>>8&0xff)*0.6/255+(c3&0xff)*0.1/255;
		var xmin,xmid,xmax,ymin,ymid,ymax,zmin,zmid,zmax,cmin,cmid,cmax;
		if(z1<=z2&&z2<=z3){
			xmin=x1;
			xmid=x2;
			xmax=x3;
			ymin=y1;
			ymid=y2;
			ymax=y3;
			zmin=z1;
			zmid=z2;
			zmax=z3;			
			cmin=c1;
			cmid=c2;
			cmax=c3;
		}else if(z1<=z3&&z3<=z2){
			xmin=x1;
			xmid=x3;
			xmax=x2;
			ymin=y1;
			ymid=y3;
			ymax=y2;
			zmin=z1;
			zmid=z3;
			zmax=z2;
			cmin=c1;
			cmid=c3;
			cmax=c2;
		}else if(z2<=z1&&z1<=z3){
			xmin=x2;
			xmid=x1;
			xmax=x3;
			ymin=y2;
			ymid=y1;
			ymax=y3;
			zmin=z2;
			zmid=z1;
			zmax=z3;
			cmin=c2;
			cmid=c1;
			cmax=c3;
		}else if(z2<=z3&&z3<=z1){
			xmin=x2;
			xmid=x3;
			xmax=x1;
			ymin=y2;
			ymid=y3;
			ymax=y1;
			zmin=z2;
			zmid=z3;
			zmax=z1;
			cmin=c2;
			cmid=c3;
			cmax=c1;
		}else if(z3<=z1&&z1<=z2){
			xmin=x3;
			xmid=x1;
			xmax=x2;
			ymin=y3;
			ymid=y1;
			ymax=y2;
			zmin=z3;
			zmid=z1;
			zmax=z2;
			cmin=c3;
			cmid=c1;
			cmax=c2;
		}else{
			// if(z3<=z2 && z2<=z1){
			xmin=x3;
			xmid=x2;
			xmax=x1;
			ymin=y3;
			ymid=y2;
			ymax=y1;
			zmin=z3;
			zmid=z2;
			zmax=z1;
			cmin=c3;
			cmid=c2;
			cmax=c1;
		}
		
		/*if(arrpos!=null){
			arrpos[0]=0;
			arrpos[1]=255*(zmid-zmin)/(zmax-zmin);
			arrpos[2]=255;
		}*/
		
		var ratez=(zmid-zmin)/(zmax-zmin);
		var xab=xmax-xmin;
		var yab=ymax-ymin;
		var xpc=xmid-xab*ratez-xmin;
		var ypc=ymid-yab*ratez-ymin;
		var lumda=-(xab*xpc+yab*ypc)/(xpc*xpc+ypc*ypc);
		var dx=xab+lumda*xpc;
		var dy=yab+lumda*ypc;
		if(!isFinite(dx) || !isFinite(dy) || isNaN(dx) || isNaN(dy)){
			var rAverage1=parseInt(((c1>>16&0xff)+(c2>>16&0xff)+(c3>>16&0xff))/3);
			var gAverage1=parseInt(((c1>>8&0xff)+(c2>>8&0xff)+(c3>>8&0xff))/3);
			var bAverage1=parseInt(((c1&0xff)+(c2&0xff)+(c3&0xff))/3);
			return toColorString(rAverage1<<16|gAverage1<<8|bAverage1);
		}
		var gd=this.graphics.createLinearGradient(xmin,ymin,xmin+dx,ymin+dy);
		if(!highSmooth || ratez<0 || ratez>1){
			gd.addColorStop(0,toColorString(cmin));
			gd.addColorStop(1,toColorString(cmax));
		}else{
			gd.addColorStop(0,toColorString(cmin));
			gd.addColorStop(ratez,toColorString(cmid));
			gd.addColorStop(1,toColorString(cmax));
		}
		return gd;
	}
	
	this.split=function(angle0){
		if(arguments.length<1)angle0=45;
		var point=this.point;
		var coord=this.coord;
		var uv=this.uv;
		var coord2=this.coord2;
		if(coordn.length<=0){
			this.createN();
		}
		var i;
		var j;
		var k;
		var l;
		var m;
		var n;
		var leng=point.length;
		var leng2=coord.length;
		var cos0=Math.cos(angle0*Math.PI/180);
		var cost;
		var pointci=new Array(leng);//点所在平面数组
		var pointcj=new Array(leng);//点所在平面的点序号数组
		var jksign;//某个点的连续的平面组的编组序号
		var ordered=false;//数组已排好序
		var temp;
		for(i=0;i<leng;i++){
			pointci[i]=new Array();
			pointcj[i]=new Array();
		}
		for(i=0;i<leng2;i++){
			pointci[coord[i][0]].push(i);
			pointcj[coord[i][0]].push(0);
			pointci[coord[i][1]].push(i);
			pointcj[coord[i][1]].push(1);
			pointci[coord[i][2]].push(i);
			pointcj[coord[i][2]].push(2);
			if(coord[i][3]>=0){
				pointci[coord[i][3]].push(i);
				pointcj[coord[i][3]].push(3);
			}
		}
		l=leng-1;
		for(i=0;i<leng;i++){
			jksign=new Array(pointci[i].length);
			for(j=0;j<jksign.length;j++){
				jksign[j]=j;
			}
			for(j=0;j<jksign.length;j++){
				for(k=j+1;k<jksign.length;k++){
					if(jksign[k]==jksign[j]){
						continue;
					}
					m=pointci[i][j];
					n=pointci[i][k];
					cost=coordn[m][0]*coordn[n][0]+coordn[m][1]*coordn[n][1]+coordn[m][2]*coordn[n][2];
					if(cost>cos0){
						jksign[k]=jksign[j];
					}
				}
			}
			for(j=0;j<jksign.length;j++){
				ordered=true;
				for(k=1;k<jksign.length-j;k++){
					if(jksign[j]>jksign[k]){
						temp=jksign[k];
						jksign[k]=jksign[j];
						jksign[j]=temp;
						temp=pointci[i][k];
						pointci[i][k]=pointci[i][j];
						pointci[i][j]=temp;
						temp=pointcj[i][k];
						pointcj[i][k]=pointcj[i][j];
						pointcj[i][j]=temp;
						ordered=false;
					}
				}
				if(ordered){
					break;
				}
			}
			k=jksign[0];
			for(j=0;j<jksign.length;j++){
				if(k==jksign[j]){
					if(k!=jksign[0]){
						coord[pointci[i][j]][pointcj[i][j]]=l;
					}
					continue;
				}
				k=jksign[j];
				point.push([point[i][0],point[i][1],point[i][2]]);
				if(uv.length>0&&coord2.length<=0){
					uv.push([uv[i][0],uv[i][1]]);
				}
				l++;
				coord[pointci[i][j]][pointcj[i][j]]=l;
			}
		}
		this.createN();
		if(this.bmpd!=null){
			this.createUVMatrix();
		}
	}
	
	function set_bitmap0(src0){
		//改变贴图
		if(src0==null || src0==""){
			this.bmpd=null;
			this.pattern=null;
		}
		if(this.get_bitmap==null || this.get_bitmap()==src0){
			return;
		}
		var bmd=document.createElement("img");
		
		var model=this;
		bmd.onload=function(){
			if(!bmd.complete){
				return;
			}
			model.pattern=model.rootModel.graphics.createPattern(bmd,model.patternType);
			model.bmpd=bmd;
			model.createUVMatrix();
			if(model.onloadBitmapComplete){
				model.onloadBitmapComplete();
			}
			bmd=null;
		}
		bmd.onerror=function(){
			if(model.onloadBitmapError){
				model.onloadBitmapError();
			}
			bmd=null;
		}
		bmd.src=src0;
	};
	
	
	function get_bitmap0(){
		return this.bmpd?this.bmpd.src:null;
	}
	
	this.set_sight=function(sight0){
		if(sight0>180){
			sight0=180;
		}
		if(sight0<0){
			sight0=0;
		}
		tanS=Math.tan(sight0/2*Math.PI/180);//视角的一半的正切值
		this.sy=this.wid/(2*tanS);//站点与画面的距离
		var i;
		var leng;
		if(this.child!=null){
			leng=this.child.length;
			for(i=0;i<leng;i++){
				this.child[i].sight=sight0;
			}
		}
		if(this.comrade!=null){
			leng=this.comrade.length;
			for(i=0;i<leng;i++){
				if(this.comrade[i] instanceof  Viewer3d){
					this.comrade[i].sight=sight0;
				}
			}
		}
	}
	
	this.get_sight=function(){
		return Math.atan(tanS)*2*180/Math.PI;
	}
	
	this.get_path=function(){
		var arr=new Array();
		var model=this;
		while(model.parentModel!=model||model.uncomradeModel.parentModel!=model){
			if(model.parentModel!=model){
				model=model.parentModel;
				arr.push(model);
			}else{
				model=model.uncomradeModel.parentModel;
				arr.push(model);
			}
		}
		return(arr.reverse());
	}
	
	this.get_renderedPath=function(){
		var arr=new Array();
		var model=this;
		while(model.parentModel!=model){
			model=model.parentModel;
			arr.push(model);
		}
		return(arr.reverse());
	}
	
	this.getLocalInfo=function(model){
		if(arguments.length<1)model=null;
		return[this.tx,this.ty,this.tz,this.rx,this.ry,this.rz,this.scaleShape];
	}
}
