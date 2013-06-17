module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.enter = function(msg, session, next) {
//  next(null, {code: 200, msg: 'game server is ok.'});
    var role = msg.role;
    var uuid = msg.apiKey;
    var uid = msg.clientId;

    console.log(role + uid);
    var sessionService = this.app.get('sessionService');
    //duplicate log in
    if( !! sessionService.getByUid(uid)) {
        console.log('rel' + uid);
        next(null, {
            code: 500,
            msg: "duplicate log in",
            error: true
        });
        return;
    }

    session.bind(uid);

    //把离线客户端,从推送列表踢掉.
    session.on('closed', onUserLeave.bind(null, this.app, uuid));


    //sid 统一为web managment 所在的 frontend server.
    this.app.rpc.pushserver.pushRemote.add(session, uid,role,this.app.get('serverId'), uuid, function(err, users){
        if(err){
            console.log(err);
            return;
        }

        if(users){
            next(null, {code: 200, msg: 'push server is ok.', users: users});
        }else{
            next(null,{code: 200, msg: "add ok"});
        }
    });
};

var onUserLeave = function(app, channelName, session){
    console.log('userleave');
    if(!session || !session.uid) {
        return;
    }

//    var sessionSeiverc = app.get('sessionService');
//    var servierId = app.get('serverId');
//    sessionSeiverc.kickByUid(session.uid, servierId , null);

    app.rpc.pushserver.pushRemote.kick(session, session.uid, app.get('serverId'), channelName, function(err){
       console(err);
    });

}
