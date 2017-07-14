var postsData = require('../../../data/posts-data.js'); //相对路径
var app = getApp() //相对路径
Page({
    data: {
        post_Id: '',
        post_detail: {},
        isPlaying: false
    },
    onLoad: function(option) {
        var _this = this;
        var globaldata = app.globalData; //获取全局变量
        var postId = option.id;
        var postData = postsData.postList[postId];
        //获取post_id的全局值  以及  文章内容信息------------------------------------------
        this.data.post_Id = postId;
        this.data.post_detail = postData;
        this.setData({
            postData: postData
        });
        //设置标题栏内容------------------------------------------------------------------
        wx.setNavigationBarTitle({
            title: postsData.postList[postId].title
        });
        //判断文章是否已收藏------------------------------------------------------------------
        var postsCollected = wx.getStorageSync('post_Collected');
        if (postsCollected) {
            this.setData({
                collected: postsCollected[postId]
            });
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('post_Collected', postsCollected);
        }
        //全局变量-音乐是否在播放(当前音乐id是否相同)-----------------------------------------
        if (app.globalData.g_isplaying && app.globalData.g_currentMusicId === postId) {
            this.setData({
                isPlaying: true
            })
        }
        this.setMusicMonitor();
    },
    //监听音乐播放暂停、结束
    setMusicMonitor: function() {
        var _this = this;
        wx.onBackgroundAudioPlay(function() {
            _this.setData({
                isPlaying: true
            });
            app.globalData.g_isplaying = true;
            app.globalData.g_currentMusicId = _this.data.post_Id;
        });
        wx.onBackgroundAudioPause(function() {
            _this.setData({
                isPlaying: false
            });
            app.globalData.g_isplaying = false;
            app.globalData.g_currentMusicId = _this.data.null;
        });
        wx.onBackgroundAudioStop(function(){
            _this.setData({
                isPlaying: false
            });
            app.globalData.g_isplaying = false;
            app.globalData.g_currentMusicId = _this.data.null;
        });
    },
    onCollectionTap: function(event) {
        var postsCollected = wx.getStorageSync('post_Collected');
        var postCollected = postsCollected[this.data.post_Id];
        //收藏与为收藏转换
        postCollected = !postCollected;
        postsCollected[this.data.post_Id] = postCollected;
        //this.showModal(postsCollected, postCollected);
        this.showToast(postsCollected, postCollected);
    },
    showModal: function(postsCollected, postCollected) {
        var _this = this;
        wx.showModal({
            title: '收藏',
            content: postCollected ? "收藏该文章" : "取消收藏该文章",
            showCancle: 'true',
            cancelText: '取消',
            cancelColor: '#333',
            confirmText: '确认',
            confirmColor: '#405f80',
            success: function(res) {
                if (res.confirm) {
                    //console.log('用户点击确定');
                    //更新收藏缓存值
                    wx.setStorageSync('post_Collected', postsCollected);
                    //collected的值的更改
                    _this.setData({
                        collected: postCollected
                    });
                } else if (res.cancel) {
                    //console.log('用户点击取消');
                }
            }
        });
    },
    showToast: function(postsCollected, postCollected) {
        //更新收藏缓存值
        wx.setStorageSync('post_Collected', postsCollected);
        //collected的值的更改
        this.setData({
            collected: postsCollected[this.data.post_Id]
        });
        //提示
        // var toast_title, toast_icon;
        // if (postCollected) {
        //     toast_title = "收藏成功！";
        //     toast_icon = 'success';
        // } else {
        //     toast_title = "已取消收藏！";
        //     toast_icon = 'success';
        // }
        // wx.showToast({
        //     title: toast_title,
        //     icon: toast_icon,
        //     duration: 2000
        // });
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消收藏成功",
            icon: 'success',
            duration: 2000
        });
    },
    onShareTap: function(event) {
        //wx.removeStorageSync('key');
        var itemzu = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到微博",
            "分享到qq"
        ];
        wx.showActionSheet({
            itemList: itemzu,
            itemColor: '#405f80',
            success: function(res) {
                //res.cancle点击取消
                // console.log(res.tapIndex); //点击序号
                if (res.tapIndex >= 0) {
                    wx.showModal({
                        title: "用户" + itemzu[res.tapIndex],
                        content: ""
                    });
                }

            }
        });
    },
    //转发给朋友
    onShareAppMessage: function(res) {
        var data = this.data.post_detail;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: data.title,
            path: '/pages/posts/post-detail/post-detail?id=' + data.postId,
            success: function(res) {
                // 转发成功
                console.log('转发成功' + res);
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
    onMusicTap: function(event) {
        var data = this.data.post_detail;
        var isPlayingMusic = this.data.isPlaying;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlaying: false
            });
        } else {
            wx.playBackgroundAudio({
                dataUrl: data.music.url,
                title: data.music.title,
                coverImgUrl: data.music.coverImg
            });
            this.setData({
                isPlaying: true
            });
        }

    }
});
