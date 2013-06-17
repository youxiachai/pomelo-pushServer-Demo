package com.example.pomelo_push_demo;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.netease.pomelo.DataCallBack;
import com.netease.pomelo.DataEvent;
import com.netease.pomelo.DataListener;
import com.netease.pomelo.PomeloClient;

public class MainActivity extends Activity implements OnClickListener {
	PomeloClient client;

	public static String currentHost = "192.168.1.107";
	public static int currentPort = 3010;

	EditText etHost;
	EditText etPort;

	void updateServerConfig(String host, int port) {
		currentHost = host;
		currentPort = port;
		Toast.makeText(this, "host" + host + "----port" + port, Toast.LENGTH_SHORT).show();
		etHost.setText(currentHost);
		etPort.setText("" + currentPort);
	}
	TextView tv1 ;
	TextView tv2 ; 
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		etHost = (EditText) findViewById(R.id.host);
		etPort = (EditText) findViewById(R.id.port);
		tv1 = (TextView) findViewById(R.id.textView1);
		tv2 = (TextView) findViewById(R.id.textView2);
		findViewById(R.id.button1).setOnClickListener(this);
		findViewById(R.id.button2).setOnClickListener(new OnClickListener(){

			@Override
			public void onClick(View v) {
				// TODO Auto-generated method stub
				updateServerConfig(etHost.getText().toString(), Integer.valueOf(etPort.getText().toString()));
			}
			
		});
	}

	@Override
	protected void onResume() {
		super.onResume();
		updateServerConfig(currentHost, currentPort);
	}

	public void onMsgListener() {
		client.on("onMsg", new DataListener() {
			public void receiveData(DataEvent event) {
				Log.d("xx", "callback");
				final JSONObject msg = event.getMessage();
				// handle data from server
			//	Log.d("xx", msg.toString());
				runOnUiThread(new Runnable() {
					
					@Override
					public void run() {
						// TODO Auto-generated method stub
						tv2.setText(msg.toString());
					}
				});	
						
				

			}
		});
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	public void start() {
		client = new PomeloClient(currentHost, currentPort);
	
		client.init();
		onMsgListener();
		String route = "sio-connector.entryHandler.enter";
		JSONObject jb = new JSONObject();
		try {
			jb.put("clientId", "android device1");
			jb.put("role", "client");
			jb.put("apiKey", "xxx-xx--xx-xx");
			client.request(route, jb, new DataCallBack() {
				public void responseData(final JSONObject msg) {
					// handle data here
					// TextView tv = (TextView)
					// findViewById(android.R.id.text1);
					// tv.setText(msg.toString());
				
					runOnUiThread(new Runnable() {
						
						@Override
						public void run() {
							// TODO Auto-generated method stub
							
							tv1.setText(msg.toString());
						}
					});
					

				}
			});
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

	

	@Override
	protected void onPause() {
		super.onPause();
		if (client != null) {
			client.disconnect();
		}
	}
	
	@Override
	protected void onDestroy() {
		super.onDestroy();
//		if (client != null) {
//			client.disconnect();
//		}
		tv1.setText("msg");
		tv2.setText("state");
	}

	@Override
	public void onClick(View v) {
		// TODO Auto-generated method stub
		Toast.makeText(this, "连接服务器", Toast.LENGTH_SHORT).show();
		start();
	}

}
