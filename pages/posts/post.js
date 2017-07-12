var postsData = require('../../data/posts-data.js');//相对路径
//var postsData = require('/data/posts-data.js');//绝对路径不可以,猜测是因为data文件夹不是模板原有的内容
Page({
    data: {

    },
    onLoad: function(options) {
        //console.log('onLoad');
        this.setData({
            postList: postsData.postList
        });
    },
    // onReady: function() {
    //     //console.log('onReady');
    // },
    // onShow: function() {
    //     //console.log('onShow');
    // },
    // onHide: function() {
    //     //console.log('onHide');
    // },
    // onUnload: function() {
    //     //console.log('onUnload');
    // }
});
