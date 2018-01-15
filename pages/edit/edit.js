// pages/edit/edit.js

const app = getApp();

Page({
  data: {
    gradeOptions: [],
    gradeInfos: [],
    gradeIndex: 0,
    studentInfos: [],
    commentInfos: [],
    curStudent: {},
    ADD_INDEX: 999,
  },
  studentInput: '',
  onLoad: function (options) {
    const gradeIndex = app.globalData.homeGradeIndex;
    this.setData({ gradeIndex });
    wx.getStorage({
      key: 'grade',
      success: (res) => {
        const gradeOptions = res.data.map(value => value.name);
        const { id, studentIds } = res.data[gradeIndex];
        const studentInfos = [];
        studentIds.map(studentId => {
          try {
            var value = wx.getStorageSync(`grade_${id}_${studentId}`);
            if (value) {
              studentInfos.push(value);
            }
          } catch (e) {}
        });
        this.setData({ gradeInfos: res.data, gradeOptions, studentInfos });
      }
    });
    wx.getStorage({
      key: 'comment',
      success: (res) => {
        this.setData({ commentInfos: res.data });
      },
    });
    
    app.setEditChangeGradeCallback(this.changeGradeByIndex);
  },
  bindGradeChange: function (e) {
    const index = e.detail.value;
    this.changeGradeByIndex(index);
  },
  changeGradeByIndex: function (index) {
    const { gradeInfos } = this.data;
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
    console.warn('========app', studentInfos, index)
    this.setData({
      studentInfos,
      gradeIndex: index,
    });
  },
  onStudentButtonClick: function (e) {
    const { dataset } = e.currentTarget;
    if (dataset.type === 'grade') {
      dataset.title = '班级';
    } else if (dataset.type === 'comment') {
      dataset.title = '评语';
    } else {
      dataset.title = '学生';
    }
    this.studentInput = '';
    this.setData({ curStudent: dataset });
  },
  bindStudentInput: function (e) {
    const { value } = e.detail;
    this.studentInput = value;
  },
  onModalClose: function (e) {
    this.setData({ curStudent: {} });
  },
  onStudentDelete: function (e) {
    const { curStudent, studentInfos, gradeInfos, commentInfos, gradeIndex } = this.data;
    const { index, type, id } = curStudent;
    let name = '';
    if (type === 'grade') {
      name = gradeInfos[index].name;
    } else if (type === 'comment') {
      name = commentInfos[index].name;
    } else {
      name = studentInfos[index].name;
    }
    wx.showModal({
      title: '提示',
      content: `确定要删除 ${name} ?`,
      success: (res) => {
        if (res.confirm) {
          if (type === 'grade') {
            gradeInfos.splice(index, 1);
            const gradeOptions = gradeInfos.map(value => value.name);
            const gradeIndex = 0;
            this.data.gradeInfos = gradeInfos;
            this.bindGradeChange({ detail: { value: gradeIndex } });
            this.setData({
              gradeInfos,
              gradeOptions,
              gradeIndex,
              curStudent: {},
            });
            wx.setStorage({
              key: 'grade',
              data: gradeInfos,
            });
          } else if (type === 'comment') {
            commentInfos.splice(index, 1);
            this.setData({
              commentInfos,
              curStudent: {},
            });
            wx.setStorage({
              key: 'comment',
              data: commentInfos,
            });
          } else {
            const curGradeInfo = gradeInfos[gradeIndex];
            studentInfos.splice(index, 1);
            this.setData({ studentInfos, curStudent: {} });
            const studentIndex = curGradeInfo.studentIds.indexOf(id);
            curGradeInfo.studentIds.splice(studentIndex, 1);
            wx.setStorage({
              key: 'grade',
              data: gradeInfos,
            });
            wx.removeStorage({
              key: `grade_${curGradeInfo.id}_${id}`,
            });
          }
        }
      }
    });
  },
  onStudentSave: function (e) {
    const {
      curStudent,
      studentInfos,
      gradeInfos,
      commmentInfos,
      gradeIndex,
      ADD_INDEX,
    } = this.data;
    const { name, index, type } = curStudent;
    if (this.studentInput === '') {
      if (name === '添加') {
        wx.showToast({
          title: '名字为空',
        });
      }
      return;
    }
    if (this.studentInput === name) {
      this.setData({ curStudent: {} });
      return;
    }
    let isSame = false;
    if (type === 'grade') {
      gradeInfos.map(value => {
        if (value.name === this.studentInput) {
          isSame = true;
        }
      });
    } else {
      studentInfos.map(value => {
        if (value.name === this.studentInput) {
          isSame = true;
        }
      });
    }
    if (isSame) {
      wx.showModal({
        title: '提示',
        content: '名字已被占用',
        showCancel: false,
      });
      return;
    }
    if (index === ADD_INDEX) {
      this.addValue();
    } else {
      this.changeValue();
    }
  },
  addValue: function () {
    const {
      curStudent,
      studentInfos,
      gradeInfos,
      commentInfos,
      gradeIndex,
    } = this.data;
    const { type } = curStudent;
    if (type === 'grade') {
      let lastId = 0;
      gradeInfos.map(value => {
        if (value.id > lastId) {
          lastId = value.id;
        }
      });
      gradeInfos.push({
        id: lastId + 1,
        name: this.studentInput,
        studentIds: [],
      });
      const gradeOptions = gradeInfos.map(value => value.name);
      this.setData({
        gradeInfos,
        gradeOptions,
        curStudent: {},
      });
      wx.setStorage({
        key: 'grade',
        data: gradeInfos,
      });
    } else if (type === 'comment') {
      let lastId = 0;
      commentInfos.map(value => {
        if (value.id > lastId) {
          lastId = value.id;
        }
      });
      commentInfos.push({
        id: lastId + 1,
        name: this.studentInput,
      });
      this.setData({
        commentInfos,
        curStudent: {},
      });
      wx.setStorage({
        key: 'comment',
        data: commentInfos,
      });
    } else {
      const curGradeInfo = gradeInfos[gradeIndex];
      let lastId = 0;
      curGradeInfo.studentIds.map(value => {
        if (value > lastId) {
          lastId = value;
        }
      });
      lastId += 1;
      curGradeInfo.studentIds.push(lastId);
      wx.setStorage({
        key: 'grade',
        data: gradeInfos,
      });
      const studentInfo = { id: lastId, name: this.studentInput };
      studentInfos.push(studentInfo);
      wx.setStorage({
        key: `grade_${curGradeInfo.id}_${lastId}`,
        data: studentInfo,
      });
      this.setData({
        studentInfos,
        curStudent: {},
      });
    }
  },
  changeValue: function () {
    const {
      curStudent,
      studentInfos,
      gradeInfos,
      commentInfos,
      gradeIndex,
    } = this.data;
    const { type, index } = curStudent;
    if (type === 'grade') {
      if (gradeInfos[index].name === this.studentInput) {
        this.setData({ curStudent: {} });
        return;
      }
      gradeInfos[index].name = this.studentInput;
      const gradeOptions = gradeInfos.map(value => value.name);
      this.setData({
        gradeInfos,
        gradeOptions,
        curStudent: {},
      });
      wx.setStorage({
        key: 'grade',
        data: gradeInfos,
      });
    } else if (type === 'comment') {
      if (commentInfos[index].name === this.studentInput) {
        this.setData({ curStudent: {} });
        return;
      }
      commentInfos[index].name = this.studentInput;
      this.setData({
        commentInfos,
        curStudent: {},
      });
      wx.setStorage({
        key: 'comment',
        data: commentInfos,
      });
    } else {
      const studentInfo = studentInfos[index];
      if (studentInfo.name === this.studentInput) {
        this.setData({ curStudent: {} });
        return;
      }
      const curGradeInfo = gradeInfos[gradeIndex];
      studentInfos[index].name = this.studentInput;
      wx.setStorage({
        key: `grade_${curGradeInfo.id}_${studentInfo.id}`,
        data: studentInfo,
      });
      this.setData({
        studentInfos,
        curStudent: {},
      });
    }
  },
})