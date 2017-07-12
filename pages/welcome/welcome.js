Page({
    test_maopao: function() {
        //console.log('测试是否执行冒泡-4444,catchtap阻止冒泡');
    },
    goto_list: function(event) {
        //console.log(event);
        // wx.navigateTo({
        //     url: "../posts/post",
        //     success: function(res) {},
        //     fail: function() {},
        //     complete: function() {},
        // }); //跳转页面出现返回,跳转时执行onHide
        wx.redirectTo({
        	url: "/pages/posts/post"
        });//跳转页面不会出现返回,跳转时执行onUnload
    },
    // onHide: function() {
    //     console.log('onHide');
    // },
    // onUnload: function() {
    //     console.log('onUnload');
    // }
});
