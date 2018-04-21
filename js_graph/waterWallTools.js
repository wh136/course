//Public tools start
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

function sigmaX_formula(x, y, p1, p2, b, return_type) {
    var g = 9.8;
    var result = (2 * p2 * g * x * x * x * y) / (b * b * b) + (3 * p2 * g * x * y) / (5 * b) - (4 * p2 * g * x * y * y * y) / (b * b * b) - (p1 * g * x);
    if (return_type === 'int_num') {
        return result;
    } else if (return_type === 'str_num') {
        return result.toString();
    }

}

function sigmaY_formula(x, y, p2, b, return_type) {
    var g = 9.8;
    var result = (p2 * g * x) * ((2 * y * y * y) / (b * b * b) - (3 * y) / (2 * b) - 0.5)
    if (return_type === 'int_num') {
        return result;
    } else if (return_type === 'str_num') {
        return result.toString();
    }
}

function taoXY_formula(x, y, p2, b, return_type) {
    var g = 9.8;
    var result = ((-1) * (p2 * g * x * x)) * (((3 * y * y * y) / (b * b * b)) - (3 / (4 * b)));
    if (return_type === 'int_num') {
        return result;
    } else if (return_type === 'str_num') {
        return result.toString();
    }
}

function addLine(item) {
    if (item.length < 8) {
        var round = (8 - (item.length));
        for (var i = 0; i < round; i++) {
            item = item + '_';
        }
    } else {
        item = item + '_';
    }
    return item;
}

function axisTransfer(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < (arr[0].length) / 2; j++) {
            arr[i][2 * j] = arr[i][2 * j] - 8.00;
            arr[i][2 * j + 1] = (-1) * arr[i][2 * j + 1];
        }
    }
    return arr;
}

//Public tools end

//----------------------------------------------
function SigmaXArr(p1, p2, b) {
    var sxArr = arrayInit(13, 7);
    var X = 0;
    var Y = 0;
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 13; j++) {
            X = (j * b) / 6;
            Y = (-1) * b * (i - 3) / 6;
            sxArr[j][i] = sigmaX_formula(X, Y, p1, p2, b, 'int_num');
        }
    }
    return sxArr;  //12*7
}

// var test = SigmaX(2.4,1,3);

function SigmaXStr(p1, p2, b) {
    var sxArr = SigmaXArr(p1, p2, b);
    for (var i = 0; i < 13; i++) {
        for (var j = 0; j < 7; j++) {
            sxArr[i][j] = sxArr[i][j].toFixed(2);
            sxArr[i][j] = addLine(sxArr[i][j]);
        }
    }
    var print_arr = arrayInit(13);
    for (var i = 0; i < 13; i++) {
        for (var j = 0; j < 7; j++) {
            print_arr[i] += sxArr[i][j];
        }
    }
    return print_arr;
}

// var arr=arrayInit(3,7);
//-----------------------------------------------
function sigmaX_ratioBlue(p1, p2, b) {
    var a = arrayInit(3,7);
    var X = b / 2;
    for (var i = 0; i < (a.length); i++) {
        X = (b / 2) + (b / 2) * i;
        for (var j = 0; j < (a[0].length); j++) {
            var Y = (-1) * b * (j - 3) / 6;
            var formula = sigmaX_formula(X, Y, p1, p2, b, 'int_num');
            a[i][j] = Math.abs(formula);
        }
    }
    var coeArray = a;
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
    for (var i = 0; i < (a.length); i++) {
        for (var j = 0; j < (a[0].length); j++) {
            if ((Math.abs(coeArray[i][j])) > MAX) {
                MAX = Math.abs(coeArray[i][j]);
            } else if ((Math.abs(coeArray[i][j])) < MIN) {
                MIN = Math.abs(coeArray[i][j]);
            }
        }
    }
    var arr2 = arrayInit((a.length), (a[0].length));
    if (MAX !== 0) {
        for (var i = 0; i < (a.length); i++) {
            for (var j = 0; j < (a[0].length); j++) {
                arr2[i][j] = coeArray[i][j] / MAX;
            }
        }
    } else {
        for (var i = 0; i < (a.length); i++) {
            for (var j = 0; j < (a[0].length); j++) {
                arr2[i][j] = 0;
            }
        }
    }
    return arr2;  //3*7
}


