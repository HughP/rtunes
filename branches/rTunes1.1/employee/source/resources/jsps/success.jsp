
<%@page import="com.extjs.commonentity.UserDetail"%>
<%@page import="com.extjs.commonentity.UserSettings"%>
<html>
<head>
<title>Rhushi-Testing</title>
</head>
<body>
<%

    UserSettings userSettings = (UserSettings) session.getAttribute( "userSettings");
	String name = userSettings.getFirstName() + " " + userSettings.getLastName();

%>

Success :
<%=name %>
</body>
</html>