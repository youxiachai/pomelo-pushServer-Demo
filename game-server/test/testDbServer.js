/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-6-16
 * Time: 下午2:41
 * To change this template use File | Settings | File Templates.
 */

var dbClient = require('../app/db/DBserver');



exports.testSignUP = function(test){
    var username = "tom1234";
    var password = "123456";
  dbClient.signUp(username, password, function(err, isExist){
      console.log(isExist);
  });
    test.done();
};

//exports.signIn = function(test){
//    var username = "tom123";
//    var password = "12344456";
//    var isLogin = dbClient.signIn(username, password, function(err, value){
//        console.log(value);
//        test.done();
//    });
//}