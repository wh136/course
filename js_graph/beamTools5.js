function addLine(item) {
    if (item.length < 6) {
        var round = (6 - (item.length));
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
        for (var j = 0; j < (arr[i].length) / 2; j++) {
            arr[i][2 * j] = arr[i][2 * j] - 7;
            arr[i][2 * j + 1] = arr[i][2 * j + 1] - 4;
            arr[i][2 * j + 1] = arr[i][2 * j + 1] * (-1);
        }
    }
    return arr;
}

function arrayInit(row, column, arr_type) {
    var arr = new Array();
    if (arr_type == 'int') {
        for (var i = 0; i < row; i++) {
            arr[i] = new Array();
            for (var j = 0; j < column; j++) {
                arr[i][j] = 0;
            }
        }
    } else if (arr_type == 'str') {
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

function getRowNumber(Q, formula_type) {
    var L = 10;
    var H = 2;
    var lineArr = arrayInit(13, 7, 'int');
    var X = 0;
    var Y = 0;
    if (formula_type === 'sigmaX') {
        for (var i = 0; i < 13; i++) {
            X = -6 + i;
            for (var j = 0; j < 7; j++) {
                Y = (j - 3) * 0.25;
                var N1 = (6 * Q / H / H / H) * Y * (L * L - X * X) + Q * Y / H * (4 * Y * Y / H / H - 3 / 5);
                N1 = N1.toFixed(2);
                lineArr[i][j] = N1;
            }
        }

    } else if (formula_type === 'sigmaY') {
        for (var i = 0; i < 13; i++) {
            X = -6 + i;
            for (var j = 0; j < 7; j++) {
                Y = (j - 3) * 0.25;
                var N2 = (-Q / 2) * (1 + Y / H) * (1 - 2 * Y / H) * (1 - 2 * Y / H);
                N2 = N2.toFixed(2);
                lineArr[i][j] = N2;
            }
        }

    } else if (formula_type === 'taoXY') {

        for (var i = 0; i < 13; i++) {
            X = -6 + i;
            for (var j = 0; j < 7; j++) {
                Y = (j - 3) * 0.25;
                var N3 = (-6 * Q * X / H / H / H) * (H * H / 4 - Y * Y);
                N3 = N3.toFixed(2);
                lineArr[i][j] = N3;
            }
        }

    } else {
        for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 7; j++) {
                var N1 = (6 * Q / H / H / H) * Y * (L * L - X * X) + Q * Y / H * (4 * Y * Y / H / H - 3 / 5);
                N1 = N1.toFixed(2);
                lineArr[i][j] = N1;
            }
        }

    }
    var final_arr = arrayInit(7, 1, 'str');
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 13; j++) {
            var line_item = addLine(lineArr[j][i]);
            final_arr[i][0] += line_item;
        }
    }
    return final_arr;
}

// var lineNumber = getRowNumber(1, 'sigmaX');
// var rowNumber = getRowNumber(1,'sigmaY');

// var ratio = getRatio(1, 'blue', 'sigmaX');
// var blueLine = getBlueLine(ratio);
// var ratio_green = getRatio(1, 'green', 'sigmaX');
// var greenLine = getGreenLine(ratio_green);

function formula(Q, X, Y, L, H, formula_type) {
    if (formula_type === 'sigmaX') {
         return (6 * Q / H / H / H) * Y * (L * L - X * X) + Q * Y / H * (4 * Y * Y / H / H - 3 / 5);
    } else if (formula_type === 'sigmaY') {
        return  (-Q / 2) * (1 + Y / H) * (1 - 2 * Y / H) * (1 - 2 * Y / H);
    } else if (formula_type === 'taoXY') {
        return  (-6 * Q * X / H / H / H) * (H * H / 4 - Y * Y);
    } else {
        return 'err  formula';
    }
}

