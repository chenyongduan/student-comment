// pages/home/student-page/student-page.js
import moment from '../../../libs/moment';

Page({
  data: {
    curDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    studentInfo: {},
    commentInfo: {},
    commentOptions: [],
  },
  gradeId: 0,
  studentId: 0,
  index: null,
  onLoad: function (options) {
    const { gradeId, studentId, index, dateName } = options;
    let { curDate } = this.data;
    if (dateName) {
      this.setData({ curDate: dateName });
      curDate = dateName;
    }
    this.gradeId = gradeId;
    this.studentId = studentId;
    this.index = index;
    wx.getStorage({
      key: `grade_${gradeId}_${studentId}`,
      success: (res) => {
        const studentInfo = res.data;
        studentInfo.comment = studentInfo.comment || {};
        const curComment = studentInfo.comment[curDate] || [];
        this.setData({ studentInfo });
        this.refreshCommentInfo(curComment);
      },
    });
    wx.getStorage({
      key: 'comment',
      success: (res) => {
        const commentOptions = res.data;
        this.setData({ commentOptions });
      },
    });
  },
  onUnload: function () {
    const { studentInfo } = this.data;
    if (this.index === null || this.index === undefined) return;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    if (prevPage) {
      prevPage.refreshStudentInfos(this.index, studentInfo);
    }
  },
  refreshCommentInfo: function (curComment) {
    let commentInfo = [];
    curComment.map(value => {
      commentInfo[value] = 1;
    });
    this.setData({
      commentInfo,
    });
  },
  bindDateChange: function (e) {
    const { studentInfo } = this.data;
    const curDate = e.detail.value;
    const { comment } = studentInfo;
    const curComment = comment[curDate] || [];
    this.refreshCommentInfo(curComment);
    this.setData({ curDate });
  },
  onCommentPress: function (e) {
    const { id } = e.currentTarget.dataset;
    const { curDate, commentInfo } = this.data;
    commentInfo[id] = commentInfo[id] === 1 ? 0 : 1;
    this.setData({ commentInfo });
    this.saveComment(commentInfo);
  },
  saveComment: function (commentInfo) {
    const { curDate, studentInfo } = this.data;
    const keys = Object.keys(commentInfo);
    const newComment = [];
    keys.map((key) => {
      if (commentInfo[key] === 1) {
        newComment.push(key);
      }
    });
    studentInfo.comment[curDate] = newComment;
    wx.setStorage({
      key: `grade_${this.gradeId}_${this.studentId}`,
      data: studentInfo,
      fail: () => {
        wx.showModal({
          title: '错误',
          content: '保存失败',
          showCancel: false,
        });
      }
    });
  },
})