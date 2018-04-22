
var mouseX=0,mouseY=0;
function presetStyles(obj){
	if(obj.style.opacity==null)obj.style.opacity=1;
}

function addChild(obj,parent){
	//注：在应用了timeline.js后，需要在事先指定style.zIndex属性，
	//内建的zIndex值在[1,图层总数]之间，若有多个场景，
	//则这里的图层总数为各场景的图层数之和。
	obj.style.position="absolute";
	presetStyles(obj);
	parent.appendChild(obj);
}

function addChildOnce(obj,parent){
	obj.style.position="absolute";
	var arr=parent.children;
	var length=arr.length;
	for(i=0;i<length;i++){
		if(arr[i]==obj){
			break;
		}
	}
	presetStyles(obj);
	if(i>=length){
		parent.appendChild(obj);
	}
}

function addChildAt(obj,parent,n){
	presetStyles(obj);
	if(n>=parent.childNodes.length){
		obj.style.position="absolute";
		parent.appendChild(column);
	}else if(n>=0){
		obj.style.position="absolute";
		parent.insertBefore(parent.childNodes[n]);
	}
}

function removeChild(obj,parent){
	if(arguments.length<=1)parent=obj.parentNode;
	if(parent){
		parent.removeChild(obj);
	}
}

function removeChildIfContains(obj,parent){
	if(arguments.length<=1)parent=obj.parentNode;
	if(parent==null){
		return;
	}
	var arr=parent.children;
	var length=arr.length;
	for(i=0;i<length;i++){
		if(arr[i]==obj){
			break;
		}
	}
	if(i<length){
		parent.removeChild(obj);
	}
}

function drawEllipse(context,x0,y0,width0,height0,segCount,powerCount){
	if(arguments.length<6)segCount=4;
	if(arguments.length<7)powerCount=3;
	
	if(context==null){
		return;
	}
	
	var theta,rate;
	var t,sint,cost,sintprev,costprev;
	var px,py,pxprev,pyprev;
	var i;
	
	theta=2*Math.PI/segCount;	
	if(powerCount==1){
		rate=1;
	}else if(powerCount==2){
		rate=Math.tan(theta*0.5);
	}else if(powerCount==3){
		rate=Math.tan(theta*0.25)/0.75;
	}
	
	t=theta;
	costprev=1.0;
	sintprev=0.0;
	pxprev=x0+width0;
	pyprev=y0+0.5*height0;
	context.moveTo(pxprev,pyprev);
	for(i=0;i<segCount;i++){
		cost=Math.cos(t);
		sint=Math.sin(t);
		px=x0+0.5*width0*(1+cost);
		py=y0+0.5*height0*(1+sint);
		if(powerCount==1){
			context.lineTo(px,py);
		}else if(powerCount==2){
			context.quadraticCurveTo(pxprev-0.5*width0*rate*sintprev,pyprev+0.5*height0*rate*costprev,px,py);
		}else if(powerCount==3){
			context.bezierCurveTo(pxprev-0.5*width0*rate*sintprev,pyprev+0.5*height0*rate*costprev,px+0.5*width0*rate*sint,py-0.5*height0*rate*cost,px,py);
		}
		t=i+2<segCount?t+theta:0;
		costprev=cost;
		sintprev=sint;
		pxprev=px;
		pyprev=py;
	}
}

function clearCanvas(canvas,context){
	if(arguments.length==1)context=canvas.getContext("2d");
	context.clearRect(0,0,parseInt(canvas.width),parseInt(canvas.height));
}

function toColorString(color){
	var str=color.toString(16);
	var l0=str.length;
	switch(l0){
		case 6:str="#"+str;break;
		case 5:str="#0"+str;break;
		case 4:str="#00"+str;break;
		case 3:str="#000"+str;break;
		case 2:str="#0000"+str;break;
		case 1:str="#00000"+str;break;
	}
	return str;
}

function updateMouseXY(event){
	if(event && event.targetTouches && event.targetTouches.length>0){
		updateMouseXY(event.targetTouches[0]);
		return;
	}
	event=event||window.event;
	if(event.pageX || event.pageY){ 
		mouseX=event.pageX;
		mouseY=event.pageY;
		return;
	}
	mouseX=event.clientX + document.body.scrollLeft - document.body.clientLeft;
	mouseY=event.clientY + document.body.scrollTop - document.body.clientTop;	 
}