function getRatio(Q, ratio_type, formula_type) {
    var max = 0;
    var min = 0;
    var X = 0;
    var Y = 0;
    var L = 10;
    var H = 2;
    if (ratio_type === 'blue') {
        var temp = arrayInit(4, 7, 'int');
        var ratio = arrayInit(4, 7, 'int');

        for (var i = 0; i < 2; i++) {
            X = -4 + 2 * i;
            for (var j = 0; j < 7; j++) {
                Y = (j - 3) * 0.25;
                var N1 = formula(Q, X, Y, L, H, formula_type);
                temp[i][j] = N1;
            }
        }
        X = 0;
        for (var i = 0; i < 2; i++) {
            X = 2 + 2 * i;
            for (var j = 0; j < 7; j++) {
                Y = (j - 3) * 0.25;
                var N1 = formula(Q, X, Y, L, H, formula_type);
                temp[i + 2][j] = N1;
            }
        }
    } else if (ratio_type === 'green') {
        Y = -0.5;
        var temp = arrayInit(2, 13, 'int');
        var ratio = arrayInit(2, 13, 'int');

        for (var j = 0; j < 13; j++) {
            X = (j - 6);
            var N1 = formula(Q, X, Y, L, H, formula_type);
            temp[0][j] = N1;
        }

        Y = 0.5;
        for (var j = 0; j < 13; j++) {
            X = (j - 6);
            var N1 = formula(Q, X, Y, L, H, formula_type);
            temp[1][j] = N1;
        }
    } else {
        return 'false_ratio_type';
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


function getBlueLine(ratio) {
    var blueLine = arrayInit(4, 24, 'int');
    var P = 0;
    var T = 2;
    for (var i = 0; i < 6; i++) {
        blueLine[0][4 * i] = (1 + T + ratio[0][i] * (5 / 6));
        blueLine[0][4 * i + 1] = (1 + P);
        blueLine[0][4 * i + 2] = (1 + T + ratio[0][i + 1] * (5 / 6));
        blueLine[0][4 * i + 3] = (1 + P + 1);
        P = P + 1;
    }
    P = 0;
    T = 4;
    for (var i = 0; i < 6; i++) {
        blueLine[1][4 * i] = (1 + T + ratio[1][i] * (5 / 6));
        blueLine[1][4 * i + 1] = (1 + P);
        blueLine[1][4 * i + 2] = (1 + T + ratio[1][i + 1] * (5 / 6));
        blueLine[1][4 * i + 3] = (1 + P + 1);
        P = P + 1;
    }
    P = 0;
    T = 8;
    for (var i = 0; i < 6; i++) {
        blueLine[2][4 * i] = (1 + T + ratio[2][i] * (5 / 6));
        blueLine[2][4 * i + 1] = (1 + P);
        blueLine[2][4 * i + 2] = (1 + T + ratio[2][i + 1] * (5 / 6));
        blueLine[2][4 * i + 3] = (1 + P + 1);
        P = P + 1;
    }
    P = 0;
    T = 10;
    for (var i = 0; i < 6; i++) {
        blueLine[3][4 * i] = (1 + T + ratio[3][i] * (5 / 6));
        blueLine[3][4 * i + 1] = (1 + P);
        blueLine[3][4 * i + 2] = (1 + T + ratio[3][i + 1] * (5 / 6));
        blueLine[3][4 * i + 3] = (1 + P + 1);
        P = P + 1;
    }
    var temp = axisTransfer(blueLine);  //4*24
    var line1 = arrayInit(12,2,'int');
    var line2 = arrayInit(12,2,'int');
    var line3 = arrayInit(12,2,'int');
    var line4 = arrayInit(12,2,'int');
    var allLine = new Array(4);
    for(var i=0;i<12;i++){
        line1[i][0] = temp[0][2*i];
        line1[i][1] = temp[0][2*i+1];
    }
    for(var i=0;i<12;i++){
        line2[i][0] = temp[1][2*i];
        line2[i][1] = temp[1][2*i+1];
    }
    for(var i=0;i<12;i++){
        line3[i][0] = temp[2][2*i];
        line3[i][1] = temp[2][2*i+1];
    }
    for(var i=0;i<12;i++){
        line4[i][0] = temp[3][2*i];
        line4[i][1] = temp[3][2*i+1];
    }
    allLine[0] =line1;
    allLine[1]=line2;
    allLine[2]=line3;
    allLine[3]=line4;
    return allLine;
}


function getGreenLine(ratio) {
    var greenLine = arrayInit(2, 48, 'int');
    var P = 1;
    var T = 0;
    for (var i = 0; i < 12; i++) {
        greenLine[0][4 * i] = (1 + T);
        greenLine[0][4 * i + 1] = (1 + P + ratio[0][i] * (5 / 6));
        greenLine[0][4 * i + 2] = (1 + T + 1);
        greenLine[0][4 * i + 3] = (1 + P + ratio[0][i + 1] * (5 / 6));
        T = T + 1;
    }
    P = 5;
    T = 0;
    for (var i = 0; i < 12; i++) {
        greenLine[1][4 * i] = (1 + T);
        greenLine[1][4 * i + 1] = (1 + P + ratio[1][i] * (5 / 6));
        greenLine[1][4 * i + 2] = (1 + T + 1);
        greenLine[1][4 * i + 3] = (1 + P + ratio[1][i + 1] * (5 / 6));
        T = T + 1;
    }
    var temp = axisTransfer(greenLine);  //2*48
    var line1 = arrayInit(24,2,'int');
    var line2 = arrayInit(24,2,'int');
    var allLine = new Array(2);
    for(var i=0;i<24;i++){
        line1[i][0] = temp[0][2*i];
        line1[i][1] = temp[0][2*i+1];
    }
    for(var i=0;i<24;i++){
        line2[i][0] = temp[1][2*i];
        line2[i][1] = temp[1][2*i+1];
    }

    allLine[0] =line1;
    allLine[1]=line2;
    return allLine;
}