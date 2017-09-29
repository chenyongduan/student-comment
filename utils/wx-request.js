const { HOST } = require('../constants/index');

function request(apiInfo, header, successCallback, failCallback) {
  const { endpoint, method, data } = apiInfo;
  wx.request({
    url: HOST + endpoint,
    method,
    data,
    header,
    success: (res) => {
      if ((res.statusCode === 200 || res.statusCode === 201)) {
        if (successCallback) successCallback(res.data);
      } else if (failCallback) failCallback(res.data);
    },
    fail: (res) => {
      if (failCallback) failCallback(res.data);
    },
  });
}

function wxRequest(apiInfo, successCallback, failCallback) {
  const {
    endpoint,
    method,
    data,
  } = apiInfo;
  const defaultHeaders = {
    Accept: 'application/json',
    'content-Type': 'application/json',
  };
  request(apiInfo, defaultHeaders, successCallback, failCallback);
}

module.exports = {
  wxRequest,
};
