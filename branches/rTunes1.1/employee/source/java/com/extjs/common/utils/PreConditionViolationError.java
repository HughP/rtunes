package com.extjs.common.utils;
/**
 * <p>Thrown when a pre-condition is violated</p>
 *
 * <p>Copyright © BuildOnline 2004. All rights reserved.</p>
 * 
 * @author Rob Godfrey
 */
public class PreConditionViolationError extends IllegalArgumentException
{
	public PreConditionViolationError(String preConditionViolationMessage)
	{
		super("Precondition violated : " + preConditionViolationMessage);
	}
}
