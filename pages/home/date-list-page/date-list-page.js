// pages/home/date-list-page/date-list-page.js
const { wxPromise } = require("../../../utils/util.js");

Page({
  data: {
    dateInfo: [],
    gradeName: '',
    commentName: '',
    studentName: '',
  },
  onLoad: function (options) {
    const { commentId, gradeId, studentId } = options;
    this.options = options;
    wxPromise(wx.getStorage, { key: 'grade' }).then((res) => {
      const studentInfos = [];
      res.data.map((gredeInfo) => {
        const { id, name } = gredeInfo;
        if (Number(gradeId) === id) {
          this.setData({ gradeName: name });
        }
      });
    });
    wxPromise(wx.getStorage, { key: 'comment' }).then((res) => {
      const commentOptions = [];
      res.data.map((commentInfo) => {
        const { id, name } = commentInfo;
        if (Number(commentId) === id) {
          this.setData({ commentName: name });
        }
      });
      this.setData({ commentOptions });
    });
    try {
      var value = wx.getStorageSync(`grade_${gradeId}_${studentId}`);
      if (value) {
        if (value.comment) {
          const dateInfo = [];
          const commentKeys = Object.keys(value.comment);
          commentKeys.map((key) => {
            const ret = value.comment[key].findIndex((id) => { return id === commentId });
            if (ret !== -1) {
              dateInfo.push(key);
            }
          });
          this.setData({ dateInfo });
        }
        this.setData({ studentName: value.name });
      }
    } catch (e) { }
  },
  onDateClick: function (e) {
    const { gradeId, studentId } = this.options;
    const { datename } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/home/student-page/student-page?gradeId=${gradeId}&studentId=${studentId}&dateName=${datename}`,
    });
  }
})