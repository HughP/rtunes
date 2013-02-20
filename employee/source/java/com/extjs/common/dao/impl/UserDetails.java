package com.extjs.common.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.dao.DataAccessException;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.extjs.common.dao.IUserDetails;
import com.extjs.common.entity.UserDetail;
import com.extjs.common.errorhandler.DaoException;

public class UserDetails extends HibernateDaoSupport implements IUserDetails {

	public UserDetails() {
	}

	public void save(UserDetail userDetail) {
		getHibernateTemplate().save(userDetail);
	}

	public void update(UserDetail userDetil) {
		getHibernateTemplate().update(userDetil);
	}

	public void delete(UserDetail userDetil) {
		getHibernateTemplate().delete(userDetil);
	}

	public UserDetail getUserDetailByUserName(String userName) throws DaoException {
		try{
			Session session = this.getSession();
			Criteria criteria = session.createCriteria(UserDetail.class);
			Criterion criterion = Restrictions.eq("userName", userName);
			criteria.add(criterion);
			List <UserDetail> resultSet = criteria.list();
			return resultSet.get(0);
		}catch(Exception ex){
			throw new DaoException(ex);
		}
	}

	public List<UserDetail> getUserDetail() throws DaoException {
		try{
			Session session = this.getSession();
			Criteria criteria = session.createCriteria(UserDetail.class);
			List <UserDetail> resultSet = criteria.list();
			return resultSet;
		}catch(Exception ex){
			throw new DaoException(ex);
		}
	}
	

	/**
	 * @param userName
	 * @param password
	 * @return
	 * @throws DataAccessException
	 * @throws java.sql.SQLException
	 */
	@SuppressWarnings("finally")
	public boolean checkUserLogin(String userName, String password) throws DaoException{
		boolean valid = false;
		try{
			Session session = this.getSession();
			Criteria criteria = session.createCriteria(UserDetail.class);
			Criterion criterion = Restrictions.eq("userName", userName);
			criteria.add(criterion);
			Criterion passCriterion = Restrictions.eq("password", password);
			criteria.add(passCriterion);
			List <UserDetail> rs = criteria.list();
			if (rs.size() > 0) {
				valid = true;
	
			} else {
				valid = false;
			}
		}catch(Exception ex){
			throw new DaoException(ex);
		} finally{
			return valid;
		}
	}
}
