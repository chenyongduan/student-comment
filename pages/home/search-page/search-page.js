// pages/home/search-page/search-page.js
const { wxPromise } = require("../../../utils/util.js");

Page({
  data: {
    curStudentInfo: {},
    searchOptions: [],
    commentOptions: [],
    searchResult: [],
    inputValue: '',
  },
  studentInfos: [],
  onLoad: function (options) {
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
          } catch (e) {}
        });
      });
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
    const inputValue = e.detail.value;
    const { commentOptions } = this.data;
    if (inputValue === '') {
      this.setData({ searchOptions: commentOptions });
      return;
    }
    const searchOptions = [];
    commentOptions.map((value) => {
      const isSame = value.name.match(inputValue);
      if (isSame && inputValue !== '') {
        searchOptions.push(value);
      }
    });
    this.setData({ searchOptions, inputValue });
  },
  bindSearchForcus: function () {
    const { inputValue } = this.data;
    if (inputValue !== '') return;
    const { commentOptions } = this.data;
    this.setData({ searchOptions: commentOptions });
  },
  onPageClick: function () {
    this.setData({ searchOptions: [] });
  },
  bindSearchViewCatch: function () {

  },
  matchByCommentName: function () {
    const { commentOptions, inputValue } = this.data;
    let commentId = null;
    commentOptions.map((value) => {
      const isSame = value.name.search(inputValue);
      if (isSame === 0) {
        commentId = value.id;
      }
    });
    return commentId;
  },
  onSearchClick: function (e) {
    const { inputValue } = this.data;
    if (inputValue === '') {
      wx.showToast({
        title: '评价类型为空!',
      });
      return;
    }
    const commentId = this.matchByCommentName();
    if (commentId) {
      this.getSearchByCommentId(commentId);
    }
  },
  onSearchItemClick: function (e) {
    const { id, name } = e.currentTarget.dataset;
    this.getSearchByCommentId(id);
    this.setData({ inputValue: name });
  },
  getSearchByCommentId: function (id) {
    const searchResult = [];
    this.studentInfos.map((studentInfo) => {
      const commentInfo = studentInfo.comment || [];
      const commentKeys = Object.keys(commentInfo);
      const searchInfo = [];
      commentKeys.map((commentKey) => {
        commentInfo[commentKey].map((commentId) => {
          if (Number(commentId) === id) {
            searchInfo.push(commentKey);
          }
        })
      });
      if (searchInfo.length > 0) {
        const curStudentInfo = {};
        curStudentInfo.id = studentInfo.id;
        curStudentInfo.name = studentInfo.name;
        curStudentInfo.gradeId = studentInfo.gradeId;
        curStudentInfo.commentId = id;
        curStudentInfo.commentKeys = searchInfo;
        searchResult.push(curStudentInfo);
      }
    });
    this.setData({ searchResult, searchOptions: [] });
  },
  onResultItemClick: function (e) {
    const { commentid, gradeid, studentid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/home/date-list-page/date-list-page?gradeId=${gradeid}&studentId=${studentid}&commentId=${commentid}`,
    });
  },
})