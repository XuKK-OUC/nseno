<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true"%>
<%@ page import="com.nsneo.web.webTemplate.WebFaceForwardServiceContextFactory"%>
<%
	HttpServlet httpServlet = null;
	if(page instanceof HttpServlet){
		httpServlet = (HttpServlet)page;
	}
	WebFaceForwardServiceContextFactory.getInstance().errorInvokePage(httpServlet,request, response,exception);
%>
