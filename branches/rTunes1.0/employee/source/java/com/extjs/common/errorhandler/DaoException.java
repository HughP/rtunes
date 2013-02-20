package com.extjs.common.errorhandler;

import com.extjs.common.entity.EmployeeExceptionType;
import com.extjs.common.utils.PreCondition;



/**
 * <p>Persistence exception can be thrown when errors occur persisting information to peristence stores.</p>
 *
 *
 * <p>Copyright © BuildOnline 2003. All rights reserved.</p>
 */
public class DaoException extends EmployeeException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static EmployeeExceptionType EmployeeExceptionType;

    /**
     * Creates a new instance of <code>Persistence</code> with no specific detail message.
     */
    public DaoException() {
    	super();
    	this.EmployeeExceptionType = EmployeeExceptionType.UNKNOWN;
    }
    
    public DaoException(EmployeeExceptionType persistenceExceptionType) {
    	super();
    	this.EmployeeExceptionType = persistenceExceptionType;
    }
    
    public DaoException(String msg, EmployeeExceptionType persistenceExceptionType) {
        super(msg);
    	this.EmployeeExceptionType = persistenceExceptionType;
    }

    /**
     * Constructs an instance of <code>BuildOnlinePersistenceException</code> with the specified detail
     * message.
     *
     * @param msg the detail message.
     */
    public DaoException(String msg) {
        super(msg);
    	this.EmployeeExceptionType = EmployeeExceptionType.UNKNOWN;
    }

    /**
     * Constructs an instance of <code>BuildOnlinePersistenceException</code> with the specified detail
     * message.
     *
     * @param msg the detail message.
     */
    public DaoException(String msg, Throwable t) {
        super(msg, t);
    	this.EmployeeExceptionType = EmployeeExceptionType.UNKNOWN;
    }

    /**
     * Constructs an instance of <code>BuildOnlinePersistenceException</code> with the message from the
     * original exception.
     *
     * @param t the original exception.
     */
    public DaoException(Throwable t) {
        super(t);
    }
    
    /** 
     * Get the persistence exception type
     */
    public EmployeeExceptionType getPersistenceExceptionType() {
    	return EmployeeExceptionType;
    }
    
    public static boolean isPersistentExceptionTypeDuplicate(DaoException pe) {
        PreCondition.assertNotNull(pe, "PersistenceExceptionType");
        return (pe.EmployeeExceptionType == EmployeeExceptionType.DUPLICATE);
    }
    
    public static boolean isPersistentExceptionTypeNotFound(DaoException pe) {
        PreCondition.assertNotNull(pe, "PersistenceExceptionType");
        return (pe.EmployeeExceptionType == EmployeeExceptionType.NOT_FOUND);
    }
    
    public static boolean isPersistentExceptionTypeUnknown(DaoException pe) {
        PreCondition.assertNotNull(pe, "PersistenceExceptionType");
        return (pe.EmployeeExceptionType == EmployeeExceptionType.UNKNOWN);
    }    
    
}
