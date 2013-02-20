<html>
	<head>
		<title>Rhushi-Login</title>
		<!--link href="css/login.css" rel="stylesheet" type="text/css" /-->
		<link href="/js/thirdpartylib/jquery/tipsy/front.css" media="screen, projection" rel="stylesheet" type="text/css">
		<style type="text/css">
	        .style1{text-align: justify;}
	    </style>
		<script type="text/javascript" src="/js/thirdpartylib/jquery/js/jquery.min.js"></script>
	    
        <script>
            var validate = function(obj){
                var val = obj.id.value;
                if(trimString(val).length <= 0){
                    alert("Please enter OpenID URL");
                    return false;
                }else{
                    return true;
                }
            };
            
            var trimString = function (tempStr){
               return tempStr.replace(/^\s*|\s*$/g,"");
            };
            
            $(document).ready(function() {
	            $(".signin").click(function(e) {
					e.preventDefault();
	                $("fieldset#signin_menu").toggle();
					$(".signin").toggleClass("menu-open");
	            });

				$("fieldset#signin_menu").mouseup(function() {
					return false;
				});
				
				$(".signup").click(function(e) {
					e.preventDefault();
	                $("fieldset#signup_menu").toggle();
					$(".signup").toggleClass("menu-open");
	            });

				$("fieldset#signup_menu").mouseup(function() {
					return false;
				});

				$(document).mouseup(function(e) {
					if($(e.target).parent("a.signin").length==0) {
						$(".signin").removeClass("menu-open");
						$("fieldset#signin_menu").hide();
					}
					if($(e.target).parent("a.signup").length==0) {
						$(".signup").removeClass("menu-open");
						$("fieldset#signup_menu").hide();
					}
				});			
        	});
        </script>
    </head>
    <body>
    	<div id="logo">
        	<div id="slogan">
            	&nbsp;
            </div>
    	</div>
    	<div id="main">
    	<div id="container">
							  <div id="topnav"class="topnav"> Have an account? <a href="login" class="signin"><span>Sign in</span></a> </div>
							  <fieldset id="signin_menu">
							    <form method="post" id="signin" action="/login.do">
							      <label for="username">Username or email</label>
							      <input id="username" name="username" value="" title="username" tabindex="4" type="text">
							      </p>
							      <p>
							        <label for="password">Password</label>
							        <input id="password" name="password" value="" title="password" tabindex="5" type="password">
							      </p>
							      <p class="remember">
							        <input id="signin_submit" value="Sign in" tabindex="6" type="submit">
							        <input id="remember" name="remember_me" value="1" tabindex="7" type="checkbox">
							        <label for="remember">Remember me</label>
							      </p>
							      <p class="forgot"> <ahref="#" id="resend_password_link">Forgot your password?</a> </p>
							      <p class="forgot-username"> <a id=forgot_username_link title="Don't have me-music account create here" href="#">Create me-music account?</a> </p>
							    </form>
							    <a href="register"class="signup"><span>Sign up</span></a>
							  </fieldset>
							  <fieldset id="signup_menu">
							  	<form method="post" id="register" action="/signUpAction.do">
							      <label for="userName">Username or email</label>
							      <input id="userName" name="userName" value="" title="userName" tabindex="8" type="text">
							      </p>
							      <p>
							        <label for="password">Password</label>
							        <input id="password" name="password" value="" title="password" tabindex="9" type="password">
							      </p>
							      <p>
							        <label for="firstName">First Name</label>
							        <input id="firstName" name="firstName" value="" title="firstName" tabindex="10" type="text">
							      </p>
							      <p>
							        <label for="lastName">Last Name</label>
							        <input id="lastName" name="lastName" value="" title="lastName" tabindex="11" type="text">
							      </p>
							      <p>
							        <label for="email">Email</label>
							        <input id="email" name="email" value="" title="email" tabindex="12" type="text">
							      </p>
							      <p class="remember">
							        <input id="signup_submit" value="Register" tabindex="13" type="submit">
							        <input id="remember" name="remember_me" value="1" tabindex="14" type="checkbox">
							        <label for="remember">Remember me</label>
							      </p>
							    </form>
							  </fieldset>
							</div>
        	<div id="sidebar">
            	<h1></h1>
        	</div>
        	<div id="text" >
		        <table cellpadding="10" cellspacing="10" align="center">
		        	<tr>
		                <td colspan="8" align="center">
					        <!--form action="/login.do" method="post">
					        	<table cellpadding="10" cellspacing="10" align="center">
		            				<tr>
		            					<td colspan="7">
		            						Username:
		            					</td>
		            					<td>
		            					<input type="text" name="username"></input>
		            					</td> 
		            				</tr>
		            				<tr>
	            						<td colspan="7">
											Password:
										</td>
										<td>
											<input type="password" name="password"></input>
										</td>
									</tr>
					        	</table>
								<button type="submit">Submit</button>
							</form-->
		                    <!--form action="socialAuth.do" onsubmit="return validate(this);">
		                        or enter OpenID url: <input type="text" value="" name="id"/>
		                        <input type="submit" value="Submit"/> 
		                    </form-->
		                    
		                </td>
		            </tr>
		            <tr><td colspan="8"><h3 align="center">Welcome to Social Music</h3></td></tr>
           		 	<tr><td colspan="8"><p align="center">Sign in using</p></td></tr>
		            <tr>
		                <td>
								<a href="socialAuth.do?id=facebook"><img src="images/facebook_icon.png" alt="Facebook" title="Facebook" border="0"></img></a>
								<br/><br/>
								
								
									<a href="socialAuth.do?id=facebook">Signin</a><br/>
								
							</td>
							<td>
								<a href="socialAuth.do?id=twitter"><img src="images/twitter_icon.png" alt="Twitter" title="Twitter" border="0"></img></a>
								<br/><br/>
								
								
									<a href="socialAuth.do?id=twitter">Signin</a><br/>
								
							</td>
							<td>
								<a href="socialAuth.do?id=google"><img src="images/gmail-icon.jpg" alt="Gmail" title="Gmail" border="0"></img></a>
								<br/><br/>
								
								
									<a href="socialAuth.do?id=google">Signin</a><br/>
								
							</td>
							<td>
								<a href="socialAuth.do?id=yahoo"><img src="images/yahoomail_icon.jpg" alt="YahooMail" title="YahooMail" border="0"></img></a>
								<br/><br/>
								
								
									<a href="socialAuth.do?id=yahoo">Signin</a><br/>
								
							</td>
							<td>
								<a href="socialAuth.do?id=hotmail"><img src="images/hotmail.jpeg" alt="HotMail" title="HotMail" border="0"></img></a>
								<br/><br/>
								
								
									<a href="socialAuth.do?id=hotmail">Signin</a><br/>
								
							</td>
							<td>
								<a href="socialAuth.do?id=linkedin"><img src="images/linkedin.gif" alt="Linked In" title="Linked In" border="0"></img></a>
								<br/><br/>
								
								
									<a href="socialAuth.do?id=linkedin">Signin</a><br/>
								
							</td>
							<td>
								<a href="socialAuth.do?id=foursquare"><img src="images/foursquare.jpeg" alt="FourSquare" title="FourSquare" border="0"></img></a>
								<br/><br/>
								
								
									<a href="socialAuth.do?id=foursquare">Signin</a><br/>
								
							</td>
							<td>
								<a href="socialAuth.do?id=myspace"><img src="images/myspace.jpeg" alt="MySpace" title="MySpace" border="0"></img></a>
								<br/><br/>
								
								
									<a href="socialAuth.do?id=myspace">Signin</a><br/>
								
							</td>
							<td>
								<a href="socialAuth.do?id=yammer"><img src="images/yammer.jpg" alt="Yammer" title="Yammer" border="0"></img></a>
								<br/><br/>
								
								
									<a href="socialAuth.do?id=yammer">Signin</a><br/>
								
							</td>
		            </tr>
		            
		            
		        </table>
			</div>
		</div>
		<script src="/js/thirdpartylib/jquery/tipsy/javascripts/jquery.tipsy.js" type="text/javascript"></script>
		<script type='text/javascript'>

    $(function() {

	  $('#forgot_username_link').tipsy({gravity: 'w'});   

    });

  </script>
		
    </body>
</html>