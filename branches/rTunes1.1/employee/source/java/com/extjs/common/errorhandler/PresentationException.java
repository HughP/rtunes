package com.extjs.common.errorhandler;

import com.extjs.common.entity.EmployeeExceptionType;
import com.extjs.common.utils.PreCondition;

public class PresentationException extends EmployeeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private EmployeeExceptionType employeeExceptionType;
	
	public PresentationException() {
        super();
        this.employeeExceptionType = EmployeeExceptionType.UNKNOWN;
    }

	public PresentationException(EmployeeExceptionType presentationExceptionType) {
        super();
        this.employeeExceptionType = presentationExceptionType;
    }
		
	public PresentationException(String s) {
        super(s);
        this.employeeExceptionType = EmployeeExceptionType.UNKNOWN;
    }

	public PresentationException(String s, EmployeeExceptionType presentationExceptionType) {
        super(s);
        this.employeeExceptionType = presentationExceptionType;
    }
	
    public PresentationException(String s, Throwable thrown) {
        super(s, thrown);
        this.employeeExceptionType = EmployeeExceptionType.UNKNOWN;
    }

    public PresentationException(Throwable thrown) {
        super(thrown);
        this.employeeExceptionType = EmployeeExceptionType.UNKNOWN;
    }
    
    public PresentationException(Throwable thrown, EmployeeExceptionType presentationExceptionType) {
        super(thrown);
        this.employeeExceptionType = presentationExceptionType;
    }
    
   
    public EmployeeExceptionType getPresentationTypeException() {
    	return employeeExceptionType;
    }
    
    public static boolean isPresentationTypeBarredUser(PresentationException pe) {
        PreCondition.assertNotNull(pe, "PresentationException");
        return (EmployeeExceptionType.BLOCKED_USER == pe.employeeExceptionType);
    }
    
    public static boolean isPresentationTypeDuplicate(PresentationException pe) {
        PreCondition.assertNotNull(pe, "PresentationException");
        return (EmployeeExceptionType.DUPLICATE == pe.employeeExceptionType);
    }

    public static boolean isPresentationTypeNotFound(PresentationException pe) {
        PreCondition.assertNotNull(pe, "PresentationException");
        return (EmployeeExceptionType.NOT_FOUND == pe.employeeExceptionType);
    }

}
