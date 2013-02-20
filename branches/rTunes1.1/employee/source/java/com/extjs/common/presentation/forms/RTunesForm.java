package com.extjs.common.presentation.forms;


public class RTunesForm extends EmployeeForm {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String userName;

    private String command;
    
    private boolean playLocally;
    
    private boolean isMobile;
    
    /**
	 * @return the userName
	 */
	public String getUserName() {
		return userName;
	}

	/**
	 * @param userName the userName to set
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}

	/**
	 * @return the command
	 */
	public String getCommand() {
		return command;
	}

	/**
	 * @param command the command to set
	 */
	public void setCommand(String command) {
		this.command = command;
	}

	/**
	 * @return the playLocally
	 */
	public boolean isPlayLocally() {
		return playLocally;
	}

	/**
	 * @param playLocally the playLocally to set
	 */
	public void setPlayLocally(boolean playLocally) {
		this.playLocally = playLocally;
	}

	/**
	 * @return the isMbile
	 */
	public boolean isMobile() {
		return isMobile;
	}

	/**
	 * @param isMbile the isMbile to set
	 */
	public void setMobile(boolean isMobile) {
		this.isMobile = isMobile;
	}
}