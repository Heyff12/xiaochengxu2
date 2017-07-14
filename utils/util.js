function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function convertToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        } else {
            array.push(0);
        }
    }
    return array;
}

function http(url, method, data, callback) {
    wx.request({
        url: url,
        method: method,
        data: data,
        header: {
            'Content-Type': 'application/xml'
        },
        success: function(res) {
            callback(res.data);
        },
        fail: function() {
            //console.log('fail');
        },
        complete: function() {
            //console.log('complete');
        }
    });
}
module.exports = {
    formatTime: formatTime,
    convertToStarsArray: convertToStarsArray,
    http: http
}
