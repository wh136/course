function sigmaRou(Q1, Q2, P) {
    var R1 = 4;
    var R2 = 5;
    var result = ((R2 * R2 / P / P)-1 ) * Q1 / ((R2 * R2 / R1 / R1) - 1) - (1 - (R1 * R1 / P / P)) * Q2 / (1 - (R1 * R1 / R2 / R2));
    return result;
}

function sigmaFei(Q1, Q2, P) {
    var R1 = 4;
    var R2 = 5;
    var result = (R2 * R2 / P / P + 1) * Q1 / (R2 * R2 / R1 / R1 - 1) - (1 + R1 * R1 / P / P) * Q2 / (1 - R1 * R1 / R2 / R2);
    return result;
}

function sigmaFeiArr(Q1, Q2) {
    var P = 4;
    var arr = new Array(11);

    for (var i = 0; i < 11; i++) {
        P = 4 + i * 0.1;
        arr[i] = Math.round(sigmaFei(Q1, Q2, P));
    }
    return arr;
}


function sigmaRouArr(Q1, Q2) {
    var P = 4;
    var arr = new Array(11);

    for (var i = 0; i < 11; i++) {
        P = 4 + i * 0.1;
        arr[i] = Math.round(sigmaRou(Q1, Q2, P));
    }
    return arr;
}

function toFixArr(arr) {
    for (var i = 0; i < 11; i++) {
        arr[i] = arr[i].toFixed(2);
    }
    return arr;
}

function getRatio(arr) {
    var MAX, MIN;
    if (Math.abs(arr[0]) > Math.abs(arr[1])) {
        MAX = Math.abs(arr[0]);
        MIN = Math.abs(arr[1]);
    } else {
        MAX = Math.abs(arr[1]);
        MIN = Math.abs(arr[0]);
    }
    for (var i = 0; i < 11; i++) {
        if(Math.abs(arr[i])>=MAX){
            MAX=Math.abs(arr[i]);
        }else if(Math.abs(arr[i])<MIN){
            MIN=Math.abs(arr[i]);
        }
    }
    var arr2 = new Array(11);
    if(MAX!==0){
        for(var i=0;i<11;i++){
            arr2[i]=arr[i]/MAX;
        }
    }else {
        for(var i=0;i<11;i++){
            arr2[i]=0;
        }
    }
    return arr2;
}

function getLine(arr2) {
    var xdist = new Array(11);
    for(var i=0;i<11;i++){
        xdist[i]=arr2[i]*10;
        xdist[i]=Math.abs(xdist[i]);
    }
    return xdist;
}
