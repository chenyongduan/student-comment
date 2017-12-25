// pages/home/date-search-page/date-search-page.js
import moment from '../../../libs/moment';
const { wxPromise } = require("../../../utils/util.js");

Page({
  data: {
    curDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    searchStudentInfo: [],
  },
  studentInfos: [],
  onLoad: function (options) {
    const { date } = options;
    wxPromise(wx.getStorage, { key: 'grade' }).then((res) => {
      const studentInfos = [];
      res.data.map((gredeInfo) => {
        const { id, studentIds } = gredeInfo;
        studentIds.map(studentId => {
          try {
            var value = wx.getStorageSync(`grade_${id}_${studentId}`);
            if (value) {
              value.gradeId = id;
              studentInfos.push(value);
            }
          } catch (e) { }
        });
      });
      this.studentInfos = studentInfos;
      this.searchByDate(date);
    });
  },
  searchByDate: function (date) {
    if (this.studentInfos.length === 0) return;
    this.setData({ curDate: date });
    const searchStudentInfo = [];
    this.studentInfos.map((studentInfo) => {
      if (studentInfo.comment && studentInfo.comment[date]) {
        const curStudentInfo = {};
        curStudentInfo.id = studentInfo.id;
        curStudentInfo.name = studentInfo.name;
        curStudentInfo.gradeId = studentInfo.gradeId;
        searchStudentInfo.push(curStudentInfo);
      }
    });
    this.setData({ searchStudentInfo });
  },
  bindDateChange: function (e) {
    const curDate = e.detail.value;
    this.searchByDate(curDate);
  },
  onResultItemClick: function (e) {
    const { curDate } = this.data;
    const { gradeid, studentid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/home/student-page/student-page?gradeId=${gradeid}&studentId=${studentid}&dateName=${curDate}`,
    });
  },
})