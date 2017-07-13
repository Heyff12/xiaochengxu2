//app.js
App({
    onLaunch: function() {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
    },

    getUserInfo: function(cb) {
        var that = this
        if (this.globalData.userInfo) {
            console.log('******111111111*********');
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            console.log('******222222222*********');
            //调用登录接口
            wx.getUserInfo({
                withCredentials: false,
                success: function(res) {
                    console.log('******333333333*********' + res.userInfo.toString());
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    },

    globalData: {
        userInfo: null,
        g_isplaying: false,//音乐是否在播放
        g_currentMusicId: null//那个音乐id在播放
    }
})
