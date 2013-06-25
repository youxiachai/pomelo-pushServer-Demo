/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-6-17
 * Time: 上午12:52
 * To change this template use File | Settings | File Templates.
 */
module.exports = function (app) {
    return new Handler(app);
};
/**
 *
 * @param app
 * @constructor
 */
var Handler = function (app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

/**
 *
 * @param msg
 * @param session
 * @param next
 */
Handler.prototype.pushAll = function (msg, session, next) {
    //  this.app.rpc.pushserver.pushRemote.pushAll(session, msg, next);
    var pushMsg = this.channelService.getChannel(msg.apikey, false);
    //console.log(this.getUsers(msg.apikey));
    pushMsg.pushMessage('onMsg', {msg: msg.msg}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('push ok');
            next(null, {code: 200, msg: 'push is ok.'});
        }
    });
};

/**
 *
 * @param msg
 * @param session
 * @param next
 */
Handler.prototype.pushByClientId = function (msg, session, next) {
    var pushChannel = this.channelService.getChannel(msg.apikey, false);
    var tuid = msg.clientId;
    var tsid = pushChannel.getMember(tuid)['sid'];
    console.log(tuid + ":" + tsid);
    this.channelService.pushMessageByUids('onMsg', {msg: msg.msg}, [
        {
            uid: tuid,
            sid: tsid
        }
    ]);
};
