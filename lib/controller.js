'use strict';

/**
 * Provides default route action to deal with CAS protocol.
 *
 * @class controller
 * @static
 */

const databaseProvider = process.require('lib/databaseProvider.js');
const {URL} = require('url');

/**
 * Authenticates user.
 *
 * This is a mock, no verification is performed. The generated ticket is just the user login.
 *
 * @method authenticateAction
 * @static
 * @async
 * @param {Request} request ExpressJS HTTP Request
 * @param {Object} request.query Request query string
 * @param {String} request.query.service The service to redirect to when authenticated
 * @param {String} request.query.login The user login to authenticate
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
module.exports.authenticateAction = (request, response, next) => {
  let redirectUrl = new URL(request.query.service);
  redirectUrl.searchParams.append('ticket', request.query.login);

  response.statusCode = 302;
  response.setHeader('Location', redirectUrl.href);
  response.setHeader('Content-Length', '0');
  response.end();
};

/**
 * Validates ticket.
 *
 * This is a mock, no verification is performed. The generated ticket is just the user login.
 * User is retrieved from the database file and all its attributes are sent.
 * No verification is performed, it always sends an authentication success.
 *
 * @method validateTicketAction
 * @static
 * @async
 * @param {Request} request ExpressJS HTTP Request
 * @param {Object} request.query Request query string
 * @param {String} request.query.ticket The ticket (user login)
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
module.exports.validateTicketAction = (request, response, next) => {
  const user = databaseProvider.getUser(request.query.ticket);

  let result = `
    <cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'>
        <cas:authenticationSuccess>
            <cas:user>${user.name}</cas:user>
        </cas:authenticationSuccess>
    </cas:serviceResponse>
  `;

  response.send(result);
};

/**
 * Logouts user.
 *
 * This is a mock, no verification is performed, nothing is done. User is just redirected to the given URL.
 *
 * @method logoutAction
 * @static
 * @async
 * @param {Request} request ExpressJS HTTP Request
 * @param {Object} request.query Request query string
 * @param {String} request.query.url The URL to redirect to
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
module.exports.logoutAction = (request, response, next) => {
  response.statusCode = 302;
  response.setHeader('Location', request.query.url);
  response.setHeader('Content-Length', '0');
  response.end();
};


module.exports.requestGrantingTicketAction = (req, response) => {
  response.setHeader('Location', 'https://' + req.get('host') + req.originalUrl + `/TGT-fdsjfsdfjkalfewrihfdhfaie`)
  response.sendStatus(201);
};

module.exports.requestServiceTicketAction = (request, response) => {
  response.send('ST-1-FFDFHDSJKHSDFJKSDHFJKRUEYREWUIFSD2132');
};