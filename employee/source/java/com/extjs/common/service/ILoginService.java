/**
 * 
 */
package com.extjs.common.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.dao.DataAccessException;

import com.extjs.common.entity.UserDetail;
import com.extjs.common.presentation.forms.UserForm;


/**
 * @author rpatil
 *
 */
public interface ILoginService {
	/**
	 * @param userName
	 * @param password
	 * @return
	 * @throws DataAccessException
	 * @throws java.sql.SQLException
	 */
	public boolean authenticate(String userName, String password, HttpServletRequest request);
	
	/**
	 * @param userName
	 * @param request
	 * @return
	 */
	public UserDetail getUserDetailsByUserName(String userName, HttpServletRequest request) throws Exception;

	/**
	 * @param userName
	 * @param request
	 * @return
	 */
	public List<UserDetail> getUserDetails(HttpServletRequest request) throws Exception;
	
	/**
	 * @param user
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public UserDetail createUser(UserForm user, HttpServletRequest request) throws Exception;
}
