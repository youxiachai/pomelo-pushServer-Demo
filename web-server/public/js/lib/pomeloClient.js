/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-6-17
 * Time: 上午12:49
 * To change this template use File | Settings | File Templates.
 */

var pomelo = window.pomelo;
//构建客户端列表
var buildClinetList = function(users){
    var list = $('#clientList').empty();
    var count = users.length;
    $('#clientList').append('<li class="nav-header" id="clientHeader">在线人数: <span id="clientCount">'+count +'</span> </li>');
    for(var i = 0; i < users.length; i++){
        $('#clientList').append("<li><a>"+users[i]+"</a></i>");
    }
}


$(document).ready(function(){
    //接受服务器传过来的消息
    //在线
    pomelo.on('onAdd', function(data){
        console.log("onAdd" );
        console.log(data);
        buildClinetList(data.users);
    });

    //离线
    pomelo.on('onKick', function(data){

    });

    pomelo.on('onMsg', function(data){
        console.log("onMsg" );
        console.log(data);
    });
    //断开连接
    pomelo.on('disconnect', function(reason){
        console.log('disconnect'+reason);
    });
    pomelo.on('closed', function(reason){
        console.log('closed'+reason);
    });

    //访问pomelo 服务器
    request('xxx-xx--xx-xx', 'server');
});


var request = function(apikey, role){
    //初始请求
    pomelo.init({
        host: window.location.hostname,
        port: 3011,
        log: true
    }, function(){
        var route = "hybrid-connector.entryHandler.enter";
        var password = "123456";
        pomelo.request(route, {apiKey: apikey, role: role}, function(data){
            console.log(data);
            $('#pushMsgTip').text(data.msg);
           buildClinetList(data.users);
        })
    });
}

//推送消息给客户端
var pushAllmsg = function(msg, apikey){
    var route = 'pushserver.pushHandler.pushAll';
    pomelo.request(route,{msg: msg, apikey: apikey},function(data){
        $('#pushMsgTip').text(data.msg);
        console.log(data);
    });

};
