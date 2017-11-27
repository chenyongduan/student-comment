// pages/home/search-page/search-page.js
const { wxPromise } = require("../../../utils/util.js");

Page({
  data: {
    curStudentInfo: {},
    searchOptions: [],
    commentOptions: [],
  },
  studentInfos: [],
  inputValue: '',
  onLoad: function (options) {
    wxPromise(wx.getStorage, { key: 'grade' }).then((res) => {
      const studentInfos = [];
      res.data.map((gredeInfo) => {
        const { id, studentIds } = gredeInfo;
        studentIds.map(studentId => {
          try {
            var value = wx.getStorageSync(`grade_${id}_${studentId}`);
            if (value) {
              studentInfos.push(value);
            }
          } catch (e) {}
        });
      });
      console.error(studentInfos)
      this.studentInfos = studentInfos;
    });
    wxPromise(wx.getStorage, { key: 'comment' }).then((res) => {
      const commentOptions = [];
      res.data.map((value) => {
        commentOptions.push(value);
      });
      this.setData({ commentOptions });
    });
  },
  bindSearchInput: function (e) {
    this.inputValue = e.detail.value;
  },
  onSearchClick: function (e) {
    if (this.inputValue === '') return;
    for (let i = 0; i < this.studentInfos.length; i += 1) {
      if (this.studentInfos[i].name === this.inputValue) {
        console.warn(this.studentInfos[i])
        this.setData({ curStudentInfo: this.studentInfos[i] });
        break;
      }
    }
  }
})