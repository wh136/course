function arrayInit(row, column, arr_type) {
    var arr = new Array();
    if (arr_type === 'int') {
        for (var i = 0; i < row; i++) {
            arr[i] = new Array();
            for (var j = 0; j < column; j++) {
                arr[i][j] = 0;
            }
        }
    } else if (arr_type === 'str') {
        for (var i = 0; i < row; i++) {
            arr[i] = new Array();
            for (var j = 0; j < column; j++) {
                arr[i][j] = '';
            }
        }
    } else {
        for (var i = 0; i < row; i++) {
            arr[i] = new Array();
            for (var j = 0; j < column; j++) {
                arr[i][j] = 0;
            }
        }
    }
    return arr;
}

function axisTransfer(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < (arr[i].length) / 2; j++) {
            arr[i][2 * j] = arr[i][2 * j]-1;
            arr[i][2 * j + 1] = arr[i][2 * j + 1]-1;
            arr[i][2 * j + 1] = arr[i][2 * j + 1] * (-1);
        }
    }
    return arr;
}

function addLine(item, end) {
    if ((item.length < 6)&&(end===false)) {
        var round = (6 - (item.length));
        for (var i = 0; i < round; i++) {
            item = item + '__';
        }
    } else if((item.length >= 6)&&(end===false)){
        item = item + '_';
    } else if((end===true)){
        item = item + '';
    }
    return item;
}

function formulaChoose(P1, P2, alpha, X, Y, formula_type) {
    var formula;
    // alpha = Math.PI * alpha;
    switch (formula_type) {
        case  'sigmax':
            formula = -1 * P2 * 9.8 * Y;
            return formula;
        case  'sigmay':
            formula = (P1 * 9.8 * Math.cos(alpha) - 2 * P2 * 9.8 * Math.cos(alpha) * Math.cos(alpha) * Math.cos(alpha)) * X + (P2 * 9.8 * Math.cos(alpha) * Math.cos(alpha) - P1 * 9.8) * Y;
            return formula;
        case  'taoxy':
            formula = -1 * P2 * 9.8 * X * Math.cos(alpha) * Math.cos(alpha);
            return formula;
    }
}

function getTagNumber(p1, p2, alpha, formula_type) {
    var X = 0;
    var Y = 0;
    alpha = Math.PI * alpha;
    var end;
    var tagNumber = arrayInit(11, 11, 'int');
    for (var i = 0; i <= 10; i++) {
        Y = i;
        for (var j = 0; j <= i; j++) {
            X = j;
            var N2 = formulaChoose(p1, p2, alpha, X, Y, formula_type);
            var temp = N2.toFixed(1);
            if (temp === '-0.0') {
                temp = '0';
            }else {
                if(j===i){
                    end = true;
                } else {
                    end = false;
                }
                temp = addLine(temp, end);
                tagNumber[i][j] = temp;
            }

        }

    }
    var lineNumber = arrayInit(1, 11, 'str');
    for (var i = 0; i <= 10; i++) {
        for (var j = 0; j <= i; j++) {
            lineNumber[0][i] += tagNumber[i][j];
        }
    }
    return lineNumber;
}



function getRatio(P1, P2, alpha, formula_type, color) {
    var X = 0;
    var Y = 0;
    alpha = Math.PI * alpha;
    var temp = arrayInit(2, 10, 'int');
    var ratio = arrayInit(2, 10, 'int');
    var max = 0;
    var min = 0;
    if(color ==='blue'){
        for (var i = 0; i < 10; i++) {
            X =1;
            Y = (i - 10) * (-1);
            var N2 = formulaChoose(P1, P2, alpha, X, Y, formula_type);

            temp[0][i] = N2;
        }
        for (var i = 0; i < 7; i++) {
            X=4;
            Y = (i - 10) * (-1);
            var N2 = formulaChoose(P1, P2, alpha, X, Y, formula_type);
            temp[1][i] = N2;
        }
    }else if(color === 'green'){
        Y = 9;
        for (var i = 0; i < 10; i++) {
            X = i;
            var N2 = formulaChoose(P1, P2, alpha, X, Y, formula_type);
            temp[0][i] = N2;
        }
        Y = 6;
        for (var i = 0; i < 7; i++) {
            X = i;
            var N2 = formulaChoose(P1, P2, alpha, X, Y, formula_type);
            temp[1][i] = N2;
        }

    }else {
        return 'false color';
    }

    if (Math.abs(temp[0][0]) > Math.abs(temp[0][1])) {
        max = Math.abs(temp[0][0]);
        min = Math.abs(temp[0][1]);
    } else {
        max = Math.abs(temp[0][1]);
        min = Math.abs(temp[0][0]);
    }
    for (var i = 0; i < temp.length; i++) {
        for (var j = 0; j < temp[i].length; j++) {
            if (Math.abs(temp[i][j]) >= max) {
                max = Math.abs(temp[i][j]);
            } else if (Math.abs(temp[i][j]) < min) {
                min = Math.abs(temp[i][j]);
            }
        }
    }
    if (max !== 0) {
        for (var i = 0; i < temp.length; i++) {
            for (var j = 0; j < temp[i].length; j++) {
                ratio[i][j] = temp[i][j] / max;
            }
        }
    } else {
        for (var i = 0; i < temp.length; i++) {
            for (var j = 0; j < temp[i].length; j++) {
                ratio[i][j] = 0;
            }
        }
    }
    return ratio;
}

