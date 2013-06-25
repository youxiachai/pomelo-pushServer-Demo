#基于Pomelo 的推送演示demo#

在线演示
[http://42.121.117.150:3001](http://42.121.117.150:3001/dashboard)

用户名: demo

密码: demo

客户端连接使用 apiKey

**界面就不要吐槽了..**

android 客户端在
`/androidApp/Pomelo-push-demo` 支持gradle 构建

`gradle build` 在`build/apk` 目录就可以直接使用apk 安装到手机

**需要注意**

如果,编译过程出现,编码错误,需要手动设置jdk的编码环境,在环境变量里面加上

name: `JAVA_TOOL_OPTIONS`

value: `-Dfile.encoding=UTF-8`


##服务端##
windows 环境你需要安装:

* vs 2010 express
* node x86(注意千万不能使用x64)
* python 2.x

运行步骤:

1. 运行npm-install,安装运行需要的module
2. 进入game-server 目录运行 `pomelo start`
3. 进入web-server 目录运行 `node app`

如果在安装 pomelo 过程中出现各种错误,请自行google.


##支持本项目##
如果你愿意支持一下本项目,没有什么比捐点线实在了...

[![](pay_encourage.png)](http://me.alipay.com/youxilua)