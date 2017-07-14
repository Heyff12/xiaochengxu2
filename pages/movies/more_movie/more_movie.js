var util = require('../../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cateTitle: '',
        movies: {},
        requestUrl: '',
        isEmpty: true,
        url_start: 0,
        url_count: 20
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var cate = options.category;
        this.data.cateTitle = cate;
        //获取相应分类数据------------------------------------------------------------------
        var dataUrl = '';
        switch (cate) {
            case "正在热映":
                dataUrl = app.globalData.g_doubanBase + "/v2/movie/in_theaters";
                break;
            case "即将上映":
                dataUrl = app.globalData.g_doubanBase + "/v2/movie/coming_soon";
                break;
            case "Top250":
                dataUrl = app.globalData.g_doubanBase + "/v2/movie/top250";
                break;
        }
        this.data.requestUrl = dataUrl;
        var postdata = {
            'start': this.data.url_start,
            'count': this.data.url_count
        };
        util.http(dataUrl, 'get', postdata, this.processPada);
        wx.showNavigationBarLoading();
    },
    onScrollLower: function() {
        var nextUrl = this.data.requestUrl;
        var postdata = {
            'start': this.data.url_start,
            'count': this.data.url_count
        };
        util.http(nextUrl, 'get', postdata, this.processPada);
        //出现加载动画
        wx.showNavigationBarLoading();
    },
    processPada: function(moviesDouban) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + '...'
            }
            var temp = {
                'title': title,
                'average': subject.rating.average,
                'stars': util.convertToStarsArray(subject.rating.stars),
                'coverageUrl': subject.images.large,
                'movieId': subject.id
            }
            movies.push(temp);
        }
        var totalMovies = [];
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies);
        } else {
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.setData({
            movies: totalMovies
        });
        //开始的数目增加
        this.data.url_start += this.data.url_count;
        //隐藏加载动画
        wx.hideNavigationBarLoading();
        //关闭下拉加载
        wx.stopPullDownRefresh();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        var cate = this.data.cateTitle;
        //设置标题栏内容------------------------------------------------------------------
        wx.setNavigationBarTitle({
            title: cate + '列表'
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        var nextUrl = this.data.requestUrl;
        var postdata = {
            'start': 0,
            'count': this.data.url_count
        };
        //充值开始请求数值
        this.data.url_start = 0;
        this.data.movies = {};
        this.data.isEmpty = true;
        util.http(nextUrl, 'get', postdata, this.processPada);
        //出现加载动画
        wx.showNavigationBarLoading();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
