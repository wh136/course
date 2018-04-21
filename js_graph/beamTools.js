// plot z=f(x,y) into discrete   x=i  y=j   i=0~15 j=-1~1
function sigmaXFormula(x, y, FN, FS, M) {
    var H = 2;
    var val = ((-FN / H) - ((12 * M * y) / (H * H * H)) - (12 * FS * x * y) / (H * H * H));
    var val_fine = Math.round(val);
    return val_fine.toString();
}

function addLine(item) {
    if (item.length < 5) {
        var round = (5 - (item.length));
        for (var i = 0; i < round; i++) {
            item = item + '_';
        }
    } else {
        item = item + '_';
    }

    return item;
}

function sigmaX(FN, FS, M) {
    var arr = new Array();     //5*16
    var finalArr = new Array(5);
    for (var i = 0; i < 5; i++) {
        arr[i] = new Array();
        for (var j = 0; j < 16; j++) {
            var column = (i / 2) - 1;
            var item = sigmaXFormula(j, column, FN, FS, M);
            arr[i][j] = addLine(item);
        }
    }
    for (var i = 0; i < 5; i++) {
        finalArr[i] = '';
    }
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 16; j++) {
            finalArr[i] += arr[i][j];
        }
    }
    return finalArr;
}


//plot blue line  (y=kx+b) require k & b
function arrayInit(row, column) {
    var arr = new Array();
    for (var i = 0; i < row; i++) {
        arr[i] = new Array();
        for (var j = 0; j < column; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

function sigmaXNum(x, y, FN, FS, M) {
    var H = 2;
    var val = ((-FN / H) - ((12 * M * y) / (H * H * H)) - (12 * FS * x * y) / (H * H * H));
    return val;
}

function getBuleArray(FN, FS, M) {
    var arr = arrayInit(4, 5);
    var X = 0;
    for (var i = 0; i < 4; i++) {
        X += 3;
        for (var j = 0; j < 5; j++) {
            var Y = (j / 2) - 1;
            var val = sigmaXNum(X, Y, FN, FS, M);
            arr[i][j] = val;
        }
    }
    return arr;     // 4*5
}


function absMaxMin(FN, FS, M) {
    var coeArray = getBuleArray(FN, FS, M);
    var a11 = Math.abs(coeArray[0][0]);
    var a12 = Math.abs(coeArray[0][1]);
    var MAX = 0;
    var MIN = 0;
    if (a11 > a12) {
        MAX = a11;
        MIN = a12;
    } else {
        MAX = a12;
        MIN = a11;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 5; j++) {
            if ((Math.abs(coeArray[i][j])) >= MAX) {
                MAX = Math.abs(coeArray[i][j]);
            } else if ((Math.abs(coeArray[i][j])) < MIN) {
                MIN = Math.abs(coeArray[i][j]);
            }
        }
    }
    var arr2 = arrayInit(4, 5);
    if (MAX != 0) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                arr2[i][j] = coeArray[i][j] / MAX;
            }
        }
    } else {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                arr2[i][j] = 0;
            }
        }
    }
    return arr2;   //4*5
}


function getPointArray(arr2) {
    var points = arrayInit(4, 16);  // x0 y0 x1 y1 x2 y2....
    var P = 0;
    var T = 3;
    for (var i = 0; i < 4; i++) {
        points[0][4 * i] = (1 + T + arr2[0][i]); //x0
        points[0][4 * i + 1] = (1 + P);          //y0
        points[0][4 * i + 2] = (1 + T + arr2[0][i + 1]); //x1
        points[0][4 * i + 3] = (2 + P);              //y1
        P = P + 1;
    }
    P = 0;
    T = 6;
    for (var i = 0; i < 4; i++) {
        points[1][4 * i] = (1 + T + arr2[1][i]); //x0
        points[1][4 * i + 1] = (1 + P);          //y0
        points[1][4 * i + 2] = (1 + T + arr2[1][i + 1]); //x1
        points[1][4 * i + 3] = (2 + P);              //y1
        P = P + 1;
    }
    P = 0;
    T = 9;
    for (var i = 0; i < 4; i++) {
        points[2][4 * i] = (1 + T + arr2[2][i]); //x0
        points[2][4 * i + 1] = (1 + P);          //y0
        points[2][4 * i + 2] = (1 + T + arr2[2][i + 1]); //x1
        points[2][4 * i + 3] = (2 + P);              //y1
        P = P + 1;
    }
    P = 0;
    T = 12;
    for (var i = 0; i < 4; i++) {
        points[3][4 * i] = (1 + T + arr2[3][i]); //x0
        points[3][4 * i + 1] = (1 + P);          //y0
        points[3][4 * i + 2] = (1 + T + arr2[3][i + 1]); //x1
        points[3][4 * i + 3] = (2 + P);              //y1
        P = P + 1;
    }

    return axisTransfer(points);
}


