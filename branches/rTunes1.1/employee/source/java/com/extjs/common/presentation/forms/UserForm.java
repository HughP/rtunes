package com.extjs.common.presentation.forms;

import java.util.Locale;
import java.util.TimeZone;

import com.sun.tools.internal.xjc.Language;

public class UserForm extends EmployeeForm {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Integer userId;
    
    private String email;
    
    private String userName;

    private String password;
    
    private String firstName;
    
    private String lastName;
    
    private boolean userIsDeleted;
    
    private String userType;
    
    private String userStatus;
    
    private Language language;
    
    private Locale locale;
    
    private String gender;
    
    private TimeZone timeZone;
    
    private boolean companyAdministrator;

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public boolean isUserIsDeleted() {
		return userIsDeleted;
	}

	public void setUserIsDeleted(boolean userIsDeleted) {
		this.userIsDeleted = userIsDeleted;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getUserStatus() {
		return userStatus;
	}

	public void setUserStatus(String userStatus) {
		this.userStatus = userStatus;
	}

	public Language getLanguage() {
		return language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public Locale getLocale() {
		return locale;
	}

	public void setLocale(Locale locale) {
		this.locale = locale;
	}

	public TimeZone getTimeZone() {
		return timeZone;
	}

	public void setTimeZone(TimeZone timeZone) {
		this.timeZone = timeZone;
	}

	public boolean isCompanyAdministrator() {
		return companyAdministrator;
	}

	public void setCompanyAdministrator(boolean companyAdministrator) {
		this.companyAdministrator = companyAdministrator;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}
}
