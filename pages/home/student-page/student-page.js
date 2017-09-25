// pages/home/student-page/student-page.js
import moment from '../../../libs/moment';

Page({
  data: {
    curDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    studentInfo: {},
    commentInfo: {},
  },
  onLoad: function (options) {
    const { gradeId, studentId } = options;
    wx.getStorage({
      key: `grade_${gradeId}_${studentId}`,
      success: (res) => {
        const studentInfo = res.data;
        studentInfo.comment = studentInfo.comment || {};
        this.setData({ studentInfo });
      },
    })
  },
  bindDateChange: function (e) {
    const { studentInfo } = this.data;
    const curDate = e.detail.value;
    const { comment } = studentInfo;
    let commentInfo = [];
    const curComment = comment[curDate] || [];
    curComment.map(value => {
      commentInfo[value] = 1;
    });
    this.setData({
      curDate,
      commentInfo,
    });
  },
  onCommentPress: function (e) {
    const { id } = e.currentTarget.dataset;
    const { curDate, commentInfo } = this.data;
    commentInfo[id] = commentInfo[id] === 1 ? 0 : 1;
    this.setData({ commentInfo });
  },
})