function getCoef(FN, FS, M) {
    var arr2 = absMaxMin(FN, FS, M);
    var points = getPointArray(arr2);  //4*16
    var coefArray = arrayInit(4, 8);   // k1,k2,k3,k4,b1,b2,b3,b4  (16 lines plot)
    // y=kx+b
    // calculate k store into coefArray 4*8
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if ((points[i][4 * j] - points[i][4 * j + 2]) != 0) {
                coefArray[i][j] = (points[i][1 + 4 * j] - points[i][3 + 4 * j]) / (points[i][4 * j] - points[i][2 + 4 * j]);
            } else {
                coefArray[i][j] = 0;
            }
        }
    }
    //calculate b  b=y-k*x
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            coefArray[i][j + 4] = points[i][1 + 4 * j] - coefArray[i][j] * points[i][4 * j];
        }
    }
    return coefArray;      //4*8
}


function array2String(arr) {
    var temp = arrayInit(arr.length, arr[0].length);
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            temp[i][j] = arr[i][j].toString();  // shadow copy.   deep copy need recursion.
        }
    }
    return temp;
}

function getblueLineFn(FN, FS, M) {
    var coefArray = getCoef(FN, FS, M); //4*8
    var formula = arrayInit(4, 4);
    coefArray = array2String(coefArray);
    formula = array2String(formula);
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            formula[i][j] = coefArray[i][j] + 'x' + '+' + coefArray[i][j + 4];
        }
    }
    // formula[][] is 4*4 array. every element contains a formula.
    return formula;
}


function getFnObj(arr_Formula, arr_Point, str_color) {
    var fnObjArray = new Array((arr_Formula.length) * (arr_Formula[0].length));
    for (var i = 0; i < fnObjArray.length; i++) {
        fnObjArray[i] = new Object();
    }
    // every element of array is a obj. {fn: 'ax+b', range: [x0,x1], color: 'blue'}
    // arr_Formula
    for (var i = 0; i < arr_Formula.length; i++) {
        for (var j = 0; j < arr_Formula[0].length; j++) {
            var x0 = 0;
            var x1 = 0;
            x0 = arr_Point[i][2 + 4 * j];
            x1 = arr_Point[i][4 * j];
            (fnObjArray[4 * i + j]).range = [x0, x1];
            (fnObjArray[4 * i + j]).fn = arr_Formula[i][j];
            (fnObjArray[4 * i + j]).color = str_color;

        }
    }
    return fnObjArray; //1*16
}

function axisTransfer(arr) {   // x~x-1 y~y-2  y~-y
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < ((arr[0].length) / 2); j++) {
            arr[i][2 * j] = arr[i][2 * j] - 1.000;
            arr[i][2 * j + 1] = arr[i][2 * j + 1] - 3.000;
            arr[i][2 * j + 1] = (-1) * arr[i][2 * j + 1];
        }
    }
    return arr;
}


// plot 2 green Lines
function getGreenArray(FN, FS, M) {
    var a2 = arrayInit(2, 16);
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 16; j++) {
            a2[i][j] = sigmaXNum(j, i - 0.5, FN, FS, M);
        }
    }

    var MAX = 0;
    var MIN = 0;
    if (Math.abs(a2[0][0]) > Math.abs(a2[0][1])) {
        MAX = Math.abs(a2[0][0]);
        MIN = Math.abs(a2[0][1]);
    } else {
        MAX = Math.abs(a2[0][1]);
        MIN = Math.abs(a2[0][0]);
    }

    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 16; j++) {
            if (Math.abs(a2[i][j]) > MAX) {
                MAX = Math.abs(a2[i][j]);
            } else if (Math.abs(a2[i][j]) < MIN) {
                MIN = Math.abs(a2[i][j]);
            }
        }
    }

    if (MAX != 0) {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 16; j++) {
                a2[i][j] = a2[i][j] / MAX;
            }
        }
    } else {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 16; j++) {
                a2[i][j] = 0;
            }
        }
    }
    return a2;   //2*16
}

// 15+15 lines 30+30 points 60+60 size

