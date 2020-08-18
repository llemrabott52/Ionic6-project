package com.monetique.services;

public interface SmsService {
	
	public void sendSms(String telephone,String message) throws Exception;

}
