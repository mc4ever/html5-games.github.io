/*!
 * Main JS code goes here
 */

// Init Parse
Parse.initialize("cF1KaOFNgSERAxKgv4ZUDE3XBnMEpGxF2ACWmMZE", "tnNd8KSP42GsJ9ZyBVaaN9REYRW76gUj9sxm8e3i");

// Init Parse objects
var Post = Parse.Object.extend("Post");
var Comment = Parse.Object.extend("Comment");
var Message = Parse.Object.extend("Message");

// Init DOM elements
var $linkTiles = $(".link-tile");
$linkTiles.eq(0).height($linkTiles.eq(1).height() + 32 /* Padding and Border */);

level1 = '<b>Newb</b> Can post in chat';
level2 = '<b>?</b> ?';
level3 = '<b>?</b> ?';
level4 = '<b>?</b> ?';
level5 = '<b>?</b> ?';
level6 = '<b>?</b> ?';
level7 = '<b>?</b> Can write blog posts';
level8 = '<b>?</b> ?';
level9 = '<b>Moderator</b> Can edit and delete posts';
level10 = '<b>Leader</b> Can use admin features';
$("#level1").popover({html: true, placement: "bottom", content: level1});
$("#level2").popover({html: true, placement: "bottom", content: level2});
$("#level3").popover({html: true, placement: "bottom", content: level3});
$("#level4").popover({html: true, placement: "bottom", content: level4});
$("#level5").popover({html: true, placement: "bottom", content: level5});
$("#level6").popover({html: true, placement: "bottom", content: level6});
$("#level7").popover({html: true, placement: "bottom", content: level7});
$("#level8").popover({html: true, placement: "bottom", content: level8});
$("#level9").popover({html: true, placement: "bottom", content: level9});
$("#level10").popover({html: true, placement: "bottom", content: level10});

currentUser = Parse.User.current();
if (currentUser != null) {
	$("#username-profile").text(currentUser.get("username"));
	var joined = currentUser.createdAt;
	$("#joined-profile").text(joined.getMonth() + "/" + joined.getDate() + "/" + joined.getFullYear().toString().substring(2, 4));
	$("#level-profile").text(currentUser.get("level"));
	$(".persona-icon").each(function() {
		$(this).css("background-image", "url('http://www.gravatar.com/avatar/" + md5(currentUser.get("email")) + ".jpg?s=160&d=wavatar')");
	});
}

// Log In & Sign Up
function signUp() {
	// Get values
	var $username = $("#name-signup"),
	    $password = $("#psword-signup"),
	    $password2 = $("#psword2-signup"),
	    $email = $("#email-signup");
	    
	var username = $username.val(),
	    password = $password.val(),
	    password2 = $password2.val(),
	    email = $email.val();
	
	// Remove styling
	$username.parent().parent().removeClass("error");
	$password.parent().parent().removeClass("error");
	$password2.parent().parent().removeClass("error");
	$email.parent().parent().removeClass("error");
	$username.parent().children().eq(1).text("");
	$password.parent().children().eq(1).text("");
	$password2.parent().children().eq(1).text("");
	$email.parent().children().eq(1).text("");
	
	// Validate
	if (username.length == 0) {
		$username.parent().parent().addClass("error");
		return false;
	}
	else if (password.length < 7) {
			$password.parent().parent().addClass("error");
			$password.parent().children().eq(1).text("Password must be at least 7 characters!");
			return false;
	}
	else if (email.length == 0) {
			$email.parent().parent().addClass("error");
			return false;
	}
	else if (password != password2) {
		$password.parent().parent().addClass("error");
		$password2.parent().parent().addClass("error");
		$password.parent().children().eq(1).text("Passwords don't match!");
		return false;
	}
	
	// Sign up user
	var user = new Parse.User();
	user.set("username", username);
	user.set("password", password);
	user.set("email", email);
	user.set("level", 1);

	user.signUp(null, {
		success: function(user) {
			// Login user
			Parse.User.logIn(username, password, {
				success: function(user) {
					buildMenu();
				},
				error: function(user, error) {
					alert("Error: " + error.code + " " + error.message);
					return false;
				}
			});
			
			// Hide modal
			$("#signup").modal("hide");
			
			// Show menu
			$("#login-menu-link").dropdown('toggle');
		},
		error: function(user, error) {
			if (error.code == 202) {
				$username.parent().parent().addClass("error");
				$username.parent().children().eq(1).text("Username taken!");
				return false;
			}
			else {
				alert("Error: " + error.code + " " + error.message);
				return false;
			}
		}
	});
}

