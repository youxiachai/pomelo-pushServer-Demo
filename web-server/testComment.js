/**
 * User: youxiachai
 * Date: 13-6-20
 * Time: 下午4:37
 * To change this template use File | Settings | File Templates.
 */



/**
 * TODO: hello world
 */

//setTimeout(function () {
//    console.log(hi());
//}, 1000);
//
//
//setInterval(function () {
//    console.log(new Date());
//}, 1000);

//try {
//    throw new Error('Test');
//} catch (e) {
//    console.log(e);
//}

var testString = "abcdefg";

console.log(testString.split(/[c|e]/g));


function Hello() {

}

Hello.prototype.print = function (msg) {
    console.log(msg);
};

var h = new Hello();
h.print("Hello World!");
