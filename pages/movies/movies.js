var util = require('../../utils/util.js');
var app = getApp();
Page({
    //异步赋值数据，最好在data付个初始值，避免页面加载时报错--对象未定义
    data: {
        inTheaters: {},
        comingsoon: {},
        top250: {}
    },
    onLoad: function(event) {
        var inTheatersUrl = app.globalData.g_doubanBase + "/v2/movie/in_theaters";
        var comingsoonUrl = app.globalData.g_doubanBase + "/v2/movie/coming_soon";
        var top250Url = app.globalData.g_doubanBase + "/v2/movie/top250";
        this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映');
        this.getMovieListData(comingsoonUrl, 'comingsoon', '即将上映');
        this.getMovieListData(top250Url, 'top250', 'Top250');
    },
    //列表点击更多
    onMoreTap: function(event) {
        var cate = event.currentTarget.dataset.cate;
        wx.navigateTo({
            url: "more_movie/more_movie?category=" + cate
        });
    },
    getMovieListData: function(url, name, bank_title) {
        var _this = this;
        wx.request({
            url: url,
            data: {
                'start': 0,
                'count': 3
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/xml'
            },
            success: function(res) {
                //console.log(res);
                _this.processPada(res.data, name, bank_title);
            },
            fail: function() {
                //console.log('fail');
            },
            complete: function() {
                //console.log('complete');
                // console.log(name);
                // console.log(_this.data.name);
            }
        });
    },
    processPada: function(moviesDouban, name, bank_title) {
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
        var readyData = {};
        readyData[name] = {
            categoryTitle: bank_title,
            movies: movies
        };
        this.setData(readyData);
    }
})
