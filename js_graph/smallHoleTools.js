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

function axisTransfer(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < (arr[i].length) / 2; j++) {
            arr[i][2 * j] = arr[i][2 * j] - 12.5;
            arr[i][2 * j + 1] = arr[i][2 * j + 1] - 11.25;
            arr[i][2 * j + 1] = arr[i][2 * j + 1] * (-1);
        }
    }
    return arr;
}

function fillNumber2Div(arr) {
    document.getElementById("item1").innerText = '(1)' + arr[0];
    document.getElementById("item2").innerText = '(2)' + arr[1];
    document.getElementById("item3").innerText = '(3)' + arr[2];
    document.getElementById("item4").innerText = '(4)' + arr[3];
    document.getElementById("item5").innerText = '(5)' + arr[4];
    document.getElementById("item6").innerText = '(6)' + arr[5];
    document.getElementById("item7").innerText = '(7)' + arr[6];
    document.getElementById("item8").innerText = '(8)' + arr[7];
    document.getElementById("item9").innerText = '(9)' + arr[8];
    document.getElementById("item10").innerText = '(10)' + arr[9];
    document.getElementById("item11").innerText = '(11)' + arr[10];
    document.getElementById("item12").innerText = '(12)' + arr[11];
    // document.getElementById("item13").innerText = '(13)' + arr[12];
}

// circleNum = getCircleNumber(1,1);
// fillNumber2Div(circleNum);
function formulaChoose(Q1, Q2, R1, P, S, hole_exist, formula_type) {
    var formula;
    if (hole_exist === 'yes') {
        switch (formula_type) {
            case 'rou':
                formula = (Q1 / 2 + Q2 / 2) * (1 - R1 * R1 / P / P) + (Q1 - Q2) / 2 * (1 - R1 * R1 / P / P) * (1 - 3 * R1 * R1 / P / P) * Math.cos(2 * S);
                return formula;
            case 'fei':
                formula = (Q1 / 2 + Q2 / 2) * (1 + R1 * R1 / P / P) - (Q1 - Q2) / 2 * (1 + 3 * R1 * R1 * R1 * R1 / P / P / P / P) * Math.cos(2 * S);
                return formula;
            case 'roufei':
                formula = -(Q1 - Q2) / 2 * (1 - R1 * R1 / P / P) * (1 + 3 * R1 * R1 / P / P) * Math.sin(2 * S);
                return formula;
        }
    } else if (hole_exist === 'no') {
        switch (formula_type) {
            case 'rou':
                formula = Q2 * Math.sin(S) * Math.sin(S) + Q1 * Math.cos(S) * Math.cos(S);
                return formula;
            case 'fei':
                formula = Q2 * Math.cos(S) * Math.cos(S) + Q1 * Math.sin(S) * Math.sin(S);
                return formula;
            case 'roufei':
                formula =(Q1 - Q2) * Math.sin(S) * Math.cos(S);
                return formula;
        }
    } else {
        return 'false coef of hole_exist!'
    }
}


function getCircleNumber(Q1, Q2, R1, hole_exist, formula_type) {
    var S = 0;
    var P = 0;
    var circleNumber = arrayInit(13, 9, 'int');

    for (var i = 0; i < 13; i++) {
        S = i * (Math.PI / 6);
        for (var j = 0; j < 9; j++) {
            P = R1 + j * 0.5 * R1;
            var N2 = formulaChoose(Q1, Q2, R1, P, S, hole_exist, formula_type);
            var temp=N2.toFixed(1);
            if (temp==='-0.0'){
                temp = '0';
            }
            circleNumber[i][j] = temp;
        }
    }
    return circleNumber;
}


function getRatio(Q1, Q2, R1, hole_exist, formula_type) {
    var S = 0;
    var P = 0;
    var max = 0;
    var min = 0;

    var temp = arrayInit(2, 9);
    var ratio = arrayInit(2, 9);

    for (var i = 0; i < 2; i++) {
        S = i * Math.PI / 2;
        for (var j = 0; j < 9; j++) {
            P = R1 + j * 0.5 * R1;
            var N2 = formulaChoose(Q1, Q2, R1, P, S, hole_exist, formula_type);
            temp[i][j] = N2;
        }
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

function getGreenLinePoints(ratio) {
    var real_line = arrayInit(2, 32, 'int');
    var virtul_line = arrayInit(4, 4, 'int');

    var P = 0;
    for (var j = 0; j < 8; j++) {
        real_line[1][4 * j] = (12.5 - ratio[1][j] * 2.5);
        real_line[1][4 * j + 1] = (9.25 - P);
        real_line[1][4 * j + 2] = (12.5 - ratio[1][j + 1] * 2.5);
        real_line[1][4 * j + 3] = (9.25 - P - 1);
        P = P + 1;
    }
    var T = 0;
    for (var j = 0; j < 8; j++) {
        real_line[0][4 * j] = (14.5 + T);
        real_line[0][4 * j + 1] = (11.25 - ratio[0][j] * 2.5);
        real_line[0][4 * j + 2] = (14.5 + T + 1);
        real_line[0][4 * j + 3] = (11.25 - ratio[0][j + 1] * 2.5);
        T = T + 1;
    }

    virtul_line[0][0] = 14.5;
    virtul_line[0][1] = 11.25 - ratio[0][0] * 2.5;
    virtul_line[0][2] = 14.5;
    virtul_line[0][3] = 11.25;

    virtul_line[1][0] = 22.5;
    virtul_line[1][1] = 11.25 - ratio[0][8] * 2.5;
    virtul_line[1][2] = 22.5;
    virtul_line[1][3] = 11.25;

    virtul_line[2][0] = 12.5 - ratio[1][0] * 2.5;
    virtul_line[2][1] = 9.25;
    virtul_line[2][2] = 12.5;
    virtul_line[2][3] = 9.25;

    virtul_line[3][0] = 12.5 - ratio[1][8] * 2.5;
    virtul_line[3][1] = 1.25;
    virtul_line[3][2] = 12.5;
    virtul_line[3][3] = 1.25;

    var allLine = new Array(2);

    real_line = axisTransfer(real_line);
    virtul_line = axisTransfer(virtul_line);

    allLine[0] = real_line;
    allLine[1] = virtul_line;

    return allLine;
}

function pointsConnect(points, row) {
    var ConnectArr = arrayInit(points[row].length / 2, 2, 'int');
    for (var i = 0; i < points[row].length / 2; i++) {
        ConnectArr[i][0] = points[row][2 * i];
        ConnectArr[i][1] = points[row][2 * i + 1];
    }
    return ConnectArr;
}
