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
        this.setData({ gradeInfos: res.data, gradeOptions, studentInfos });
      }
    });
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

    this.setData({
      studentInfos,
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
      url: `student-page/student-page?gradeId=${id}&studentId=${studentId}`,
    });
  },
})