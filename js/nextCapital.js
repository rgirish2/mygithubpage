var user_email;
var user_id;
var user_token;
var user_todos = [];

function getRecords (event) {
	var emailVal = $("#email").val();
	var pwd = $("#password").val();
    $.ajax ({
		url : "http://recruiting-api.nextcapital.com/users",
		type : "POST",
		data : {email : emailVal, password : pwd},
		crossDomain : true,
		datatype : "jsonp",
		success : function (response) {
					assignValues(response);
				},
		error : function (response) {
					alert(response.email);
					alert("Error in request. Please try again.");				
				}
	});
};

function assignValues (result) {
	user_email = result.email;
	user_id = result.id;
	user_token = result.api_token;
	user_todos = result.todos;
	showDetails();
	return;
};

function showDetails () {
	$("#coreDiv").empty();
	$("#coreDiv").append("<p>" + user_email + "</p><p>" + user_id + "</p><p>" + user_token + "</p>");
};

