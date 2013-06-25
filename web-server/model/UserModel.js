/**
 * @author: youxiachai
 * @Date: 13-6-24
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */

var nohm = require('nohm').Nohm;
var cryptoUtils = require('popularcrypto');
var uuid = require('uuid');
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
    },
    methods: {
        signIn: function (name, password, cb) {
            this.findAndLoad({username: name}, function (err, data) {
                if (err) {
                    cb(err, null);
                } else {
                    if (data) {
                        // check password
                        var userData = data[0].allProperties();
                        console.log('signIn');
                        if (userData.password === cryptoUtils.md5(password)) {
                            cb(null, userData);
                        } else {
                            cb('invalid password', null);
                        }
                    }
                }
            });
        },
        signUp: function (username, password, cb) {
            this.p('username', username);
            this.p('password', password);
           // this.p('email', email);
            this.p('accessToken', uuid.v1());
            this.save(function (err) {
                if (err) {
                    cb({errors: this.errors, saveError: err}, null);
                } else {
                    var allmember = this.allProperties();
                    allmember.password = cryptoUtils.md5(allmember.password);
                    cb(null, allmember);
                }
            });
        }
    }
});