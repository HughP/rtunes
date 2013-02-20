package com.extjs.common.presentation.actions;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.extjs.common.errorhandler.PresentationException;
import com.extjs.common.presentation.forms.RTunesForm;


public class rTunesMobileAction extends Action {

	@SuppressWarnings("finally")
	public ActionForward execute(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		ActionForward actionForward = mapping.findForward("fail");
		try {
			RTunesForm rTForm = (RTunesForm) form; 
			String command = rTForm.getCommand();
			String userName = rTForm.getUserName();
			boolean isMobile = rTForm.isMobile();
			if(isMobile){
				System.out.println(userName + " switching to Mobile");
			}else{
				System.out.println(userName + " switching to Desktp");
			}
			actionForward = mapping.findForward("success");
		} catch (Exception ex) {
			throw new PresentationException(ex);
		} finally{
			return actionForward;
		}
	}
}