function sigmaX_PointsBlue(coeArray) {
    var arr2 = coeArray;   //3*7
    var points = arrayInit(3, 24);  // x0 y0 x1 y1 x2 y2....
    var T = 0;
    var P = 3;
    for (var i = 0; i < 6; i++) {
        points[0][4 * i] = (5 + T); //x0
        points[0][4 * i + 1] = (arr2[0][i] + P);          //y0
        points[0][4 * i + 2] = (5 + T + 1); //x1
        points[0][4 * i + 3] = (arr2[0][i + 1] + P);              //y1
        T = T + 1;
    }
    T = 0;
    P = 6;
    for (var i = 0; i < 6; i++) {
        points[1][4 * i] = (5 + T); //x0
        points[1][4 * i + 1] = (arr2[1][i] + P);          //y0
        points[1][4 * i + 2] = (5 + T + 1); //x1
        points[1][4 * i + 3] = (arr2[1][i + 1] + P);              //y1
        T = T + 1;
    }
    T = 0;
    P = 9;
    for (var i = 0; i < 6; i++) {
        points[2][4 * i] = (5 + T); //x0
        points[2][4 * i + 1] = (arr2[2][i] + P);          //y0
        points[2][4 * i + 2] = (5 + T + 1); //x1
        points[2][4 * i + 3] = (arr2[2][i + 1] + P);              //y1
        T = T + 1;
    }
    return axisTransfer(points);
}   // 3*24

// var points =sigmaX_PointsBlue(aaa);

function points2Lines(points) {
    var lineNumber = (points[0].length) / 4;
    var pointNumber = lineNumber * 2;
    var allLine = new Array(points.length);

    var line1 = arrayInit(pointNumber, 2);
    var line2 = arrayInit(pointNumber, 2);
    var line3 = arrayInit(pointNumber, 2);

    for (var i = 0; i < pointNumber; i++) {
        line1[i][0] = points[0][2 * i];
        line1[i][1] = points[0][2 * i + 1];
    }
    for (var i = 0; i < pointNumber; i++) {
        line2[i][0] = points[1][2 * i];
        line2[i][1] = points[1][2 * i + 1];
    }
    for (var i = 0; i < pointNumber; i++) {
        line3[i][0] = points[2][2 * i];
        line3[i][1] = points[2][2 * i + 1];
    }

    allLine[0] = line1;
    allLine[1] = line2;
    allLine[2] = line3;
    return allLine;
}

// var line = points2Lines(points);

//---------------------------------------
function sigmaX_ratioGreen(p1, p2, b) {
    var a = arrayInit(2, 13);
    var Y = b / 3;
    for (var i = 0; i < (a.length); i++) {
        Y = Y + (b / 3) * i * (-2);
        for (var j = 0; j < (a[0].length); j++) {
            var X = j * b / 6;
            var formula = sigmaX_formula(X, Y, p1, p2, b, 'int_num');
            a[i][j] = Math.abs(formula);
        }
    }
    var coeArray = a;
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
    for (var i = 0; i < (a.length); i++) {
        for (var j = 0; j < (a[0].length); j++) {
            if ((Math.abs(coeArray[i][j])) > MAX) {
                MAX = Math.abs(coeArray[i][j]);
            } else if ((Math.abs(coeArray[i][j])) < MIN) {
                MIN = Math.abs(coeArray[i][j]);
            }
        }
    }
    var arr2 = arrayInit((a.length), (a[0].length));
    if (MAX !== 0) {
        for (var i = 0; i < (a.length); i++) {
            for (var j = 0; j < (a[0].length); j++) {
                arr2[i][j] = coeArray[i][j] / MAX;
            }
        }
    } else {
        for (var i = 0; i < (a.length); i++) {
            for (var j = 0; j < (a[0].length); j++) {
                arr2[i][j] = 0;
            }
        }
    }
    return arr2;  //2*13
}

