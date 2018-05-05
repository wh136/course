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
function getCircleNumber(F) {
    var force = arrayInit(1,7,'int');
    var D=0;
    var N1=0;
    for (var i=0;i<7;i++){
        D = (i+1)*2;
        N1 = -2 * F / D / Math.PI;
        N1 = N1.toFixed(3);
        N1 = N1+'kPa';
        force[0][i] = N1;
    }
    return force;
}

