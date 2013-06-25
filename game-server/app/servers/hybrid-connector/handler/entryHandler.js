module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
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
Handler.prototype.enter = function (msg, session, next) {
//  next(null, {code: 200, msg: 'game server is ok.'});
    var role = msg.role;
    var uuid = msg.apiKey;
    //如果,uid undefined 可以推断请求的是web 管理端
    var uid = msg.clientId;

    if (!uid) {
        uid = uuid;
    }

    console.log(role);
    var sessionService = this.app.get('sessionService');
    //duplicate log in
    if (!!sessionService.getByUid(uid)) {
        console.log('rel' + uid);
        this.app.rpc.pushserver.pushRemote.add(session, uid, role, this.app.get('serverId'), uuid, function (err, users) {
            if (err) {
                console.log('error-->' + err);
                return;
            }
            if (users) {
                //发回给web management 的消息
                next(null, {code: 200, msg: 'push server is ok.', users: users});
            } else {
                //
                next(null, {code: 500, msg: "server error", users: users});
            }
        });
        return;
    }
    // seesion 与 客户端进行绑定操作.
    session.bind(uid);
    session.on('closed', onUserLeave.bind(null, this.app, uuid));
    this.app.rpc.pushserver.pushRemote.add(session, uid, role, this.app.get('serverId'), uuid, function (err, users) {
        if (err) {
            console.log('error-->' + err);
            return;
        }
        if (users) {
            //发回给web management 的消息
            next(null, {code: 200, msg: 'push server is ok.', users: users});
        } else {
            //
            next(null, {code: 200, msg: "add ok", users: users});
        }
    });
};

var onUserLeave = function (app, channelName, session) {
    console.log('userleave');
    if (!session || !session.uid) {
        return;
    }


    app.rpc.pushserver.pushRemote.kick(session, session.uid, app.get('serverId'), channelName, function (err) {
        console(err);
    });

}