var ratio = getRatio(2.4, 1, 0.25, 'sigmax', 'blue');
var points = getPoints(ratio, 'blue');
var line  = pointsConnect(points);

function getPoints(ratio, color) {
    var line1 = arrayInit(2, 36, 'int');
    var line2 = arrayInit(2, 24, 'int');

    var P = 10;
    var T = 1;
    if(color === 'blue'){
        for (var j = 0; j < 9; j++) {
            line1[0][4 * j] = (1 + T + ratio[0][j] * (5/6));
            line1[0][4 * j + 1] = (1+P);
            line1[0][4 * j + 2] = (1 + T + ratio[0][j+1] * (5/6));
            line1[0][4 * j + 3] = (P);

            line1[1][4 * j] = (1 + T );
            line1[1][4 * j + 1] = (P);
            line1[1][4 * j + 2] = (1 + T + ratio[0][j+1] * (5/6));
            line1[1][4 * j + 3] = (P);
            P = P - 1;
        }
        P = 10;
        T = 4;
        for (var j = 0; j < 6; j++) {
            line2[0][4 * j] = (1 + T + ratio[1][j] * (5/6));
            line2[0][4 * j + 1] = (1+P);
            line2[0][4 * j + 2] = (1 + T + ratio[1][j+1] * (5/6));
            line2[0][4 * j + 3] = (P);

            line2[1][4 * j] = (1 + T );
            line2[1][4 * j + 1] = (P);
            line2[1][4 * j + 2] = (1 + T + ratio[1][j+1] * (5/6));
            line2[1][4 * j + 3] = (P);
            P = P - 1;
        }
    }else if(color === 'green'){
        P = 9;
        T = 0;
        for (var j = 0; j < 9; j++) {
            line1[0][4 * j] = (1 + T);
            line1[0][4 * j + 1] = (1+P+ ratio[0][j] * (5/6));
            line1[0][4 * j + 2] = (1 + T + 1);
            line1[0][4 * j + 3] = (1+P+ratio[0][j+1] * (5/6));

            line1[1][4 * j] = (1 + T+1);
            line1[1][4 * j + 1] = (1+P);
            line1[1][4 * j + 2] = (1 + T + 1);
            line1[1][4 * j + 3] = (1+P+ratio[0][j+1] * (5/6));
            T = T + 1;
        }
        P = 6;
        T = 0;
        for (var j = 0; j < 6; j++) {
            line2[0][4 * j] = (1 + T );
            line2[0][4 * j + 1] = (1+P+ ratio[1][j] * (5/6));
            line2[0][4 * j + 2] = (1 + T + 1);
            line2[0][4 * j + 3] = (1+P+ratio[1][j+1] * (5/6));

            line2[1][4 * j] = (1 + T +1);
            line2[1][4 * j + 1] = (1+P);
            line2[1][4 * j + 2] = (1 + T +1);
            line2[1][4 * j + 3] = (1+P+ ratio[1][j+1] * (5/6));
            T = T + 1;
        }
    }else {
        return 'false color';
    }

    var allLine = new Array(2);
    line1 = axisTransfer(line1);
    line2 = axisTransfer(line2);
    allLine[0] = line1;
    allLine[1] = line2;
    return allLine;
}

function pointsConnect(allLine) {
    line1 = allLine[0];  // 2*36
    line2 = allLine[1];  //2*24

    var ConnectArr1 = arrayInit(line1[0].length / 2, 2, 'int');
    var ConnectArr2 = arrayInit(line1[0].length / 2, 2, 'int');
    var ConnectArr3 = arrayInit(line1[0].length / 2, 2, 'int');
    var ConnectArr4 = arrayInit(line1[0].length / 2, 2, 'int');

    for (var i = 0; i < ConnectArr1.length ; i++) {
        ConnectArr1[i][0] = line1[0][2 * i];
        ConnectArr1[i][1] = line1[0][2 * i + 1];
    }
    for (var i = 0; i < ConnectArr1.length ; i++) {
        ConnectArr2[i][0] = line1[1][2 * i];
        ConnectArr2[i][1] = line1[1][2 * i + 1];
    }

    for (var i = 0; i < ConnectArr2.length ; i++) {
        ConnectArr3[i][0] = line2[0][2 * i];
        ConnectArr3[i][1] = line2[0][2 * i + 1];
    }
    for (var i = 0; i < ConnectArr2.length; i++) {
        ConnectArr4[i][0] = line2[1][2 * i];
        ConnectArr4[i][1] = line2[1][2 * i + 1];
    }
    var ConnectArr = new Array(4);
    ConnectArr[0] = ConnectArr1;
    ConnectArr[1] = ConnectArr2;
    ConnectArr[2] = ConnectArr3;
    ConnectArr[3] = ConnectArr4;
    return ConnectArr;
}
