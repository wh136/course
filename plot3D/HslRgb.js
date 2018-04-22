//transformed the ActionScript file "HslRgb.as" from package "com.lem.tools.colorPicker.color"
var HslRgb={	
	toHex:function(n){
		var c=n.toString(16);
		switch(c.length){
			case 1:c="00000"+c;
			break;
			case 2:c="0000"+c;
			break;
			case 3:c="000"+c;
			break;
			case 4:c="00"+c;
			break;
			case 5:c="0"+c;
			break;
		}
		return c.toUpperCase();
	}
	,
	rgbToRGB:function(r,g,b){
		return Math.round(r)*256*256+Math.round(g)*256+Math.round(b);
	}
	,
	hexToRgb:function(val){
		var col=new Array(3);
		col.r=(val>>16)&0xFF;
		col.g=(val>>8)&0xFF;
		col.b=val&0xFF;
		return col;
	}//H=0~360,S=0-1,L=0-1
	,
	hslToRgb:function(H,S,L){
		var p1,p2;
		var rgb=new Array(3);
		if(L<=0.5){
			p2=L*(1+S);
		}else{
			p2=L+S-(L*S);
		}
		p1=2*L-p2;
		if(S==0){
			rgb.r=L;
			rgb.g=L;
			rgb.b=L;
		}else{
			rgb.r=this.toRgb(p1,p2,H+120);
			rgb.g=this.toRgb(p1,p2,H);
			rgb.b=this.toRgb(p1,p2,H-120);
		}
		rgb.r*=255;
		rgb.g*=255;
		rgb.b*=255;
		return rgb;
	}
	,
	toRgb:function(q1,q2,hue){
		if(hue>360){
			hue=hue-360;
		}
		if(hue<0){
			hue=hue+360;
		}
		if(hue<60){
			return(q1+(q2-q1)*hue/60);
		}else if(hue<180){
			return(q2);
		}else if(hue<240){
			return(q1+(q2-q1)*(240-hue)/60);
		}else{
			return(q1);
		}
	}
	,
	rgbToHsl:function(R,G,B){
		R/=255;
		G/=255;
		B/=255;
		var max,min,diff,r_dist,g_dist,b_dist;
		var hsl=new Array(3);
		max=Math.max(Math.max(R,G),B);
		min=Math.min(Math.min(R,G),B);
		diff=max-min;
		hsl.l=(max+min)/2;
		if(diff==0){
			hsl.h=0;
			hsl.s=0;
		}else{
			if(hsl.l<0.5){
				hsl.s=diff/(max+min);
			}else{
				hsl.s=diff/(2-max-min);
			}
			r_dist=(max-R)/diff;
			g_dist=(max-G)/diff;
			b_dist=(max-B)/diff;
			if(R==max){
				hsl.h=b_dist-g_dist;
			}else if(G==max){
				hsl.h=2+r_dist-b_dist;
			}else if(B==max){
				hsl.h=4+g_dist-r_dist;
			}
			hsl.h*=60;
			if(hsl.h<0){
				hsl.h+=360;
			}
			if(hsl.h>=360){
				hsl.h-=360;
			}
		}
		return hsl;
	}
}