function sigmaX_PointsGreen(ratio) {
    var arr2 = ratio;   //3*7
    var points = arrayInit(2, 48);  // x0 y0 x1 y1 x2 y2....
    var T = 1;
    var P = 0;
    for (var i = 0; i < 12; i++) {
        points[0][4 * i] = (5 + T + arr2[0][i]); //x0
        points[0][4 * i + 1] = (P);          //y0
        points[0][4 * i + 2] = (5 + T + arr2[0][i + 1]); //x1
        points[0][4 * i + 3] = (P+1);              //y1
        P = P + 1;
    }
    T = 5;
    P = 0;
    for (var i = 0; i < 12; i++) {
        points[1][4 * i] = (5 + T + arr2[1][i]); //x0
        points[1][4 * i + 1] = ( P);          //y0
        points[1][4 * i + 2] = (5 + T + arr2[1][i + 1]); //x1
        points[1][4 * i + 3] = (1 + P);              //y1
        P = P + 1;
    }
    return axisTransfer(points);
}

function points2LinesGreen(points) {
    var lineNumber = (points[0].length) / 4;
    var pointNumber = lineNumber * 2;
    var allLine = new Array(points.length);

    var line1 = arrayInit(pointNumber, 2);
    var line2 = arrayInit(pointNumber, 2);


    for (var i = 0; i < pointNumber; i++) {
        line1[i][0] = points[0][2 * i];
        line1[i][1] = points[0][2 * i + 1];
    }
    for (var i = 0; i < pointNumber; i++) {
        line2[i][0] = points[1][2 * i];
        line2[i][1] = points[1][2 * i + 1];
    }

    allLine[0] = line1;
    allLine[1] = line2;

    return allLine;
}
//----------------------------------------
//  graph2
//----------------------
function SigmaYArr(p2, b) {
    var sxArr = arrayInit(13, 7);
    var X = 0;
    var Y = 0;
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 13; j++) {
            X = (j * b) / 6;
            Y = (-1) * b * (i - 3) / 6;
            sxArr[j][i] = sigmaY_formula(X, Y, p2, b, 'int_num');
        }
    }
    return sxArr;  //12*7
}

