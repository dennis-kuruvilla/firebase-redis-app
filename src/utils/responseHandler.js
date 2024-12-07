exports.success = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
      message,
      data,
  });
};

exports.error = (res, statusCode, message, details = null) => {
  res.status(statusCode).json({
      error: message,
      details,
  });
};
