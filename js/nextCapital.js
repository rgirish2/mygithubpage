"use strict";

var user_email = null;
var user_id = null;
var user_token = null;
var user_todos = [];
var user_todosIDs = [];

function signUp (event) {
	var signUpEmailVal = $("#signUpEmail").val();
	var signUpPwd = $("#signUpPassword").val();
    var signUpEmailElement = document.getElementById("signUpEmail");
    var signUpPwdElement = document.getElementById("signUpPassword");
    signUpEmailElement.value = "";
    signUpPwdElement.value = "";

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

function signIn (event) {
	var signInEmailVal = $("#signInEmail").val();
	var signInPwd = $("#signInPassword").val();
    var signInEmailElement = document.getElementById("signInEmail");
    var signInPwdElement = document.getElementById("signInPassword");
    signInEmailElement.value = "";
    signInPwdElement.value = "";
	
    $.ajax ({
		url : "http://recruiting-api.nextcapital.com/users/sign_in",
		type : "POST",
		data : {email : signInEmailVal, password : signInPwd},
		crossDomain : true,
		datatype : "jsonp",
		success : function (response) {
            assignValues(response);
		},
		error : function (response, status, error) {
            alert("Error signing in. Please try again.");
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
	user_todosIDs = null;

	$("#sortable").empty();	
	$("#listsGoHereDiv").hide();
	$("#logOutButton").hide();
	$("#writeAndButtonsDiv").show();
};

function updateToDo(todoId) {
    $("#updateTodoModalHeaderLabel").empty();
    $("#updateTodoModalHeaderLabel").append(todoId);
    
    var currentDescription = "";
    
    for (var i = user_todos.length - 1; i >= 0; i--) {
        if (user_todos[i].id == todoId) {
            currentDescription = currentDescription + user_todos[i].description;
            break;
        }
    }

    var updateTodoHTML = '<label class="col-sm-4 control-label" for="updateTodoDescription" style="color:black">Description</label><div class="col-sm-8"><textarea class="form-control" id="updateTodoDescription">' + currentDescription + '</textarea></div><label class="col-sm-4 control-label" for="updateTodoIsComplete" style="color:black">is_complete: </label><div class="col-sm-8"><select class="form-control" id="updateTodoIsComplete"><option value=true>True</option><option value=false>False</option></select></div>';
    
    $("#todoIdContentGoesHere").empty();
    $("#todoIdContentGoesHere").append(updateTodoHTML);
        
    $("#updateATodoModal").modal({
        show : true
    }); 
};

function submitUpdateTodoRequest() {
    $("#updateATodoModal").modal({
        show : false
    });
    
    var newDescription = $("#updateTodoDescription").val();
    var newIsCompleteValue = $("#updateTodoIsComplete").val();
    var todoIdToUpdate = $("#updateTodoModalHeaderLabel").text();
    
    var todoUpdateURL = "http://recruiting-api.nextcapital.com/users/" + user_id + "/todos/" + todoIdToUpdate;
    
    $("#updateTodoModalHeaderLabel").empty();
    $("#todoIdContentGoesHere").empty();
    
    $.ajax ({
        url : todoUpdateURL,
        type : "PUT",
        data : {api_token : user_token, todo : {description : newDescription, is_complete : newIsCompleteValue}},
        crossDomain : true,
        datatypes : "jsonp",
        success : function (response) {
            updateATodoInList (todoIdToUpdate, response);
            $("#sortable").empty();
            showDetails();
        },
        error : function (response, status, error) {
            alert("Todo cannot be update. Please try again.");           
        }    
    });
};

function updateATodoInList (todoIdToUpdate, newValueForThis) {
    for (var i = user_todos.length - 1; i >= 0; i--) {
        if (user_todos[i].id == todoIdToUpdate) {
            user_todos.splice(i, 1);
        }
    }
    
    user_todos.push({
        description : newValueForThis.description,
        id : newValueForThis.id,
        is_complete : newValueForThis.is_complete
    });
    return;    
};

function showCreateANewTodoModal() {
    $("#addNewTodoModal").modal({
        show : true
    });
};

function submitCreateANewTodoRequest() {
    $("#addNewTodoModal").modal({
        show : false
    });
    
    var descriptionOfNewTodo = $("#newTodoDescription").val();
    var baseCreateANewTodoUrl = "http://recruiting-api.nextcapital.com/users/";
    
    $.ajax({
        url : baseCreateANewTodoUrl + user_id + "/todos",
        type : "POST",
        data : {api_token : user_token, todo : {description : descriptionOfNewTodo}},
        crossDomain : true,
        datatypes : "jsonp",
        success : function (response) {
            user_todos.push({
                description : response.description,
                id : response.id,
                is_complete : response.is_complete
            });
            $("#sortable").empty();
            showDetails();
        },
        error : function (response, status, error) {
            alert("Error adding a new todo. Please try again.")
        }
    });
};

function getUserTodos (id, token) {
    $.ajax({
        url : "http://recruiting-api.nextcapital.com/users/" + id + "/todos",
        data : {api_token : token},
        type : "GET",
        crossDomain : true,
        datatypes : "jsonp",
        success : function (response) {
            user_todos = response;
            showDetails();
        },
        error : function (response, status, error) {
            alert("Could not retrieve todos. Logout and try again.")
        }
    }); 
};

function assignValues (result) {
	user_email = result.email;
	user_id = result.id;
	user_token = result.api_token;
	user_todosIDs = result.todos;
    
    getUserTodos(user_id, user_token);
	return;
};

function showDetails () {
	$("#writeAndButtonsDiv").hide();
	listUserTodos();
	$("#logOutButton").show();
	$("#listsGoHereDiv").show();
};

function listUserTodos () {
    var oneItemHTMLBefore = '<div id="col-sm-12" style="padding-bottom: 15px; padding-top:15px; text-shadow:0 1px 3px rgba(255, 255, 255, .5)"><li class="ui-state-default" style="color:black"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>';
    
    var oneItemHTMLAfter = '<button id="btn btn-sm btn-primary" style="margin-left: 15px" onClick="updateToDo(';
    
    var oneItemHTMLAfterAfter = ')">Update</button></li></div>';
    
    if (user_todos !== null) {
        for (var i = 0; i < user_todos.length; i++) {
            var oneItemCompleteHTML = oneItemHTMLBefore + "Description: " + user_todos[i].description + " is_complete: " + user_todos[i].is_complete + oneItemHTMLAfter + user_todos[i].id + oneItemHTMLAfterAfter;
            $("#sortable").append(oneItemCompleteHTML);
	    }
	}
};

$(function() {
	$( "#sortable" ).sortable();
	$( "#sortable" ).disableSelection();
});

