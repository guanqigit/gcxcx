var util = require('../../utils/util.js');  
var app = getApp();
var pages = 0;
Page({
  data: {
    list: [],
    pageindex: 0,
    pagesize: 10,
    searchName: '',
    code:0
  },
  //搜索
  search: function (e) {
    var that = this;
    that.setData({
      searchName: e.detail.value
    })
  },
  searchs: function () {
    var that = this;
    that.setData({
      pageindex: 0,
      searchName: that.data.searchName
    })
    that.onLoad();
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  gobackdate: function () {
    // wx.redirectTo({
    //   url: '../usedmachinery/usedmachinery?id=' + this.data.id + '&&name=' + this.data.name,
    // })
    wx.navigateBack()
  },
  onShow: function () {
    var that = this;
    if (that.data.code > 0) {
      that.onLoad(that.data.options);
    } else {
      that.setData({
        code: that.data.code + 1
      })
    }
  },
  onLoad: function (options) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 2000
    })
    var that = this;
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    wx.request({
      url: app.globalData.apiUrl.WcgclcGetList,
      data: {
        site_id: options.id,
        openId: app.globalData.openid,
        pageIndex: that.data.pageindex,
        pageSize: that.data.pagesize
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        var list = [];
        if (that.data.pageindex == 0) {
          list = res.data.list;

        } else {
          list = that.data.list;
          for (var i = 0; i < res.data.list.length; i++) {
            list.push(res.data.list[i])
          }
        }
        that.setData({
          list: list,
          unmber: res.data.totalCount,
          id:options.id,
          name:options.name,
          options:options
        })
      },
      fail: function () {
        wx.showToast({
          title: '加载失败',
          image: '../../image/chacha.png',
          duration: 2000
        })
      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.shares,
      path: 'pages/index/index',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },
  //上拉加载
  onReachBottom: function () {
    var that = this;
    that.data.pageindex += 1;
    that.onLoad();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.data.pageindex = 0;
    that.onLoad();
  },
  goInfo(e) {
    var that = this;
    wx.navigateTo({
      url: '../details4/details4?id=' + e.currentTarget.dataset.id+'&ids='+that.data.id+'&name='+that.data.name ,
    })
  },
  //
  addnew:function(){
    wx.navigateTo({
      url: '../add3/add3?id=' + this.data.id + '&&name=' + this.data.name,
    })
  },
  //添加
  add: function () {
    wx.request({
      url: app.globalData.apiUrl.functionOpenApi,
      data: {
        openid: app.globalData.openid,
        icon_id:1
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.navigateTo({
            url: '../businesscooperation/businesscooperation',
          })
         
        }
        if (res.data.code == -1) {
          wx.showToast({
            title: res.data.msg,
            image: '../../image/chacha.png'
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../zhuce/zhuce'
            })
          }, 1000)
        }
        if (res.data.code == -2) {
          wx.showToast({
            title: res.data.msg,
            image: '../../image/chacha.png'
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../manaddress/manaddress'
            })
          }, 1000)
        }
      },
      fail: function () {

      },
      complete: function () {

      }
    })

  },
})