function SigmaYStr(p2, b) {
    var sxArr = SigmaYArr(p2, b);
    for (var i = 0; i < 13; i++) {
        for (var j = 0; j < 7; j++) {
            sxArr[i][j] = sxArr[i][j].toFixed(2);
            sxArr[i][j] = addLine(sxArr[i][j]);
        }
    }
    var print_arr = arrayInit(13);
    for (var i = 0; i < 13; i++) {
        for (var j = 0; j < 7; j++) {
            print_arr[i] += sxArr[i][j];
        }
    }
    return print_arr;
}
//-------------------------------
function sigmaY_ratioBlue(p2,b) {
    var a = arrayInit(3,7);
    var X = b / 2;
    for (var i = 0; i < (a.length); i++) {
        X = (b / 2) + (b / 2) * i;
        for (var j = 0; j < (a[0].length); j++) {
            var Y = (-1) * b * (j - 3) / 6;
            var formula = sigmaY_formula(X, Y, p2, b, 'int_num');
            a[i][j] = Math.abs(formula);
        }
    }
    var coeArray = a;
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
    for (var i = 0; i < (a.length); i++) {
        for (var j = 0; j < (a[0].length); j++) {
            if ((Math.abs(coeArray[i][j])) > MAX) {
                MAX = Math.abs(coeArray[i][j]);
            } else if ((Math.abs(coeArray[i][j])) < MIN) {
                MIN = Math.abs(coeArray[i][j]);
            }
        }
    }
    var arr2 = arrayInit((a.length), (a[0].length));
    if (MAX !== 0) {
        for (var i = 0; i < (a.length); i++) {
            for (var j = 0; j < (a[0].length); j++) {
                arr2[i][j] = coeArray[i][j] / MAX;
            }
        }
    } else {
        for (var i = 0; i < (a.length); i++) {
            for (var j = 0; j < (a[0].length); j++) {
                arr2[i][j] = 0;
            }
        }
    }
    return arr2;  //3*7
}
function sigmaY_PointsBlue(coeArray) {
    var arr2 = coeArray;   //3*7
    var points = arrayInit(3, 24);  // x0 y0 x1 y1 x2 y2....
    var T = 0;
    var P = 3;
    for (var i = 0; i < 6; i++) {
        points[0][4 * i] = (5 + T); //x0
        points[0][4 * i + 1] = (arr2[0][i] + P);          //y0
        points[0][4 * i + 2] = (5 + T + 1); //x1
        points[0][4 * i + 3] = (arr2[0][i + 1] + P);              //y1
        T = T + 1;
    }
    T = 0;
    P = 6;
    for (var i = 0; i < 6; i++) {
        points[1][4 * i] = (5 + T); //x0
        points[1][4 * i + 1] = (arr2[1][i] + P);          //y0
        points[1][4 * i + 2] = (5 + T + 1); //x1
        points[1][4 * i + 3] = (arr2[1][i + 1] + P);              //y1
        T = T + 1;
    }
    T = 0;
    P = 9;
    for (var i = 0; i < 6; i++) {
        points[2][4 * i] = (5 + T); //x0
        points[2][4 * i + 1] = (arr2[2][i] + P);          //y0
        points[2][4 * i + 2] = (5 + T + 1); //x1
        points[2][4 * i + 3] = (arr2[2][i + 1] + P);              //y1
        T = T + 1;
    }
    return axisTransfer(points);
}
//-------------------------------------
function sigmaY_ratioGreen(p2, b) {
    var a = arrayInit(2, 13);
    var Y = b / 3;
    for (var i = 0; i < (a.length); i++) {
        Y = Y + (b / 3) * i * (-2);
        for (var j = 0; j < (a[0].length); j++) {
            var X = j * b / 6;
            var formula = sigmaY_formula(X, Y,  p2, b, 'int_num');
            a[i][j] = Math.abs(formula);
        }
    }
    var coeArray = a;
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
    for (var i = 0; i < (a.length); i++) {
        for (var j = 0; j < (a[0].length); j++) {
            if ((Math.abs(coeArray[i][j])) > MAX) {
                MAX = Math.abs(coeArray[i][j]);
            } else if ((Math.abs(coeArray[i][j])) < MIN) {
                MIN = Math.abs(coeArray[i][j]);
            }
        }
    }
    var arr2 = arrayInit((a.length), (a[0].length));
    if (MAX !== 0) {
        for (var i = 0; i < (a.length); i++) {
            for (var j = 0; j < (a[0].length); j++) {
                arr2[i][j] = coeArray[i][j] / MAX;
            }
        }
    } else {
        for (var i = 0; i < (a.length); i++) {
            for (var j = 0; j < (a[0].length); j++) {
                arr2[i][j] = 0;
            }
        }
    }
    return arr2;  //2*13
}

function sigmaY_PointsGreen(ratio) {
    var arr2 = ratio;   //3*7
    var points = arrayInit(2, 48);  // x0 y0 x1 y1 x2 y2....
    var T = 1;
    var P = 0;
    for (var i = 0; i < 12; i++) {
        points[0][4 * i] = (5 + T + arr2[0][i]); //x0
        points[0][4 * i + 1] = (P);          //y0
        points[0][4 * i + 2] = (5 + T + arr2[0][i + 1]); //x1
        points[0][4 * i + 3] = (P+1);              //y1
        P = P + 1;
    }
    T = 5;
    P = 0;
    for (var i = 0; i < 12; i++) {
        points[1][4 * i] = (5 + T + arr2[1][i]); //x0
        points[1][4 * i + 1] = ( P);          //y0
        points[1][4 * i + 2] = (5 + T + arr2[1][i + 1]); //x1
        points[1][4 * i + 3] = (1 + P);              //y1
        P = P + 1;
    }
    return axisTransfer(points);
}

