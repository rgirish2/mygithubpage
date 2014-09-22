"use strict"

var user_email;
var user_id;
var user_token;
var user_todos = [];

function signUp (event) {
	var signUpEmailVal = $("#signUpEmail").val();
	var signUpPwd = $("#signUpPassword").val();
    $.ajax ({
		url : "http://recruiting-api.nextcapital.com/users",
		type : "POST",
		data : {email : signUpEmailVal, password : signUpPwd},
		crossDomain : true,
		datatype : "jsonp",
		success : function (response) {
					assignValues(response);
		},
		error : function (response) {
					alert("Error in request. Please try again.");				
		}
	});
};

function logoutCurrentUser(event) {
	$.ajax({
		url : "http://recruiting-api.nextcapital.com/users/sign_out",
		type : "DELETE",
		data : {api_token : user_token, user_id : user_id},
		crossDomain : true,
		datatype : "jsonp",
		success : function () {
					logOutCleanUp();
		},
		error : function () {
					alert("Issues with logging out. Removing all current data. Please log-in again.");
					logOutCleanUp();
		}
		
	});	
};

function logOutCleanUp () {
	user_email = null;
	user_id = null;
	user_token = null;
	user_todos = null;

	$("#listsGoHereDiv").empty();	
	$("#listsGoHereDiv").hide();
	$("#logOutButton").hide();
	$("#writeAndButtonsDiv").show();
};

function signIn (event) {
	var signInEmailVal = $("#signInEmail").val();
	var signInPwd = $("#signInPassword").val();
	$.ajax ({
		url : "http://recruiting-api.nextcapital.com/users/sign_in",
		type : "POST",
		data : {email : signInEmailVal, password : signInPwd},
		crossDomain : true,
		datatype : "jsonp",
		success : function (response) {
					assignValues(response);
		},
		error : function (response) {
					alert("Error signing in. Please try again.");
		}
	});
};

function deleteToDo(id) {

};

function updateToDo(id) {

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
	$("#writeAndButtonsDiv").hide();
	$("#logOutButton").show();
	$("#listsGoHereDiv").show();
};

$(function() {
	$( "#sortable" ).sortable();
	$( "#sortable" ).disableSelection();
});

