// pages/home/home.js

import moment from '../../libs/moment';

Page({
  data: {
    gradeOptions: [],
    gradeInfos: [],
    gradeIndex: 0,
    studentInfos: [],
    curIndex: null,
  },
  onLoad: function (options) {
    wx.getStorage({
      key: 'grade',
      success: (res) => {
        const gradeOptions = res.data.map(value => value.name);
        const { id, studentIds } = res.data[0];
        const studentInfos = [];
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
        this.setData({ gradeInfos: res.data, gradeOptions });
        this.calcTotalComment(studentInfos);
      }
    });
  },
  calcTotalComment: function (studentInfos) {
    studentInfos.map((studentInfo) => {
      const totalComment = {};
      const comment = studentInfo.comment || {};
      const commentKeys = Object.keys(comment);
      commentKeys.map((commentKey) => {
        comment[commentKey].map((id) => {
          totalComment[id] = totalComment[id] || 0;
          totalComment[id] += 1;
        });
      });
      console.warn(totalComment)
      studentInfo.totalComment = totalComment;
    });
    this.setData({ studentInfos });
  },
  bindGradeChange: function (e) {
    const { gradeInfos } = this.data;
    const index = e.detail.value;
    const { id, studentIds } = gradeInfos[index];
    const studentInfos = [];
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

    this.calcTotalComment(studentInfos);
    this.setData({
      gradeIndex: index,
      curIndex: null,
    });
  },
  onStudentButtonClick: function (e) {
    const { index } = e.currentTarget.dataset;
    if (index === this.data.curIndex) {
      this.setData({ curIndex: null });
      return;
    }
    this.setData({ curIndex: index });
  },
  onStudentDetailClick: function (e) {
    const { index } = e.currentTarget.dataset;
    const { gradeInfos, gradeIndex, studentInfos } = this.data;
    const { id } = gradeInfos[gradeIndex];
    const studentId = studentInfos[index].id;
    wx.navigateTo({
      url: `student-page/student-page?gradeId=${id}&studentId=${studentId}&index=${index}`,
    });
  },
  onAddStudentClick: function (e) {
    wx.switchTab({
      url: '../edit/edit',
    });
  },
  refreshStudentInfos: function (index, studentInfo) {
    const { studentInfos } = this.data;
    console.warn(this)
    if (studentInfos[index]) {
      studentInfos[index] = studentInfo;
    }
    this.calcTotalComment(studentInfos);
  },
})