function getGreenPoints(a2) {
    var points = arrayInit(2, 60);
    var p = 1;
    for (var j = 0; j < 15; j++) {
        points[0][4 * j] = (1 + j);
        points[0][4 * j + 1] = (1 + p + a2[0][j]);
        points[0][4 * j + 2] = (1 + j + 1);
        points[0][4 * j + 3] = (1 + p + a2[0][j + 1]);
    }
    p = 1 + 2;
    for (var j = 0; j < 15; j++) {
        points[1][4 * j] = (1 + j);
        points[1][4 * j + 1] = (1 + p + a2[1][j]);
        points[1][4 * j + 2] = (1 + j + 1);
        points[1][4 * j + 3] = (1 + p + a2[1][j + 1]);
    }
    return axisTransfer(points);    //2*60
}

//15+15 lines
function getGreenCoef(points) {
    var coefArray = arrayInit(2, 30);   // k1,k2,k3,k4,b1,b2,b3,b4
    // y=kx+b
    // calculate k store into coefArray 2*30
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 15; j++) {
            if ((points[i][4 * j] - points[i][4 * j + 2]) != 0) {
                coefArray[i][j] = (points[i][1 + 4 * j] - points[i][3 + 4 * j]) / (points[i][4 * j] - points[i][2 + 4 * j]);
            } else {
                coefArray[i][j] = 0;
            }
        }
    }
    //calculate b  b=y-k*x
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 15; j++) {
            coefArray[i][j + 15] = points[i][1 + 4 * j] - coefArray[i][j] * points[i][4 * j];
        }
    }
    return coefArray;      //2*30
}

function getGreenFn(coefArray) {
    var formula = arrayInit(2, 15);
    coefArray = array2String(coefArray);
    formula = array2String(formula);
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 15; j++) {
            formula[i][j] = coefArray[i][j] + 'x' + '+' + coefArray[i][j + 15];
        }
    }
    // formula[][] is 2*15 array. every element contains a formula.
    return formula;
}

// var greenArr =getGreenArray(10,10,10);
// var greePoints=getGreenPoints(greenArr);
// var coefArr=getGreenCoef(greePoints);
// var formula=getGreenFn(coefArr);
// var obj=getGreenObjfn(formula,greePoints,'red');

// Because of the function-plot can't plot too much of function. Now getGreenObjfn() was abandon for temporary.
function getGreenObjfn(arr_Formula, arr_Point, str_color) {
    var fnObjArray = new Array((arr_Formula.length) * (arr_Formula[0].length));
    for (var i = 0; i < fnObjArray.length; i++) {
        fnObjArray[i] = new Object();
    }
    // every element of array is a obj. {fn: 'ax+b', range: [x0,x1], color: 'blue'}
    // arr_Formula
    for (var i = 0; i < arr_Formula.length; i++) {
        for (var j = 0; j < arr_Formula[0].length; j++) {
            var x0 = 0;
            var x1 = 0;
            x0 = arr_Point[i][4 * j];
            x1 = arr_Point[i][2 + 4 * j];
            (fnObjArray[4 * i + j]).range = [x0, x1];
            (fnObjArray[4 * i + j]).fn = arr_Formula[i][j];
            (fnObjArray[4 * i + j]).color = str_color;
        }
    }
    return fnObjArray; //1*30
}

// function genStrGreenFn() {
//     str='';
//     for(var i=0;i<30;i++){
//         str+='greenFn['+i.toString()+']'+',';
//     }
//     return str;
// }
// var gre=genStrGreenFn();



// print tao XY f(x,y)
function taoXYFormula(y,FS) {
    var H = 2;
    var val = (-3 * FS )/ (2 * H) * (1 - ((4 * y * y) / (H * H)));
    var val_fine = Math.round(val);
    return val_fine.toString();
}

function taoXY(FS) {
    var arr = new Array();     //5*16
    var finalArr = new Array(5);
    for (var i = 0; i < 5; i++) {
        arr[i] = new Array();
        for (var j = 0; j < 16; j++) {
            var column = (i / 2) - 1;
            var item = taoXYFormula(column, FS);
            arr[i][j] = addLine(item);
        }
    }
    for (var i = 0; i < 5; i++) {
        finalArr[i] = '';
    }
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 16; j++) {
            finalArr[i] += arr[i][j];
        }
    }
    return finalArr;
}


// plot tao XY
function taoXYNum(y, FS) {
    var H = 2;
    var val = (-3 * FS )/ (2 * H) * (1 - ((4 * y * y) / (H * H)));
    return val;
}

