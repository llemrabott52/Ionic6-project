package com.monetique.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.monetique.dto.NotificationFCM;
import com.monetique.dto.ReponseFCM;
import com.monetique.dto.RequeteSimpleFCM;
import com.monetique.services.PushService;

public class PushServiceImpl implements PushService{

	
	@Autowired
	RestTemplate restTemplate;
	
	String apiKey="AAAAsbxa30Y:APA91bECyxb8ANOZdPBFUYG2lYYvAHQrgbsmXUT4go-VdVTIZRMgtw8HXnhojbuH-FiKl2AN89wSBUtYF4ZPNIlrjyoFUe_WwEpRBJvWuSN4bwmK8KHezv80PF5cCDar5-aoS2CHb97Q";


	
	
	@Override
	public void sendPush(String tokenFirebase, String titre, String message, Object data) throws Exception {
		
		try {
			HttpHeaders headers= new HttpHeaders();
			headers.set("authorization", apiKey);
			
			RequeteSimpleFCM msg=new RequeteSimpleFCM();
			msg.setTo(tokenFirebase);
			msg.setData(data);
			
			NotificationFCM notification=new NotificationFCM(titre, message);

			msg.setNotification(notification);
			
			HttpEntity<RequeteSimpleFCM> requete = new HttpEntity<>(msg,headers);
			
			String url= "https://fcm.googleapis.com/fcm/send";
			
			
			ResponseEntity<ReponseFCM> response
			  =restTemplate.postForEntity(url, requete, ReponseFCM.class);
		
			if(response.getStatusCode().equals(HttpStatus.OK)) {
				
				ReponseFCM res=response.getBody();
				
				if(res.getSuccess()!=1 || res.getFailure()!=0) {
					throw new Exception("Message non envoyer"); 
				}
				
				
				
				
				
			}
			else {
				throw new Exception("Message non envoyer"); 
			}
			
		} catch (Exception e) {
			throw new Exception("Message non envoyer"); 
		}
		
	}

}