function Point(x0,y0){
	if(arguments.length<=1)y0=0;
	if(arguments.length<=0)x0=0;
	this.x=x0;
	this.y=y0;
	
	this.clone=function(){
		return new Point(this.x,this.y);
	}
	
	Point.distance=function(p1,p2){
		var dx=p2.x-p1.x;
		var dy=p2.y-p1.y;
		return Math.sqrt(dx*dx+dy*dy);
	}
}

function Rectangle(x0,y0,w0,h0){
	if(arguments.length<=3)h0=0;
	if(arguments.length<=2)w0=0;
	if(arguments.length<=1)y0=0;
	if(arguments.length<=0)x0=0;
	this.x=x0;
	this.y=y0;
	this.width=w0;
	this.height=h0;
	
	this.clone=function(){
		return new Rectangle(this.x,this.y,this.width,this.height);
	}
	
	this.contains=function(x1,y1){
		return x1>=this.x && x1<this.x+this.width && y1>=this.y && y1<this.y+this.height;
	}
	
	this.containsPoint=function(p1){
		return this.contains(p1.x,p1.y);
	}
	
	this.intersects=function(r1){
		return r1.x<this.x+this.width && this.x<r1.x+r1.width && r1.y<this.y+this.height && this.y<r1.y+r1.height;
	}
}

function Matrix(a0,b0,c0,d0,tx0,ty0){
	if(arguments.length<=5)ty0=0;
	if(arguments.length<=4)tx0=0;
	if(arguments.length<=3)d0=1;
	if(arguments.length<=2)c0=0;
	if(arguments.length<=1)b0=0;
	if(arguments.length<=0)a0=1;
	this.a=a0;
	this.b=b0;
	this.c=c0;
	this.d=d0;
	this.tx=tx0;
	this.ty=ty0;
	
	this.concat=function(m0){
		var a0=this.a*m0.a+this.b*m0.c;
		var b0=this.a*m0.b+this.b*m0.d;
		var c0=this.c*m0.a+this.d*m0.c;
		var d0=this.c*m0.b+this.d*m0.d;
		var tx0=this.tx*m0.a+this.ty*m0.c+m0.tx;
		var ty0=this.tx*m0.b+this.ty*m0.d+m0.ty;
		this.a=a0;
		this.b=b0;
		this.c=c0;
		this.d=d0;
		this.tx=tx0;
		this.ty=ty0;
	}
	
	this.clone=function(){
		return (new Matrix(this.a,this.b,this.c,this.d,this.tx,this.ty));
	}
	
	this.identity=function(){
		this.a=1;
		this.b=0;
		this.c=0;
		this.d=1;
		this.tx=0;
		this.ty=0;
	}
	
	this.invert=function(){
		var div=this.a*this.d-this.b*this.c;
		var a0=this.d/div;
		var b0=-this.b/div;
		var c0=-this.c/div;
		var d0=this.a/div;
		var tx0=-this.tx;
		var ty0=-this.ty;
		this.a=a0;
		this.b=b0;
		this.c=c0;
		this.d=d0;
		this.tx=a0*tx0+c0*ty0;
		this.ty=b0*tx0+d0*ty0;
	}
	
	this.rotate=function(angle){
		var ca=Math.cos(angle);
		var sa=Math.sin(angle);
		var mt=new Matrix(ca,sa,-sa,ca,0,0);
		this.concat(mt);
	}
	
	this.scale=function(sx,sy){
		var mt=new Matrix(sx,0,0,sy,0,0);
		this.concat(mt);
	}
	
	this.translate=function(tx0,ty0){
		this.tx+=tx0;
		this.ty+=ty0;
	}
	
	this.transformPoint=function(point){
		return new Point(point.x*this.a+point.y*this.c+this.tx,point.x*this.b+point.y*this.d+this.ty);
	}
	
	this.deltaTransformPoint=function(point){
		return new Point(point.x*this.a+point.y*this.c,point.x*this.b+point.y*this.d);
	}
}

function localToGlobal(p1,container,overrideMode){
	//暂未考虑到css3的transform
	if(arguments.length<=2)overrideMode=false;
	var p2=overrideMode?p1:p1.clone();
	var containert=container;	
	while(containert!=null && containert!=document.body){
		p2.x+=containert.offsetLeft;
		p2.y+=containert.offsetTop;
		containert=containert.offsetParent;
	}
	return p2;
}

