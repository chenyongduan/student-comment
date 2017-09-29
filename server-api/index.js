
function uploadStudent(userId, studentInfo) {
  return {
    endpoint: '/uploadStudent',
    method: 'POST',
    data: {
      userId,
      studentInfo,
    }
  };
}

module.exports = {
  uploadStudent,
}
