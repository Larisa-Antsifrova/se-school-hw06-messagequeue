const { Messages } = require('../helpers/constants');
const apiLogger = require('../configs/logger-config');

const showHomeMessage = (req, res, next) => {
  apiLogger.emitLog('error', 'error-test');
  apiLogger.emitLog('debug', 'debug-test');
  apiLogger.emitLog('info', 'info-test');

  return res.json({
    message: Messages.welcomeHome,
  });
};

module.exports = { showHomeMessage };
