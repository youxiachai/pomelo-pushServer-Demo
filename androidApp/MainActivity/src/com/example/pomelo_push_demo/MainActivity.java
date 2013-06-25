package com.example.pomelo_push_demo;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;

import com.example.pomelopush.service.PomeloPushServer;
import com.netease.pomelo.PomeloClient;

public class MainActivity extends Activity {
	PomeloClient client;

	public static String currentHost = "42.121.117.150";
	//http://42.121.117.150:3001/dashboard
	public static int currentPort = 3010;

	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		findViewById(R.id.button2).setOnClickListener(new OnClickListener(){

			@Override
			public void onClick(View v) {
				// TODO Auto-generated method stub
				Intent intent = new Intent();
				intent.putExtra(PomeloPushServer.HOST, currentHost);
				intent.putExtra(PomeloPushServer.PORT, currentPort);
				intent.putExtra(PomeloPushServer.APIKEY, "8940dc40-dd8e-11e2-89dd-b330ee18e84b");
				PomeloPushServer.start(MainActivity.this, intent);
			}
			
		});
	}

	@Override
	protected void onResume() {
		super.onResume();
	}



	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}


	

	@Override
	protected void onPause() {
		super.onPause();
	}
	
	@Override
	protected void onDestroy() {
		super.onDestroy();

	}




}