function logIn() {
	// Get values
	var $username = $("#name-login"),
	    $password = $("#psword-login");
	    
	var username = $username.val(),
	    password = $password.val();
	
	// Remove styling
	$username.parent().parent().removeClass("error");
	$password.parent().parent().removeClass("error");
	$username.parent().children().eq(1).text("");
	$password.parent().children().eq(1).text("");
	
	// Validate
	if (username.length == 0) {
		$username.parent().parent().addClass("error");
		return false;
	}
	else if (password.length == 0) {
			$password.parent().parent().addClass("error");
			return false;
	}
	
	Parse.User.logIn(username, password, {
		success: function(user) {
			buildMenu();
			
			// Hide modal
			$("#login").modal("hide");

			// Show menu
			$("#login-menu-link").dropdown('toggle');
		},
		error: function(user, error) {
			if (error.code == 101) {
				$username.parent().parent().addClass("error");
				$password.parent().parent().addClass("error");
				return false;
			}
			else {
				alert("Error: " + error.code + " " + error.message);
				return false;
			}
		}
	});
}

function logOut() {
	Parse.User.logOut();
	window.location.href = 'index.html';
	buildMenu();
}

function buildMenu() {
	// Get login menu
	$loginMenu = $("#login-menu");
	
	// Clear login menu
	$loginMenu.html("");
	
	// If user not logged in
	if (Parse.User.current() == null) {
		$login = $('<li><a tabindex="-1" href="#login" role="button" data-toggle="modal">Login</a></li>');
		$signup = $('<li><a tabindex="-1" href="#signup" role="button" data-toggle="modal">Sign Up</a></li>');
		$("#login-menu").append($login);
		$("#login-menu").append($signup);
	}
	// If user logged in
	else {
		$profile = $('<li><a tabindex="-1" href="profile.html">Hi, ' + Parse.User.current().get("username") + '</a></li>');
		$logout = $('<li><a tabindex="-1" href="#" onclick="logOut();">Logout</a></li>');
		$("#login-menu").append($profile);
		$("#login-menu").append($logout);
	}
}

buildMenu();

// Chat
function sendMessage() {
	// Make sure that user is logged in
	currentUser = Parse.User.current();
	if (currentUser == null) {
		alert("You must login to use chat.");
		return false;
	}
	
	// Make sure that message isn't empty
	text = $("#message-chat").val();
	if (text == "") {
		alert("Can't send empty message!")
		return false;
	}
	
	// Create new message
	var message = new Message();
	message.set("text", text);
	message.set("user", currentUser.get("username"));
	
	// Save message
	message.save(null, {
		success: function(message) {
			// Clear message box
			$("#message-chat").val("");
			
			// Update message display
			displayMessages();
		},
		error: function(message, error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function displayMessages() {
	$messages = $("#all-messages-chat");
	
	// Get messages from Parse
	var query = new Parse.Query(Message);
	
	// Retrieve only the most recent ones
	query.descending("createdAt");
	 
	// Retrieve only the last 25
	query.limit(25);
	
	query.find({
		success: function(messages) {
			// The final html for $messages
			var result = "";
	
			while (messages.length > 0) {
				var messageObject = messages.pop();
				var user = messageObject.get("user");
				var m = '<div class="messages">';
				m += user + " ";
				m += "(" + messageObject.createdAt.toLocaleTimeString() + "): ";
				m += messageObject.get("text");
				m += "</div>"
				result += m;
			}
			
			$messages.html(result);
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

// Blog
function post() {
	// Make sure that user is logged in
	currentUser = Parse.User.current();
	if (currentUser == null) {
		alert("You must login to write posts.");
		return false;
	}
	
	// Make sure that user at least level 7
	if (currentUser.get("level") < 7) {
		alert("You must be level 7 or heigher to write posts.");
		return false;
	}
	
	// Get post data
	var title = $("#title-post").val();
	var text = $("#text-post").val();
	var tags = [];
	if ($("#tag1-post").val() != "") {
		tags.push($("#tag1-post").val());
	}
	if ($("#tag2-post").val() != "") {
		tags.push($("#tag2-post").val());
	}
	if ($("#tag3-post").val() != "") {
		tags.push($("#tag3-post").val());
	}
	if ($("#tag4-post").val() != "") {
		tags.push($("#tag4-post").val());
	}
	
	// Create new post
	var post = new Post();
	post.set("title", title);
	post.set("text", text);
	post.set("tags", tags);
	post.set("user", currentUser.get("username"));
	
	// Save message
	post.save(null, {
		success: function(post) {
			// Hide modal
			$("#post").modal("hide");
		},
		error: function(message, error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}