function globalToLocal(p1,container,overrideMode){
	//暂未考虑到css3的transform
	if(arguments.length<=2)overrideMode=false;
	var p2=overrideMode?p1:p1.clone();
	var containert=container;
	while(containert!=null && containert!=document.body){
		p2.x-=containert.offsetLeft;
		p2.y-=containert.offsetTop;
		containert=containert.offsetParent;
	}
	return p2;
}

function hitTestObject(element2,element1){
	var p1=new Point(element1.offsetLeft,element1.offsetTop);
	var p2=new Point(element2.offsetLeft,element2.offsetTop);
	if(element2.parentNode!=element1.parentNode){
		localToGlobal(p1,element1.offsetParent,true);
		localToGlobal(p2,element2.offsetParent,true);
	}
	var r1=new Rectangle(p1.x,p1.y,element1.offsetWidth,element1.offsetHeight);
	var r2=new Rectangle(p2.x,p2.y,element2.offsetWidth,element2.offsetHeight);
	return r1.intersects(r2);
}

function hitTestPoint(x0,y0,element1){
	var r1=new Rectangle(element1.offsetLeft,element1.offsetTop,element1.offsetWidth,element1.offsetHeight);
	return r1.contains(x0,y0);
}

function hitTestGlobalPoint(x0,y0,element1){
	var p1=new Point(element1.offsetLeft,element1.offsetTop);
	localToGlobal(p1,element1.offsetParent,true);
	var r1=new Rectangle(p1.x,p1.y,element1.offsetWidth,element1.offsetHeight);
	return r1.containsPoint(p1);
}

function playSound(src,volume){
	var audioElement=document.createElement("audio");
	audioElement.src=src;
	if(volume!=null){
		audioElement.volume=volume;
	}
	audioElement.play();
	return audioElement;
}

function getRect(item){
	var tagName=item.tagName.toLowerCase();
	var rect=null;
	if(tagName=="img" || tagName=="canvas" || tagName=="svg"){
		rect=new Rectangle(0,0,Number(item.getAttribute("width")||item.width),Number(item.getAttribute("height")||item.height));
	}else if(item.offsetWidth!=null && item.offsetWidth!=0 && item.offsetHeight!=null && item.offsetHeight!=0){
		rect=new Rectangle(0,0,Number(item.offsetWidth),Number(item.offsetHeight));
	}
	var i;
	var matrix;
	var xmin,ymin,xmax,ymax;
	var hasRange=false;
	if(rect){
		matrix=getMatrixArray(item);
		if(matrix[1]==0 && matrix[2]==0){
			rect.width*=matrix[0];
			rect.height*=matrix[3];
			rect.x+=matrix[4];
			rect.y+=matrix[5];
			return rect;
		}else{
			var points=[rect.x,rect.y,rect.x+rect.width,rect.y,rect.x+rect.width,rect.y+rect.height,rect.x,rect.y+rect.height];
			var xt,yt;
			for(i=0;i+1<points.length;i+=2){
				xt=points[i]*matrix[0]+points[i+1]*matrix[2]+matrix[4];
				yt=points[i]*matrix[1]+points[i+1]*matrix[3]+matrix[5];
				if(!hasRange){
					xmin=xt;
					ymin=yt;
					xmax=xt;
					ymax=yt;
					hasRange=true;
				}else{
					if(xmin>xt)xmin=xt;
					if(ymin>yt)ymin=yt;
					if(xmax<xt)xmax=xt;
					if(ymax<yt)ymax=yt;
				}
			}
			return new Rectangle(xmin,ymin,xmax-xmin,ymax-ymin);
		}
	}
	
	var children=item.children;
	if(children==null){
		return null;
	}
	hasRange=false;
	var rect=null;
	for(i=0;i<children.length;i++){
		rect=getRect(children[i]);		
		
		if(rect==null){
			continue;
		}
		if(!hasRange){
			xmin=rect.x;
			ymin=rect.y;
			xmax=rect.width+rect.x;
			ymax=rect.height+rect.y;
			hasRange=true;
		}else{
			if(xmin>rect.x)xmin=rect.x;
			if(ymin>rect.y)ymin=rect.y;
			if(xmax<rect.width+rect.x)xmax=rect.width+rect.x;
			if(ymax<rect.height+rect.y)ymax=rect.height+rect.y;
		}
	}
	if(!hasRange){
		return null;
	}
	rect=new Rectangle(xmin,ymin,xmax-xmin,ymax-ymin);
	matrix=getMatrixArray(item);
	points=[rect.x,rect.y,rect.x+rect.width,rect.y,rect.x+rect.width,rect.y+rect.height,rect.x,rect.y+rect.height];
	hasRange=false;
	for(i=0;i+1<points.length;i+=2){
		xt=points[i]*matrix[0]+points[i+1]*matrix[2]+matrix[4];
		yt=points[i]*matrix[1]+points[i+1]*matrix[3]+matrix[5];
		if(!hasRange){
			xmin=xt;
			ymin=yt;
			xmax=xt;
			ymax=yt;
			hasRange=true;
		}else{
			if(xmin>xt)xmin=xt;
			if(ymin>yt)ymin=yt;
			if(xmax<xt)xmax=xt;
			if(ymax<yt)ymax=yt;
		}
	}
	return new Rectangle(xmin,ymin,xmax-xmin,ymax-ymin);
}

