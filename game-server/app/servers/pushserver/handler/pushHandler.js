/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-6-17
 * Time: 上午12:52
 * To change this template use File | Settings | File Templates.
 */
module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

Handler.prototype.pushAll = function(msg, session, next){
 //  this.app.rpc.pushserver.pushRemote.pushAll(session, msg, next);
    var pushMsg = this.channelService.getChannel(msg.apikey, false);
    //console.log(this.getUsers(msg.apikey));
    pushMsg.pushMessage('onMsg',{msg: msg.msg}, function(err){
        if(err){
            console.log(err);
        } else{
            console.log('push ok');
            next(null, {code: 200, msg: 'push is ok.'});
        }
    });
};
