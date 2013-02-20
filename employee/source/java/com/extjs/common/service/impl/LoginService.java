/**
 * 
 */
package com.extjs.common.service.impl;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.dao.DataAccessException;

import com.extjs.common.dao.IUserDetails;
import com.extjs.common.entity.UserDetail;
import com.extjs.common.errorhandler.DaoException;
import com.extjs.common.errorhandler.EmployeeException;
import com.extjs.common.presentation.forms.UserForm;
import com.extjs.common.service.ILoginService;
import com.extjs.common.service.ServiceFinder;

/**
 * @author rpatil
 * 
 */
public class LoginService implements ILoginService {

	/*IUserDetails userDetails;

	public LoginService(IUserDetails userDetails) {
		this.userDetails = userDetails;
	}*/
	public LoginService() {
	}

	/**
	 * @param userName
	 * @param password
	 * @return
	 * @throws DataAccessException
	 * @throws java.sql.SQLException
	 */
	public boolean authenticate(String userName, String password, HttpServletRequest request) {
		IUserDetails userDetails = (IUserDetails) ServiceFinder.getContext(request).getBean("UserDetailsHibernateDao");
		try {
			return  userDetails.checkUserLogin(userName, password);
		} catch (DaoException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	};
	
	/**
	 * @param userName
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	public UserDetail getUserDetailsByUserName(String userName, HttpServletRequest request) throws Exception {
		IUserDetails userDetails = (IUserDetails) ServiceFinder.getContext(request).getBean("UserDetailsHibernateDao");
		try {
			return userDetails.getUserDetailByUserName(userName);
		}catch (Exception ex){
			throw new EmployeeException(ex);
		}
	};
	
	/**
	 * @param userName
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	public List<UserDetail> getUserDetails(HttpServletRequest request) throws Exception {
		IUserDetails userDetails = (IUserDetails) ServiceFinder.getContext(request).getBean("UserDetailsHibernateDao");
		try {
			return userDetails.getUserDetail();
		}catch (Exception ex){
			throw new EmployeeException(ex);
		}
	};
	
	/**
	 * @param userName
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	public UserDetail createUser(UserForm user, HttpServletRequest request) throws Exception {
		IUserDetails userDetails = (IUserDetails) ServiceFinder.getContext(request).getBean("UserDetailsHibernateDao");
		try {
			UserDetail userDetail = new UserDetail();
			userDetail.setUserName(user.getUserName());
			userDetail.setPassword(user.getPassword());
			userDetail.setFirstName(user.getFirstName());
			userDetail.setLastName(user.getLastName());
			userDetail.setGender(user.getGender());
			userDetail.setUserType("USER");
			userDetail.setEmail(user.getEmail());
			userDetails.save(userDetail);
			return userDetails.getUserDetailByUserName(user.getUserName());
		}catch (Exception ex){
			throw new EmployeeException(ex);
		}
	};
}
