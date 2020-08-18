package com.monetique.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.monetique.services.SmsService;

public class SmsServiceImpl implements SmsService{

	@Autowired
	RestTemplate restTemplate;
	
	
	@Override
	public void sendSms(String telephone, String message) throws Exception {
		// TODO Auto-generated method stub
		try {
			String url= "http://192.168.7.33:8800?Phonenumber="+telephone+"&text="+message;
			ResponseEntity<Object> response
			  = restTemplate.getForEntity(url, Object.class);
			if(!response.getStatusCode().equals(HttpStatus.OK)) {
				throw new Exception("Message non envoyer"); 
			}
			
		} catch (Exception e) {
			throw new Exception("Message non envoyer");
		}
		
		
	}

}
