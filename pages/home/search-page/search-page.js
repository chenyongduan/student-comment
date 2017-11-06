// pages/home/search-page/search-page.js
Page({
  data: {
    curStudentInfo: {},
    searchOptions: ["sdf", "qwrwer"],
  },
  studentInfos: [],
  inputValue: '',
  onLoad: function (options) {
    wx.getStorage({
      key: 'grade',
      success: (res) => {
        const studentInfos = [];
        res.data.map((gredeInfo) => {
          const { id, studentIds } = gredeInfo;
          studentIds.map(studentId => {
            try {
              var value = wx.getStorageSync(`grade_${id}_${studentId}`);
              if (value) {
                studentInfos.push(value);
              }
            } catch (e) {
              // Do something when catch error
            }
          });
        });
        this.studentInfos = studentInfos;
      }
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