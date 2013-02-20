package com.extjs.common.dao;

import java.util.List;

import org.springframework.dao.DataAccessException;

import com.extjs.common.entity.UserDetail;
import com.extjs.common.errorhandler.DaoException;

public interface IUserDetails {

	
	/**
	 * @param userDetil
	 */
	public void save(UserDetail userDetail);

	/**
	 * @param userDetil
	 */
	public void update(UserDetail userDetil);

	/**
	 * @param userDetil
	 */
	public void delete(UserDetail userDetil);
	
	
	/**
	 * @param userName
	 * @return
	 * @throws DaoException 
	 * @throws Exception
	 */
	public UserDetail getUserDetailByUserName(String userName) throws DaoException;
	
	/**
	 * @param userName
	 * @return
	 * @throws DaoException 
	 * @throws Exception
	 */
	public List<UserDetail> getUserDetail() throws DaoException;
	
	/**
	 * @param userName
	 * @param password
	 * @return
	 * @throws DataAccessException
	 * @throws java.sql.SQLException
	 * @throws DaoException 
	 */
	public boolean checkUserLogin(String userName, String password)
			throws DaoException;
}