function points2LinesGreen(points) {
    var lineNumber = (points[0].length) / 4;
    var pointNumber = lineNumber * 2;
    var allLine = new Array(points.length);

    var line1 = arrayInit(pointNumber, 2);
    var line2 = arrayInit(pointNumber, 2);


    for (var i = 0; i < pointNumber; i++) {
        line1[i][0] = points[0][2 * i];
        line1[i][1] = points[0][2 * i + 1];
    }
    for (var i = 0; i < pointNumber; i++) {
        line2[i][0] = points[1][2 * i];
        line2[i][1] = points[1][2 * i + 1];
    }

    allLine[0] = line1;
    allLine[1] = line2;

    return allLine;
}
//----------------------------------
//  graph3
//----------------------
function taoXYArr(p2, b) {
    var sxArr = arrayInit(13, 7);
    var X = 0;
    var Y = 0;
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 13; j++) {
            X = (j * b) / 6;
            Y = (-1) * b * (i - 3) / 6;
            sxArr[j][i] = taoXY_formula(X, Y, p2, b, 'int_num');
        }
    }
    return sxArr;  //12*7
}

function taoXYStr(p2, b) {
    var sxArr = taoXYArr(p2, b);
    for (var i = 0; i < 13; i++) {
        for (var j = 0; j < 7; j++) {
            sxArr[i][j] = sxArr[i][j].toFixed(2);
            sxArr[i][j] = addLine(sxArr[i][j]);
        }
    }
    var print_arr = arrayInit(13);
    for (var i = 0; i < 13; i++) {
        for (var j = 0; j < 7; j++) {
            print_arr[i] += sxArr[i][j];
        }
    }
    return print_arr;
}
//-------------------------------
function taoXY_ratioBlue(p2,b) {
    var a = arrayInit(3,7);
    var X = b / 2;
    for (var i = 0; i < (a.length); i++) {
        X = (b / 2) + (b / 2) * i;
        for (var j = 0; j < (a[0].length); j++) {
            var Y = (-1) * b * (j - 3) / 6;
            var formula = taoXY_formula(X, Y, p2, b, 'int_num');
            a[i][j] = Math.abs(formula);
        }
    }
    var coeArray = a;
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
    for (var i = 0; i < (a.length); i++) {
        for (var j = 0; j < (a[0].length); j++) {
            if ((Math.abs(coeArray[i][j])) > MAX) {
                MAX = Math.abs(coeArray[i][j]);
            } else if ((Math.abs(coeArray[i][j])) < MIN) {
                MIN = Math.abs(coeArray[i][j]);
            }
        }
    }
    var arr2 = arrayInit((a.length), (a[0].length));
    if (MAX !== 0) {
        for (var i = 0; i < (a.length); i++) {
            for (var j = 0; j < (a[0].length); j++) {
                arr2[i][j] = coeArray[i][j] / MAX;
            }
        }
    } else {
        for (var i = 0; i < (a.length); i++) {
            for (var j = 0; j < (a[0].length); j++) {
                arr2[i][j] = 0;
            }
        }
    }
    return arr2;  //3*7
}
function taoXY_PointsBlue(coeArray) {
    var arr2 = coeArray;   //3*7
    var points = arrayInit(3, 24);  // x0 y0 x1 y1 x2 y2....
    var T = 0;
    var P = 3;
    for (var i = 0; i < 6; i++) {
        points[0][4 * i] = (5 + T); //x0
        points[0][4 * i + 1] = (arr2[0][i] + P);          //y0
        points[0][4 * i + 2] = (5 + T + 1); //x1
        points[0][4 * i + 3] = (arr2[0][i + 1] + P);              //y1
        T = T + 1;
    }
    T = 0;
    P = 6;
    for (var i = 0; i < 6; i++) {
        points[1][4 * i] = (5 + T); //x0
        points[1][4 * i + 1] = (arr2[1][i] + P);          //y0
        points[1][4 * i + 2] = (5 + T + 1); //x1
        points[1][4 * i + 3] = (arr2[1][i + 1] + P);              //y1
        T = T + 1;
    }
    T = 0;
    P = 9;
    for (var i = 0; i < 6; i++) {
        points[2][4 * i] = (5 + T); //x0
        points[2][4 * i + 1] = (arr2[2][i] + P);          //y0
        points[2][4 * i + 2] = (5 + T + 1); //x1
        points[2][4 * i + 3] = (arr2[2][i + 1] + P);              //y1
        T = T + 1;
    }
    return axisTransfer(points);
}
//-------------------------------------
function taoXY_ratioGreen(p2, b) {
    var a = arrayInit(2, 13);
    var Y = b / 3;
    for (var i = 0; i < (a.length); i++) {
        Y = Y + (b / 3) * i * (-2);
        for (var j = 0; j < (a[0].length); j++) {
            var X = j * b / 6;
            var formula = taoXY_formula(X, Y,  p2, b, 'int_num');
            a[i][j] = Math.abs(formula);
        }
    }
    var coeArray = a;
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
    for (var i = 0; i < (a.length); i++) {
        for (var j = 0; j < (a[0].length); j++) {
            if ((Math.abs(coeArray[i][j])) > MAX) {
                MAX = Math.abs(coeArray[i][j]);
            } else if ((Math.abs(coeArray[i][j])) < MIN) {
                MIN = Math.abs(coeArray[i][j]);
            }
        }
    }
    var arr2 = arrayInit((a.length), (a[0].length));
    if (MAX !== 0) {
        for (var i = 0; i < (a.length); i++) {
            for (var j = 0; j < (a[0].length); j++) {
                arr2[i][j] = coeArray[i][j] / MAX;
            }
        }
    } else {
        for (var i = 0; i < (a.length); i++) {
            for (var j = 0; j < (a[0].length); j++) {
                arr2[i][j] = 0;
            }
        }
    }
    return arr2;  //2*13
}