function getBlueArray_taoXY(FS) {
    var arr = arrayInit(4, 5);
    var X = 0;
    for (var i = 0; i < 4; i++) {
        X += 3;
        for (var j = 0; j < 5; j++) {
            var Y = (j / 2) - 1;
            var val = taoXYNum(Y, FS);
            arr[i][j] = val;
        }
    }

    var coeArray = arr;
    var a11 = Math.abs(coeArray[0][0]);
    var a12 = Math.abs(coeArray[0][1]);
    var MAX = 0;
    var MIN = 0;
    if (a11 > a12) {
        MAX = a11;
        MIN = a12;
    } else {
        MAX = a12;
        MIN = a11;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 5; j++) {
            if ((Math.abs(coeArray[i][j])) >= MAX) {
                MAX = Math.abs(coeArray[i][j]);
            } else if ((Math.abs(coeArray[i][j])) < MIN) {
                MIN = Math.abs(coeArray[i][j]);
            }
        }
    }
    var arr2 = arrayInit(4, 5);
    if (MAX != 0) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                arr2[i][j] = coeArray[i][j] / MAX;
            }
        }
    } else {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                arr2[i][j] = 0;
            }
        }
    }
    return arr2;
}


function getBluePoints_taoXY(arr2) {
    var points = arrayInit(4, 16);  // x0 y0 x1 y1 x2 y2....
    var P = 0;
    var T = 3;
    for (var i = 0; i < 4; i++) {
        points[0][4 * i] = (1 + T + arr2[0][i]); //x0
        points[0][4 * i + 1] = (1 + P);          //y0
        points[0][4 * i + 2] = (1 + T + arr2[0][i + 1]); //x1
        points[0][4 * i + 3] = (2 + P);              //y1
        P = P + 1;
    }
    P = 0;
    T = 6;
    for (var i = 0; i < 4; i++) {
        points[1][4 * i] = (1 + T + arr2[1][i]); //x0
        points[1][4 * i + 1] = (1 + P);          //y0
        points[1][4 * i + 2] = (1 + T + arr2[1][i + 1]); //x1
        points[1][4 * i + 3] = (2 + P);              //y1
        P = P + 1;
    }
    P = 0;
    T = 9;
    for (var i = 0; i < 4; i++) {
        points[2][4 * i] = (1 + T + arr2[2][i]); //x0
        points[2][4 * i + 1] = (1 + P);          //y0
        points[2][4 * i + 2] = (1 + T + arr2[2][i + 1]); //x1
        points[2][4 * i + 3] = (2 + P);              //y1
        P = P + 1;
    }
    P = 0;
    T = 12;
    for (var i = 0; i < 4; i++) {
        points[3][4 * i] = (1 + T + arr2[3][i]); //x0
        points[3][4 * i + 1] = (1 + P);          //y0
        points[3][4 * i + 2] = (1 + T + arr2[3][i + 1]); //x1
        points[3][4 * i + 3] = (2 + P);              //y1
        P = P + 1;
    }

    return axisTransfer(points);
}

function getBlueCoef_taoXY(points) {
    var coefArray = arrayInit(4, 4);   // k1,k2,k3,k4,b1,b2,b3,b4
    // y=kx+b
    // calculate k store into coefArray 2*30
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if ((points[i][4 * j] - points[i][4 * j + 2]) != 0) {
                coefArray[i][j] = (points[i][1 + 4 * j] - points[i][3 + 4 * j]) / (points[i][4 * j] - points[i][2 + 4 * j]);
            } else {
                coefArray[i][j] = 0;
            }
        }
    }
    //calculate b  b=y-k*x
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            coefArray[i][j + 4] = points[i][1 + 4 * j] - coefArray[i][j] * points[i][4 * j];
        }
    }
    return coefArray;      //2*30
}

function getBlueFn_taoXY(coefArray) {
    var formula = arrayInit(4, 4);
    coefArray = array2String(coefArray);
    formula = array2String(formula);
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            formula[i][j] = coefArray[i][j] + 'x' + '+' + coefArray[i][j+4];
        }
    }
    // formula[][] is 2*15 array. every element contains a formula.
    return formula;
}

// var blueArr = getBlueArray_taoXY(10);
// var Points_blue = getBluePoints_taoXY(blueArr);
// var coefArr_blue = getBlueCoef_taoXY(Points_blue);
// var formula_blue_taoXY = getBlueFn_taoXY(coefArr_blue);
// var taoXY_green = getGreenObjfn_taoXY(formula_blue_taoXY,Points_blue,'blue');