function initDivBounds(itemarray,offset){
	if(arguments.length==1)offset=0;
	var i;
	var rect;
	for(i=0;i<itemarray.length;i++){
		if(itemarray[i].offsetWidth!=0 && itemarray[i].offsetHeight!=0){
			continue;
		}
		rect=getRect(itemarray[i]);
		if(rect==null || rect.width==0 || rect.height==0){
			continue;
		}
		rect.width+=offset;
		rect.height+=offset;
		itemarray[i].style.width=rect.width+"px";
		itemarray[i].style.height=rect.height+"px";
		itemarray[i].width=rect.width;
		itemarray[i].height=rect.height;
		presetStyles(itemarray[i]);
	}
}

function setMatrixArray(item,matrix){
	if(matrix.length<4){
		return;
	}
	if(matrix.length>4){
		item.style.left=matrix[4];
	}
	if(matrix.length>5){
		item.style.top=matrix[5];
	}
	item.style.transform="matrix("+matrix.slice(0,4)+",0,0)";
}

function getMatrixArray(item){
	var str=item.style.transform;
	if(str==null)str="";
	var i=str.indexOf("matrix(");
	var j=i>=0?str.indexOf(")",i+7):-1;
	var matrixstr;
	var matrix;
	if(i>=0 && j>=0){
		matrixstr=str.substring(i+7,j);
		matrix=matrixstr.split(",");
		matrix.length=6;
		for(i=0;i<matrix.length;i++){
			matrix[i]=Number(matrix[i]);
		}
	}else{
		matrix=[1,0,0,1,0,0];
	}
	matrix[4]+=item.offsetLeft!=null?item.offsetLeft:0;
	matrix[5]+=item.offsetTop!=null?item.offsetTop:0;
	return matrix;
}

function setScaleXSimple(item,scaleX){
	var matrix=getMatrixArray(item).slice(0,4);
	matrix[0]=scaleX;
	setMatrixArray(item,matrix);
}

function getScaleXSimple(item){
	return getMatrixArray(item)[0];
}

function setScaleYSimple(item,scaleY){
	var matrix=getMatrixArray(item).slice(0,4);
	matrix[3]=scaleY;
	setMatrixArray(item,matrix);
}

function getScaleYSimple(item){
	return setMatrixArray(item)[3];
}

function setRotation(item,rotation){
	var matrix=getMatrixArray(item);
	var r0=Math.atan2(matrix[1],matrix[0]);
	var rt=rotation*Math.PI/180;
	var cos0=Math.cos(r0);
	var sin0=Math.sin(r0);
	var s=[matrix[0]*cos0+matrix[1]*sin0,-matrix[0]*sin0+matrix[1]*cos0,
	matrix[2]*cos0+matrix[3]*sin0,-matrix[2]*sin0+matrix[3]*cos0];
	var cost=Math.cos(rt);
	var sint=Math.sin(rt);
	setMatrixArray(item,[s[0]*cost-s[1]*sint,s[0]*sint+s[1]*cost,s[2]*cost-s[3]*sint,s[2]*sint+s[3]*cost]);
}

function getRotation(item){
	var matrix=getMatrixArray(item);
	return Math.atan2(matrix[1],matrix[0])*180/Math.PI;
}
