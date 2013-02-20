package com.extjs.common.presentation.forms;

import org.apache.struts.action.ActionForm;

public class EmployeeForm extends ActionForm {      
    
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	String responseType = "HTML";
	boolean isJsonResponse;

	/**
	 * @return the responseType
	 */
	public String getResponseType() {
		return responseType;
	}

	/**
	 * @param responseType the responseType to set
	 */
	public void setResponseType(String responseType) {
		this.responseType = responseType;
	}

	/**
	 * @return the isJsonResponse
	 */
	public boolean isJsonResponse() {
		if(this.responseType.equalsIgnoreCase("json")){
			return Boolean.TRUE;
		}else {
			return Boolean.FALSE;
		}
	}

	/**
	 * @param isJsonResponse the isJsonResponse to set
	 */
	public void setJsonResponse(boolean isJsonResponse) {
		this.isJsonResponse = isJsonResponse;
	}
	
    
}