function getBlueObjfn_taoXY(arr_Formula, arr_Point, str_color) {
    var fnObjArray = new Array((arr_Formula.length) * (arr_Formula[0].length));
    for (var i = 0; i < fnObjArray.length; i++) {
        fnObjArray[i] = new Object();
    }
    // every element of array is a obj. {fn: 'ax+b', range: [x0,x1], color: 'blue'}
    // arr_Formula
    for (var i = 0; i < arr_Formula.length; i++) {
        for (var j = 0; j < arr_Formula[0].length; j++) {
            var x0 = 0;
            var x1 = 0;
            x0 = arr_Point[i][4 * j];
            x1 = arr_Point[i][2 + 4 * j];
            if(x0<x1){
                (fnObjArray[4 * i + j]).range = [x0, x1];
            }else {
                (fnObjArray[4 * i + j]).range = [x1, x0];
            }
            (fnObjArray[4 * i + j]).fn = arr_Formula[i][j];
            (fnObjArray[4 * i + j]).color = str_color;
        }
    }
    return fnObjArray; //1*30
}



// plot  2 green Lines using taoXY functions

function getGreenArray_taoXY(FS) {
    var a2 = arrayInit(2, 16);
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 16; j++) {
            a2[i][j] = taoXYNum(i - 0.5, FS);
        }
    }

    var MAX = 0;
    var MIN = 0;
    if (Math.abs(a2[0][0]) > Math.abs(a2[0][1])) {
        MAX = Math.abs(a2[0][0]);
        MIN = Math.abs(a2[0][1]);
    } else {
        MAX = Math.abs(a2[0][1]);
        MIN = Math.abs(a2[0][0]);
    }

    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 16; j++) {
            if (Math.abs(a2[i][j]) > MAX) {
                MAX = Math.abs(a2[i][j]);
            } else if (Math.abs(a2[i][j]) < MIN) {
                MIN = Math.abs(a2[i][j]);
            }
        }
    }

    if (MAX != 0) {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 16; j++) {
                a2[i][j] = a2[i][j] / MAX;
            }
        }
    } else {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 16; j++) {
                a2[i][j] = 0;
            }
        }
    }
    return a2;   //2*16
}

// 15+15 lines 30+30 points 60+60 size

function getGreenPoints_taoXY(a2) {
    var points = arrayInit(2, 60);
    var p = 1;
    for (var j = 0; j < 15; j++) {
        points[0][4 * j] = (1 + j);
        points[0][4 * j + 1] = (1 + p + a2[0][j]);
        points[0][4 * j + 2] = (1 + j + 1);
        points[0][4 * j + 3] = (1 + p + a2[0][j + 1]);
    }
    p = 1 + 2;
    for (var j = 0; j < 15; j++) {
        points[1][4 * j] = (1 + j);
        points[1][4 * j + 1] = (1 + p + a2[1][j]);
        points[1][4 * j + 2] = (1 + j + 1);
        points[1][4 * j + 3] = (1 + p + a2[1][j + 1]);
    }
    return axisTransfer_taoXY(points);    //2*60
}




function axisTransfer_taoXY(arr) {   // x~x-1 y~y-2  y~-y
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < ((arr[0].length) / 2); j++) {
            arr[i][2 * j] = arr[i][2 * j] - 1.000;
            arr[i][2 * j + 1] = arr[i][2 * j + 1] - 2.000;
            arr[i][2 * j + 1] = (-1) * arr[i][2 * j + 1];
        }
    }
    return arr;
}



//15+15 lines
function getGreenCoef_taoXY(points) {
    var coefArray = arrayInit(2, 30);   // k1,k2,k3,k4,b1,b2,b3,b4
    // y=kx+b
    // calculate k store into coefArray 2*30
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 15; j++) {
            if ((points[i][4 * j] - points[i][4 * j + 2]) != 0) {
                coefArray[i][j] = (points[i][1 + 4 * j] - points[i][3 + 4 * j]) / (points[i][4 * j] - points[i][2 + 4 * j]);
            } else {
                coefArray[i][j] = 0;
            }
        }
    }
    //calculate b  b=y-k*x
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 15; j++) {
            coefArray[i][j + 15] = points[i][1 + 4 * j] - coefArray[i][j] * points[i][4 * j];
        }
    }
    return coefArray;      //2*30
}

function getGreenFn_taoXY(coefArray) {
    var formula = arrayInit(2, 15);
    coefArray = array2String(coefArray);
    formula = array2String(formula);
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 15; j++) {
            formula[i][j] = coefArray[i][j] + 'x' + '+' + coefArray[i][j + 15];
        }
    }
    // formula[][] is 2*15 array. every element contains a formula.
    return formula;
}
