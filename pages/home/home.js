// pages/home/home.js
import moment from '../../libs/moment';
import { wxRequest } from '../../utils/wx-request';
import { uploadStudent } from '../../server-api/index';

const app = getApp();

Page({
  data: {
    gradeOptions: [],
    gradeInfos: [],
    gradeIndex: 0,
    commentOptions: [],
    studentInfos: [],
    curIndex: null,
    gradeId: null,
  },
  onLoad: function (options) {
    this.refresh();
    app.setRefreshHomeCallback(this.refresh);
  },
  onShow: function () {
    this.refresh();
  },
  refresh: function () {
    wx.getStorage({
      key: 'grade',
      success: (res) => {
        if (res.data && res.data.length === 0) {
          this.setData({ gradeInfos: [] });
          return;
        }
        const { gradeIndex } = this.data;
        const gradeOptions = res.data.map(value => value.name);
        const { id, studentIds } = res.data[gradeIndex];
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
        this.setData({ gradeInfos: res.data, gradeId: id, gradeOptions });
        this.calcTotalComment(studentInfos);
      }
    });
    const commentOptions = this.getComment();
    this.setData({ commentOptions });
  },
  getComment: function () {
    try {
      var value = wx.getStorageSync('comment')
      if (value) {
        return value;
      }
    } catch (e) {
      return [];
    }
  },
  uploadStudentInfo: function () {
    wx.getStorage({
      key: 'grade',
      success: (res) => {
        const contentInfos = [];
        const commentOptions = this.getComment();
        res.data.map((gredeInfo) => {
          const { id, studentIds } = gredeInfo;
          studentIds.map(studentId => {
            try {
              var studentInfo = wx.getStorageSync(`grade_${id}_${studentId}`);
              if (studentInfo) {
                const contentInfo = [];
                contentInfo.push(studentInfo.name);
                contentInfo.push(gredeInfo.name);
                const totalComment = {};
                const comment = studentInfo.comment || {};
                const commentKeys = Object.keys(comment);
                commentKeys.map((commentKey) => {
                  comment[commentKey].map((id) => {
                    totalComment[id] = totalComment[id] || 0;
                    totalComment[id] += 1;
                  });
                });
                for (let i = 0; i < commentOptions.length; i += 1) {
                  const curCount = totalComment[String(i)] || 0;
                  contentInfo.push(String(curCount));
                }
                contentInfos.push(contentInfo);
              }
            } catch (e) {
              // Do something when catch error
            }
          });
        });
        const header = [
          {
            caption: '姓名',
            type: 'string',
          },
          {
            caption: '班级',
            type: 'string',
          },
          {
            caption: commentOptions[0],
            type: 'string',
          },
          {
            caption: commentOptions[1],
            type: 'string',
          },
          {
            caption: commentOptions[2],
            type: 'string',
          }];
        const uploadInfo = {};
        uploadInfo.cols = header;
        uploadInfo.rows = contentInfos;
        const jsonInfo = JSON.stringify(uploadInfo);
        setTimeout(() => {
          wxRequest(uploadStudent(App.globalData.openId, jsonInfo));
        }, 3000);
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
      } catch (e) {}
    });

    this.calcTotalComment(studentInfos);
    this.setData({
      gradeIndex: index,
      gradeId: id,
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
    const { gradeIndex } = this.data;
    app.globalData.homeGradeIndex = gradeIndex;
    app.editChangeGrade(gradeIndex);
    wx.switchTab({
      url: '../edit/edit',
    });
  },
  refreshStudentInfos: function (index, studentInfo) {
    const { studentInfos } = this.data;
    if (studentInfos[index]) {
      studentInfos[index] = studentInfo;
    }
    this.calcTotalComment(studentInfos);
  },
  onSearchClick: function () {
    wx.navigateTo({
      url: 'search-page/search-page',
    });
  },
  onDateSearchClick: function () {
    wx.navigateTo({
      url: `/pages/home/date-search-page/date-search-page`,
    });
  },
  onCommentButtonClick: function (e) {
    const { commentid, gradeid, studentid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/home/date-list-page/date-list-page?gradeId=${gradeid}&studentId=${studentid}&commentId=${commentid}`,
    });
  },
})
