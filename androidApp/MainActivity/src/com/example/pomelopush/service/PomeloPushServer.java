package com.example.pomelopush.service;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.IBinder;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.android.support.v8.app.NotificationCompat;
import com.example.pomelo_push_demo.MainActivity;
import com.example.pomelo_push_demo.R;
import com.netease.pomelo.DataCallBack;
import com.netease.pomelo.DataEvent;
import com.netease.pomelo.DataListener;
import com.netease.pomelo.PomeloClient;

public class PomeloPushServer extends Service {

	@Override
	public IBinder onBind(Intent arg0) {
		// TODO Auto-generated method stub
		return null;
	}

	PomeloClient client;
	public static final String HOST = "host";
	public static final String PORT = "port";
	public static final String APIKEY = "apikey";
	public static final String PUSHACTION = "com.example.pomelopush";
	public static final String PUSHMSG = "pushmsg";

	NotificationManager mNotifyManager;

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		// TODO Auto-generated method stub
		if (intent != null) {
			mNotifyManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
			localBroaCast = LocalBroadcastManager.getInstance(this);
			String host = intent.getStringExtra(HOST);
			int port = intent.getIntExtra(PORT, 0);
			String apiKey = intent.getStringExtra(APIKEY);
			initPomelo(apiKey, host, port);
		}
		return super.onStartCommand(intent, flags, startId);
	}

	public String getLocalMacAddress() {
		WifiManager wifi = (WifiManager) getSystemService(Context.WIFI_SERVICE);
		WifiInfo info = wifi.getConnectionInfo();
		return info.getMacAddress();
	}

	void appNotify(JSONObject msg) throws JSONException {
		NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(
				this);
		String title = msg.getString("title");
		String context = msg.getString("msg");
		mBuilder.setContentTitle(title);
		mBuilder.setContentText(context);
		mBuilder.setTicker(title);
		mBuilder.setSmallIcon(R.drawable.ic_launcher);
		Intent intent = new Intent(this, MainActivity.class);
		PendingIntent pIntent = PendingIntent.getActivity(this, 0, intent, 0);
		
		mBuilder.setContentIntent(pIntent);
		
		mNotifyManager.notify(0, mBuilder.build());
	}

	public void onMsgListener() {
		client.on("onMsg", new DataListener() {
			public void receiveData(DataEvent event) {

				JSONObject msg = event.getMessage();
				Log.d("xx", "callback-->" + msg);
				try {
					appNotify(msg.getJSONObject("body").getJSONObject("msg"));
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		});
	}

	@Override
	public void onDestroy() {
		super.onDestroy();
		if (client != null) {
			client.disconnect();
			client = null;
		}
	}

	LocalBroadcastManager localBroaCast;

	public void initPomelo(String apiKey, String host, int port) {
		Log.d("xx", "start callback-->");

		if (client == null) {
			client = new PomeloClient(host, port);
		} else {
			client.disconnect();
			client = new PomeloClient(host, port);
		}
		client.init();
		onMsgListener();
		String route = "sio-connector.entryHandler.enter";
		JSONObject jb = new JSONObject();

		try {
			jb.put("clientId", getLocalMacAddress());
			jb.put("role", "client");
			jb.put("apiKey", apiKey);
			client.request(route, jb, new DataCallBack() {
				public void responseData(JSONObject msg) {
					Log.d("xx", "init callback-->" + msg);
					// LocalBroadcastManager.getInstance(t)
					Intent i = new Intent();
					i.setAction(PomeloPushServer.PUSHACTION);
					i.putExtra(PUSHMSG, msg.toString());
					localBroaCast.sendBroadcast(i);
				}
			});
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public static void start(Activity act, Intent intent) {
		intent.setClass(act, PomeloPushServer.class);
		act.startService(intent);
	}

}
