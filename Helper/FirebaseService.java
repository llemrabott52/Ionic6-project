package com.monetique.services;

import java.util.List;

import com.monetique.models.Message;
import com.monetique.models.Utilisateur;

public interface FirebaseService {
	
	
	public List<Utilisateur> getAllUserByRole(String role) throws Exception;
	public Utilisateur getUserByIdentifiant(String identifiant) throws Exception;
	public void setMessage(Message message) throws Exception;

}
