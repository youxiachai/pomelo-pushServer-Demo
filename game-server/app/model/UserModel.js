/**
 * @author: youxiachai
 * @Date: 13-6-24
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */

var nohm = require('nohm').Nohm;
var cryptoUtils = require('popularcrypto');

module.exports = nohm.model('User', {
    idGenerator: 'increment',
    properties: {
        username: {
            type: 'string',
            unique: true,
            index: true,
            validations: [
                ['notEmpty']
            ]
        },
//        email: {
//            type: 'string',
//            unique: true,
//            validations: [
//                ['notEmpty'],
//                ['email']
//            ]
//        },
        password: {
            type: function (value) {
                return cryptoUtils.md5(value);
            },
            validations: [
                ['notEmpty']
            ]
        },
        accessToken: {
            type: 'string',
            unique: true,
            validations: [
                ['notEmpty']
            ]
        }
    }
});