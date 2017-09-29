//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const APP_ID = 'wx5165f84d4d40b934';
        const SECRET_ID = 'e0e2129f18911c1cd8124a993fe16b22';
        var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + APP_ID + '&secret=' + SECRET_ID + '&js_code=' + res.code + '&grant_type=authorization_code';
        wx.request({
          url: l,
          method: 'GET',
          success: (res) => {
            this.globalData.openId = res.data.openid;
          },
        });  
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
            
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openId: 0,
  }
})