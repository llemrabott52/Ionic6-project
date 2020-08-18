package com.monetique.services;

public interface PushService {
	
	public void sendPush(String tokenFirebase,String titre,String message,Object data) throws Exception;

}
