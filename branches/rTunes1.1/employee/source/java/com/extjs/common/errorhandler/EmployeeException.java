package com.extjs.common.errorhandler;


/**
 * EmployeeException.java
 *
 * Checked Exception for application level errors.
 *
 */
public class EmployeeException extends Exception
{

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
     * Creates a new instance of <code>EmployeeException</code> with no specific detail
     * message.
     */
    public EmployeeException() {
        super();
    }

    /**
     * Constructs an instance of <code>EmployeeException</code> with the specified detail
     * message.
     *
     * @param s the detail message.
     */
    public EmployeeException(String s) {
        super(s);
    }

    /**
     * Constructs an instance of <code>EmployeeException</code> with the specified detail
     * message.
     *
     * @param s the detail message.
     * @param thrown the original exception.
     */
    public EmployeeException(String s, Throwable thrown) {
        super(s, thrown);
    }

    /**
     * Constructs an instance of <code>EmployeeException</code> using the message from the
     * original exception.
     *
     * @param thrown the original exception.
     */
    public EmployeeException(Throwable thrown) {
        super(thrown);
    }
}
