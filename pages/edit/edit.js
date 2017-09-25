// pages/edit/edit.js
Page({
  data: {
    gradeOptions: [],
    gradeInfos: [],
    gradeIndex: 0,
    studentInfos: [],
    curStudent: {},
    ADD_INDEX: 999,
  },
  studentInput: '',
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
    });
  },
  onStudentButtonClick: function (e) {
    const { dataset } = e.currentTarget;
    if (dataset.type === 'grade') {
      dataset.title = '班级';
    } else {
      dataset.title = '学生';
    }
    this.setData({ curStudent: dataset });
  },
  bindStudentInput: function (e) {
    const { value } = e.detail;
    this.studentInput = value;
  },
  onStudentModalClick: function (e) {
    this.setData({ curStudent: {} });
  },
  onStudentDelete: function (e) {
    const { curStudent, studentInfos, gradeInfos, gradeIndex } = this.data;
    const { index, type, id } = curStudent;
    const name = type === 'grade' ? gradeInfos[index].name : studentInfos[index].name;
    const curGradeInfo = gradeInfos[gradeIndex];
    wx.showModal({
      title: '提示',
      content: `确定要删除 ${name} ?`,
      success: (res) => {
        if (res.confirm) {
          if (type === 'grade') {
            gradeInfos.splice(index, 1);
            const gradeOptions = gradeInfos.map(value => value.name);
            const gradeIndex = Math.max(0, gradeInfos.length - 1);
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
          } else {
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
    const { curStudent, studentInfos, gradeInfos, gradeIndex, ADD_INDEX } = this.data;
    const { name, index, type } = curStudent;
    if (this.studentInput === '') {
      wx.showToast({
        title: '名字为空',
      });
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
    } else {
      if (type === 'grade') {
        if (gradeInfos[index].name === this.studentInput) {
          this.setData({ curStudent: {} });
          return;
        }
        gradeInfos[index].name = this.studentInput;
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
    }
    if (type === 'grade') {
      const gradeOptions = gradeInfos.map(value => value.name);
      const gradeIndex = Math.max(0, gradeInfos.length - 1);
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
    }
  },
})