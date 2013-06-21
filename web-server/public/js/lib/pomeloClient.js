/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-6-17
 * Time: 上午12:49
 * To change this template use File | Settings | File Templates.
 */

var pomelo = window.pomelo;

/**
 * 构建客户端列表
 * @param users
 */
var buildClinetList = function (users) {
    var list = $('#clientList').empty();
    var count = users.length;
    $('#clientList').append('<li class="nav-header" id="clientHeader">在线人数: <span id="clientCount" >'+ count +'</span> </li>');
    $('#clientList').append("<li><a href='#all'>all</a></i>");
    for (var i = 0; i < users.length; i++){
        $('#clientList').append("<li><a href=#"+ users[i] +">"+users[i]+"</a></i>");
    }
};

//var

/**
 *
 * @param apikey
 * @param role
 */
var request = function(apikey, role){
    //初始请求
    pomelo.init({
        host: window.location.hostname,
        port: 3011,
        log: true
    }, function(){
        var route = "hybrid-connector.entryHandler.enter";
        pomelo.request(route, {apiKey: apikey, role: role}, function(data){
            console.log(data);
            $('#pushMsgTip').text(data.msg);
            buildClinetList(data.users);
        });
    });
};

var setPushClient = function (clientId){
    $('pushClient').val(clientId);
};


$(document).ready(function(){
    //接受服务器传过来的消息
    //在线
    pomelo.on('onAdd', function(data){
        console.log("onAdd" );
        console.log(data);
        buildClinetList(data.users);
    });

    //离线
    pomelo.on('onKick', function (data) {
        console.log('onKick'+data);
        $('#pushDebug').text(data.msg);
    });

    //获得消息
    pomelo.on('onMsg', function(data){
        console.log("onMsg"+data);
        $('#pushDebug').text(data.msg);
    });

    //断开连接
    pomelo.on('disconnect', function(reason){
        console.log('disconnect'+reason);
        $('#pushDebug').text(reason.msg);
    });
    pomelo.on('closed', function(reason){
        console.log('closed'+reason);
        $('#pushDebug').text(reason.msg);
    });

    //访问pomelo 服务器

    console.log($('#pushApiKey').text());




   request($('#pushApiKey').text(), 'server');
});
/**
 * 监听 a 标签 click 事件
 */
$(document).on('click', 'a', function(){
   console.log($(this).text());
   $('#pushClient').val($(this).text());
});

/**
 * 推送消息给所有客户端
 * @param msg
 * @param apikey
 */
var pushMsgAll = function(msg, apikey){
    var route = 'pushserver.pushHandler.pushAll';
    pomelo.request(route,{msg: msg, apikey: apikey},function(data){
        $('#pushMsgTip').text(data.msg);
        console.log(data);
    });
};

/**
 * 推送消息给指定客户端
 * @param msg
 * @param apikey
 * @param clientId
 */
var pushMsgClientId = function (msg, apikey, clientId) {
    var route = 'pushserver.pushHandler.pushByClientId';
    pomelo.request(route,{msg: msg, apikey: apikey, clientId: clientId},function(data){
        $('#pushMsgTip').text(data.msg);
        console.log(data);
    });
};

/**
 * 推送消息给客户端
 * @param msg
 * @param apikey
 * @param clientId
 */
var pushMsgToClient = function(msg, apikey, clientId) {
   // console.log(msg + apikey + clientId);
    if(clientId === 'all'){
        pushMsgAll(msg, apikey);
    }else{
        pushMsgClientId(msg, apikey, clientId);
    }
};
