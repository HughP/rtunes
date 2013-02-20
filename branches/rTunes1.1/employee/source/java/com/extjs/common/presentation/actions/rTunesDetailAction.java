package com.extjs.common.presentation.actions;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.extjs.common.errorhandler.PresentationException;
import com.extjs.common.presentation.forms.RTunesForm;


public class rTunesDetailAction extends Action {

	@SuppressWarnings("finally")
	public ActionForward execute(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		ActionForward actionForward = mapping.findForward("fail");
		try {
			RTunesForm rTForm = (RTunesForm) form; 
			String respType = rTForm.getResponseType();
			String command = rTForm.getCommand();
			String userName = rTForm.getUserName();
			String cmd = "/saba/rTunesWeb ";
			cmd = cmd.concat(command);
			Runtime run = Runtime.getRuntime();
			Process pr = null;
			pr = run.exec(cmd);
			pr.waitFor();
			BufferedReader buf = new BufferedReader(new InputStreamReader(pr.getInputStream()));
			String respString = "";
			String resp = "";
			while ((resp = buf.readLine()) != null) {
				respString += resp;
			}
			if(respType.equalsIgnoreCase("html")){
				request.setAttribute("html", respString.toString());
				actionForward = (mapping.findForward("htmlSuccess"));
			}else if(respType.equalsIgnoreCase("json")){
				request.setAttribute("json", respString);
				actionForward = (mapping.findForward("jsonSuccess"));
			}
			if(command.contains("trackLocation")){
				String loca = respString.toString();
				loca = loca.replaceAll(":", "/");
				loca = loca.replaceAll("alias Macintosh", "");
				String fileName = loca;
				File file = new File(fileName);
				//return an application file instead of html page
				response.setContentType("application/octet-stream");
				System.out.println(userName + " requested : " + fileName);
				byte[] data = getBytesFromFile(file);
				response.setContentLength(data.length);
				String range = request.getHeader("range");
				response.setHeader("Content-Range", range + Integer.valueOf(data.length-1));
				response.setHeader("Accept-Ranges", "bytes");
				response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"" );
		       	byte[] content = new byte[1024];
	            BufferedInputStream is = new BufferedInputStream(new ByteArrayInputStream(data));
	            ServletOutputStream os = response.getOutputStream();
	            while (is.read(content) != -1) {
	                os.write(content);
	            }
	            is.close();
	            os.flush();
	            os.close();
			} else {
				System.out.println(userName + " requested : " + command);
			}
		} catch (IOException e) {
			//e.printStackTrace();
			System.out.println("Error : Exception while streaming....!");
		} catch (Exception ex) {
			throw new PresentationException(ex);
		} finally{
			return actionForward;
		}
	}
	
	private static byte[] getBytesFromFile(File file) throws IOException {
        InputStream is = new FileInputStream(file);
        //System.out.println("\nDEBUG: FileInputStream is " + file);
        // Get the size of the file
        long length = file.length();
        //System.out.println("Info: Length of " + file + " is " + length + "\n");
        /*
         * You cannot create an array using a long type. It needs to be an int
         * type. Before converting to an int type, check to ensure that file is
         * not loarger than Integer.MAX_VALUE;
         */
        if (length > Integer.MAX_VALUE) {
            System.out.println("File is too large to process");
            return null;
        }
        // Create the byte array to hold the data
        byte[] bytes = new byte[(int)length];
        // Read in the bytes
        int offset = 0;
        int numRead = 0;
        while ( (offset < bytes.length)
                &&
                ( (numRead=is.read(bytes, offset, bytes.length-offset)) >= 0) ) {
            offset += numRead;
        }
        // Ensure all the bytes have been read in
        if (offset < bytes.length) {
            throw new IOException("Could not completely read file " + file.getName());
        }
        is.close();
        return bytes;
    }
}
