var app = getApp();
var tcity = require("../../utils/citys.js");
var timer = require("../../utils/util.js");
Page({
  data: {
    pics: [],
    date: 'null',
    mcxh: '',
    jxdj: '',
    sybw: '',
    bz: '',
    gg: '',
    multiIndex: [0, 0],
    multiArray: [[], []],
    objectMultiArray: []
  },
  remove: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.pics.splice(index, 1)
    this.setData({
      pics: this.data.pics
    })
  },
  bindMultiPickerChange: function (e) {
    console.log(156345)
    this.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
      part_id: this.data.list[e.detail.value[0]].list[e.detail.value[1]].Id
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var that = this;
    var data = that.data.list;
    switch (e.detail.column) {
      case 0:
        var arraydata = [];
        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
          if (that.data.objectMultiArray[i].part_id == data[e.detail.value].Id) {
            arraydata.push(that.data.objectMultiArray[i].part_name)
          }
        }
        that.setData({
          "multiArray[1]": [],
        }, function () {
          that.setData({
            "multiArray[1]": arraydata,
            "multiIndex[0]": e.detail.value,
            "multiIndex[1]": 0
          })
        })

    }
  },
  //项目名称
  name: function (e) {
    var that = this;
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        mcxh: e.detail.value
      })
    }
    if (e.currentTarget.dataset.id == 2) {
      this.setData({
        jxdj: e.detail.value
      })
    }
    if (e.currentTarget.dataset.id == 3) {
      this.setData({
        sybw: e.detail.value
      })
    }
    if (e.currentTarget.dataset.id == 4) {
      this.setData({
        bz: e.detail.value
      })
    } if (e.currentTarget.dataset.id == 5) {
      this.setData({
        gg: e.detail.value
      })
    }
  },
  uploadimg: function () {//这里是选取图片的方法
    var that = this;
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length; i++) {
          that.un(tempFilePaths[i])
        }
      }
    })
  },
  un: function (data) {
    var that = this;
    var pics = that.data.pics
    wx.uploadFile({
      url: app.globalData.apiUrl.UploadImageApi,
      filePath: data,//临时路径
      name: 'fileName',
      formData: {
        'user': 'test'
      },
      success: function (res) {
        console.log(res.data)
        var data = res.data;
        if (data != undefined) {
          pics.push(data)
        }
        that.setData({
          pics: pics
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '上传失败，请重新上传',
          image: '../../image/chacha.png'
        })
      },
      complete: function () {
      }
    })
  },
  //使用时间
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  submit: function () {
    var that = this;
    var mechanical_name = that.data.mcxh;
    var mechanical_usageTime = that.data.date;
    var mechanical_unitPrice = that.data.jxdj;
    var mechanical_Part = that.data.sybw;
    var mechanical_remarks = that.data.bz;
    var mechanical_count = that.data.gg;
    var mechanical_model = that.data.gg;

    var imgs = that.data.pics;
    if (mechanical_name == '') {
      wx.showToast({
        title: '信息不完整',
        image: '../../image/chacha.png'
      })
      return;
    } else {
      wx.showLoading({
        title: '正在提交',
      })
      wx.request({
        url: app.globalData.apiUrl.add1,
        data: {
          openid: app.globalData.openid,
          mechanical_name: mechanical_name,
          mechanical_usageTime: mechanical_usageTime,
          mechanical_unitPrice: mechanical_unitPrice,
          mechanical_Part: mechanical_Part,
          mechanical_remarks: mechanical_remarks,
          mechanical_count: mechanical_count,
          mechanical_model: mechanical_model,
          images: imgs,
          site_id: that.data.id
        },
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          wx.hideLoading();
          wx.showToast({
            title: '添加成功',
            icon: "success"
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../allorders/allorders?id=' + that.data.id + '&type=1',
            })
          }, 1000)
        }, fail: function () {
          wx.showToast({
            title: '添加失败',
            image: "../../image/chacha.png"
          })
        },
        complete: function () {

        }
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id,
      date: (timer.formatTime(new Date()).split(" "))[0]
    })
    wx.request({
      url: app.globalData.apiUrl.GetEquipmentType,
      data: {},
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          that.data.multiArray[0].push([res.data.data[i].name])
          for (var s = 0; s < res.data.data[i].list.length; s++) {
            that.data.objectMultiArray.push({
              'id': res.data.data[i].list[s].Id,
              'part_name': res.data.data[i].list[s].name,
              'part_id': res.data.data[i].Id
            })
          }
        }
        for (var i = 0; i < res.data.data[0].list.length; i++) {
          that.data.multiArray[1].push([res.data.data[0].list[i].name])
        }
        that.setData({
          multiArray: that.data.multiArray,
          objectMultiArray: that.data.objectMultiArray,
          list: res.data.data,
          part_id: res.data.data[0].list[0].Id
        })
      }, fail: function () {

      },
      complete: function () {

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
  }
})