//
// function postionNumber() {
//
// }
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

function axisTransfer(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < (arr[i].length) / 2; j++) {
            arr[i][2 * j] = arr[i][2 * j] - 17;
            arr[i][2 * j + 1] = arr[i][2 * j + 1] - 6.4;
            arr[i][2 * j] = arr[i][2 * j] * (-1);
            arr[i][2 * j + 1] = arr[i][2 * j + 1] * (-1);
        }
    }
    return arr;
}

var max = 0;
var temp = arrayInit(2, 31);

function getRatio(E1, U1, E2, U2, Q) {

    var ratio = arrayInit(2, 31);
    var R1 = 8;
    var R2 = 10;
    var n = E2 * (1 + U1) / E1 / (1 + U2);
    var P = 0;
    max = 0;
    var min = 0;

    for (var i = 0; i < 11; i++) {
        P = 8 + i * 0.2;
        var N1 = -Q * ((1 + (1 - 2 * U1) * n) * R2 * R2 / P / P - (1 - n)) / ((1 + (1 - 2 * U1) * n) * R2 * R2 / R1 / R1 - (1 - n));
        temp[0][i] = N1;
    }
    for (var i = 0; i < 31; i++) {
        P = 10 + i * 0.2;
        var N3 = -Q * ((1 + (1 - 2 * U1) * n) * R2 * R2 / P / P - (1 - n)) / ((1 + (1 - 2 * U1) * n) * R2 * R2 / R1 / R1 - (1 - n));
        temp[1][i] = N3;
    }

    if (Math.abs(temp[0][0]) > Math.abs(temp[0][1])) {
        max = Math.abs(temp[0][0]);
        min = Math.abs(temp[0][1]);
    } else {
        max = Math.abs(temp[0][1]);
        min = Math.abs(temp[0][0]);
    }
    for (var i = 0; i < 11; i++) {
        if (Math.abs(temp[0][i]) >= max) {
            max = Math.abs(temp[0][i]);
        } else if (Math.abs(temp[0][i]) < min) {
            min = Math.abs(temp[0][i]);
        }
    }
    for (var i = 0; i < 31; i++) {
        if (Math.abs(temp[1][i]) >= max) {
            max = Math.abs(temp[1][i]);
        } else if (Math.abs(temp[1][i]) < min) {
            min = Math.abs(temp[1][i]);
        }
    }
    if (max !== 0) {
        for (var i = 0; i < 11; i++) {
            ratio[0][i] = temp[0][i] / max;
        }
        for (var i = 0; i < 31; i++) {
            ratio[1][i] = temp[1][i] / max;
        }
    } else {
        for (var i = 0; i < 11; i++) {
            ratio[0][i] = 0;
        }
        for (var i = 0; i < 31; i++) {
            ratio[1][i] = 0;
        }
    }
    return ratio;   //2*31  1*11 1*31
}

function getRatio_fei(E1, U1, E2, U2, Q) {

    var ratio = arrayInit(2, 31);
    var R1 = 8;
    var R2 = 10;
    var n = E2 * (1 + U1) / E1 / (1 + U2);
    var P = 0;
    max = 0;
    var min = 0;

    for (var i = 0; i < 11; i++) {
        P = 8 + i * 0.2;
        var N1 = Q * ((1 + (1 - 2 * U1) * n) * R2 * R2 / P / P + (1 - n)) / ((1 + (1 - 2 * U1) * n) * R2 * R2 / R1 / R1 - (1 - n));
        temp[0][i] = N1;
    }
    for (var i = 0; i < 31; i++) {
        P = 10 + i * 0.2;
        var N3 = Q * (2 * (1 - U1) * n * R2 * R2 / P / P) / ((1 + (1 - 2 * U1) * n) * R2 * R2 / R1 / R1 - (1 - n));
        temp[1][i] = N3;
    }

    if (Math.abs(temp[0][0]) > Math.abs(temp[0][1])) {
        max = Math.abs(temp[0][0]);
        min = Math.abs(temp[0][1]);
    } else {
        max = Math.abs(temp[0][1]);
        min = Math.abs(temp[0][0]);
    }
    for (var i = 0; i < 11; i++) {
        if (Math.abs(temp[0][i]) >= max) {
            max = Math.abs(temp[0][i]);
        } else if (Math.abs(temp[0][i]) < min) {
            min = Math.abs(temp[0][i]);
        }
    }
    for (var i = 0; i < 31; i++) {
        if (Math.abs(temp[1][i]) >= max) {
            max = Math.abs(temp[1][i]);
        } else if (Math.abs(temp[1][i]) < min) {
            min = Math.abs(temp[1][i]);
        }
    }
    if (max !== 0) {
        for (var i = 0; i < 11; i++) {
            ratio[0][i] = temp[0][i] / max;
        }
        for (var i = 0; i < 31; i++) {
            ratio[1][i] = temp[1][i] / max;
        }
    } else {
        for (var i = 0; i < 11; i++) {
            ratio[0][i] = 0;
        }
        for (var i = 0; i < 31; i++) {
            ratio[1][i] = 0;
        }
    }
    return ratio;   //2*31  1*11 1*31
}


function pointsArr(ratio) {
    var firstLine = arrayInit(1, 40);
    var secondLine = arrayInit(1, 120);
    var T = 0;
    for (var i = 0; i < 10; i++) {
        firstLine[0][4 * i] = (17 - T * 0.4);
        firstLine[0][4 * i + 1] = (6.4 + ratio[0][i] * 6);
        firstLine[0][4 * i + 2] = (17 - (T + 1) * 0.4);
        firstLine[0][4 * i + 3] = (6.4 + ratio[0][i + 1] * 6);
        T = T+1;
    }
    T=0;
    for (var i = 0; i < 30; i++) {
        secondLine[0][4 * i] = (13 - T * 0.4);
        secondLine[0][4 * i + 1] = (6.4 + ratio[1][i] * 6);
        secondLine[0][4 * i + 2] = (13 - (T + 1) * 0.4);
        secondLine[0][4 * i + 3] = (6.4 + ratio[1][i + 1] * 6);
        T = T+1;
    }
    var allLine = new Array(2);
    firstLine = axisTransfer(firstLine);
    secondLine = axisTransfer(secondLine);
    var allLine = new Array(2);
    allLine[0] = firstLine; //1*40
    allLine[1] = secondLine; //1*120
    return allLine;
}

function makeLineArr(allLine) {
    var line1 = arrayInit(20,2);
    var line2 = arrayInit(30,2);
    var pointArr1=allLine[0];
    var pointArr2=allLine[1];
    for(var i=0;i<20;i++){
        line1[i][0]=pointArr1[0][2*i];
        line1[i][1]=pointArr1[0][2*i+1];
    }
    for(var i=0;i<30;i++){
        line2[i][0]=pointArr2[0][2*i];
        line2[i][1]=pointArr2[0][2*i+1];
    }
    var line = new Array(2);
    line[0] = line1;
    line[1] = line2;
    return line;
}


// var ratio = getRatio(2800,0.2,120,0.3,100);
// var pa = pointsArr(ratio);
// var line = makeLineArr(pa);