function taoXY_PointsGreen(ratio) {
    var arr2 = ratio;   //3*7
    var points = arrayInit(2, 48);  // x0 y0 x1 y1 x2 y2....
    var T = 1;
    var P = 0;
    for (var i = 0; i < 12; i++) {
        points[0][4 * i] = (5 + T + arr2[0][i]); //x0
        points[0][4 * i + 1] = (P);          //y0
        points[0][4 * i + 2] = (5 + T + arr2[0][i + 1]); //x1
        points[0][4 * i + 3] = (P+1);              //y1
        P = P + 1;
    }
    T = 5;
    P = 0;
    for (var i = 0; i < 12; i++) {
        points[1][4 * i] = (5 + T + arr2[1][i]); //x0
        points[1][4 * i + 1] = ( P);          //y0
        points[1][4 * i + 2] = (5 + T + arr2[1][i + 1]); //x1
        points[1][4 * i + 3] = (1 + P);              //y1
        P = P + 1;
    }
    return axisTransfer(points);
}

function points2LinesGreen(points) {
    var lineNumber = (points[0].length) / 4;
    var pointNumber = lineNumber * 2;
    var allLine = new Array(points.length);

    var line1 = arrayInit(pointNumber, 2);
    var line2 = arrayInit(pointNumber, 2);


    for (var i = 0; i < pointNumber; i++) {
        line1[i][0] = points[0][2 * i];
        line1[i][1] = points[0][2 * i + 1];
    }
    for (var i = 0; i < pointNumber; i++) {
        line2[i][0] = points[1][2 * i];
        line2[i][1] = points[1][2 * i + 1];
    }

    allLine[0] = line1;
    allLine[1] = line2;

    return allLine;
}
//----------------------------------





