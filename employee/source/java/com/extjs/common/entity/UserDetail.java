/**
 * 
 */
package com.extjs.common.entity;

import java.io.Serializable;

import com.extjs.common.utils.Record;

/**
 * @author rpatil
 * 
 */
public class UserDetail implements Serializable, Record{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer userId;
	private String userName;
	private String password;
	private String firstName;
	private String lastName;
	private String gender;
	private String userType;
	private String email;

	/** full constructor 
	 * @param id */
	public UserDetail(Integer userId, String userName, String password,
			String firstName, String lastName,
			String gender, String userType, String email) {
		this.userId = userId;
		this.userName = userName;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.gender = gender;
		this.userType = userType;
		this.email = email;
	}

	/** default constructor */
	public UserDetail() {
	}
	
	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	/**
	 * @return the userName
	 */
	public String getUserName() {
		return userName;
	}

	/**
	 * @param userName
	 *            the userName to set
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}

	/**
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * @param password
	 *            the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * @return the firstName
	 */
	public String getFirstName() {
		return firstName;
	}

	/**
	 * @param firstName
	 *            the firstName to set
	 */
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	/**
	 * @return the lastName
	 */
	public String getLastName() {
		return lastName;
	}

	/**
	 * @param lastName
	 *            the lastName to set
	 */
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	/**
	 * @return the Gender
	 */
	public String getGender() {
		return gender;
	}

	/**
	 * @param Gender
	 *            the Gender to set
	 */
	public void setGender(String gender) {
		this.gender = gender;
	}

	/**
	 * @return the userType
	 */
	public String getUserType() {
		return userType;
	}

	/**
	 * @param userType
	 *            the userType to set
	 */
	public void setUserType(String userType) {
		this.userType = userType;
	}

	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * @param email
	 *            the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}

}
