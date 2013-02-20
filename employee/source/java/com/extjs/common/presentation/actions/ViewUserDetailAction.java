package com.extjs.common.presentation.actions;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.extjs.common.entity.UserDetail;
import com.extjs.common.errorhandler.PresentationException;
import com.extjs.common.service.ILoginService;
import com.extjs.common.service.impl.LoginService;
import com.extjs.common.utils.JavaToJSONUtil;


public class ViewUserDetailAction extends Action {

	public ActionForward execute(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		ActionForward actionForward = mapping.findForward("fail");
		try {
			ILoginService loginService = new LoginService();
			List<UserDetail> users = (List<UserDetail>) loginService.getUserDetails(request);
			request.setAttribute("users", users);
			String jsonResp = JavaToJSONUtil.getJsonString(users);
			request.setAttribute("json", "{\"page\":1, \"total\":" + users.size() + ", \"records\":" + jsonResp + "}");
			actionForward = (mapping.findForward("jsonSuccess"));
			return actionForward;	
		} catch (Exception ex) {
			throw new PresentationException(ex);
			//System.out.println("Failed at server : \n " + ex.getLocalizedMessage());
		}
	}
}
