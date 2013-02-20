package com.extjs.common.utils;

/**
 * <p>Design by contract precondition assertion class</p>
 *
 * <p>Copyright © BuildOnline 2005. All rights reserved.</p>
 */
public class PreCondition {
	
	public static void assertTrue(boolean expression, String preConditionViolationMessage) 
		throws PreConditionViolationError {
		
		if (expression != true) {
			throw new PreConditionViolationError(preConditionViolationMessage);
		}
	}

	public static void assertNotNull(Object object, String objectName) 
		throws PreConditionViolationError {
		
		assertTrue(object != null, "Object '" + objectName + "' cannot be null");
	}
	
	public static void assertArrayIsValid(Object[] array, String arrayName, boolean mustHaveValues) {
		
		assertNotNull(array, arrayName);
		if (mustHaveValues) {
			assertTrue((array.length > 0), arrayName + ".length > 0");
		}
		for (int i = 0; i < array.length; i++) {
			assertNotNull(array[i], arrayName + "[" + i + "]");
		}
	}
	
	public static void assert2DArrayIsValid(Object[][] array, String arrayName, boolean mustHaveValues, 
		int secondDimensionLen) {
		
		assertArrayIsValid(array, arrayName, mustHaveValues);
		for (int i = 0; i < array.length; i++) {
			if (array[i].length != secondDimensionLen) {
				throw new PreConditionViolationError("Second dimension of array should have length " 
					+ secondDimensionLen + " but has length " + array[i].length);
			}
			assertArrayIsValid(array[i], arrayName, mustHaveValues);
		}
	}
}
