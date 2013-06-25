package com.example.pomelopush.service;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.IBinder;
import android.util.Log;

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
	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		// TODO Auto-generated method stub
		if(intent != null){
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
	
	public void onMsgListener() {
		client.on("onMsg", new DataListener() {
			public void receiveData(DataEvent event) {
				
				final JSONObject msg = event.getMessage();
				Log.d("xx", "callback-->" + msg);
			}
		});
	}
	
	@Override
	public void onDestroy() {
		super.onDestroy();
		if(client != null){
			client.disconnect();
		}
	}
	
	public void initPomelo(String apiKey, String host, int port){
		Log.d("xx", "start callback-->");
		client = new PomeloClient(host, port);
		client.init();
		
		onMsgListener();
		String route = "sio-connector.entryHandler.enter";
		JSONObject jb = new JSONObject();
		
		try {
			jb.put("clientId", getLocalMacAddress());
			jb.put("role", "client");
			jb.put("apiKey", apiKey);
			client.request(route, jb, new DataCallBack() {
				public void responseData(final JSONObject msg) {
					Log.d("xx", "init callback-->" + msg);
				}
			});
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	public static void  start(Activity act, Intent intent){
		intent.setClass(act, PomeloPushServer.class);
		act.startService(intent);
	}

}
