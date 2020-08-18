package com.monetique.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.monetique.dto.ListUtilisateur;
import com.monetique.models.Message;
import com.monetique.models.Utilisateur;
import com.monetique.services.FirebaseService;

@Service
public class FirebaseServiceImpl  implements FirebaseService{

	@Autowired
	RestTemplate restTemplate;
	
	
	@Override
	public List<Utilisateur> getAllUserByRole(String role) throws Exception {
		
		
		try {
			
			HttpHeaders headers= new HttpHeaders();
			headers.set("authorization", "BPM.BANK");
			
	        HttpEntity<String> entete = new HttpEntity<String>("parameters", headers);

			
			String url= "https://us-central1-bpm-alertnotification.cloudfunctions.net/webApi/api/getAllUserByRole/"+role;

            ResponseEntity<ListUtilisateur> response = restTemplate.exchange(url, HttpMethod.GET, entete, ListUtilisateur.class);
			
			if(response.getStatusCode().equals(HttpStatus.OK)) {
				ListUtilisateur res =response.getBody();
				
				List<Utilisateur> list=res.getList();
				
				return list;
				
				
				
			}
			else {
				throw new Exception("role introuvable"); 
			}
			
			
			
		} catch (Exception e) {
			throw new Exception("role introuvable");
		}
		
		
		
		
	
	}

	@Override
	public Utilisateur getUserByIdentifiant(String identifiant) throws Exception {
		try {
			
			HttpHeaders headers= new HttpHeaders();
			headers.set("authorization", "BPM.BANK");
			
	        HttpEntity<String> entete = new HttpEntity<String>("parameters", headers);

			
			String url= "https://us-central1-bpm-alertnotification.cloudfunctions.net/webApi/api/getUserByIdentifiant/"+identifiant;

            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.GET, entete, Object.class);
			
			if(response.getStatusCode().equals(HttpStatus.OK)) {
				List res = response.getBody();
				
				List<Utilisateur> list=res.getidentifiant;
				
				return identifiant;
				
				
				
			}
			else {
				throw new Exception("role introuvable"); 
			}
					
			
		 } catch (Exception e) {
			throw new Exception("role introuvable");
		 }
	}

	@Override
	public void setMessage(Message message) throws Exception {
try {
			
			HttpHeaders headers= new HttpHeaders();
			headers.set("authorization", "BPM.BANK");
			
	        HttpEntity<String> entete = new HttpEntity<String>("parameters", headers);

			
			String url= "https://us-central1-bpm-alertnotification.cloudfunctions.net/webApi/api/setMessage/";

            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.POST, entete, Object.class);
			
			if(response.getStatusCode().equals(HttpStatus.OK)) {
				List res = response.getBody();
				
				List<Utilisateur> list=res.getidentifiant;
				
				return identifiant;
				
				
				
			}
			else {
				throw new Exception("Messge non envoyer"); 
			}
					
			
		 } catch (Exception e) {
			throw new Exception("Message non envoyer");
		 }
		
	}


}
