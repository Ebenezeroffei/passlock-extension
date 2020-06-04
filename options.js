$(function(){
	// Checks if a user has already signed in
	chrome.storage.sync.get(['username','firstName','lastName','accountTotal'],function(details){
		if(details.username){
			$('#auth-container').slideUp();
			$('#wrapper').append(userDetails(details.username,details.firstName,details.lastName,details.accountTotal));
			// Clear the user details container when the user logs out
			$('#logout').click(function(){
				chrome.storage.sync.set({'username':'','password':'','firstName':'','lastName':'','accountTotal':''},function(){
					$('#user-details').slideUp(function(){
						$(this).remove();
						$('#auth-container').css('opacity','1');
						$('#auth-container').slideDown();
					})
				})
			})
		}
		else{
			$('#auth-container').slideDown(function(){
				$(this).css('opacity','1');
			});	
		}
	});
	
	// Checks if the user signing in is valid
	$('#signin').click(function(){
		let username = $('#id_username').val();
		let password = $('#id_password').val();
//		console.log(username);
//		console.log(password);
		if(username && password){
			$.ajax({
				url: "http://localhost:8000/extension/user/verify/",
				crossDomain:true,
				data: {
					username,
					password,
				},
				dataType: "json",
				success: function(data){
					
					if(data['status']){
						chrome.storage.sync.set({'username':username,'password':password,'firstName':data['first_name'],'lastName':data['last_name'],'accountTotal':data['number_of_accounts']},function(){
							$('#auth-container').slideUp();
							$('#wrapper').append(userDetails(username,data['first_name'],data['last_name'],data['number_of_accounts']));
							// Clear the user details container when the user logs out
							$('#logout').click(function(){
								chrome.storage.sync.set({'username':'','password':'','firstName':'','lastName':'','accountTotal':'','fields':''},function(){
									$('#user-details').slideUp(function(){
										$(this).remove();
										$('#auth-container').css('opacity','1');
										$('#auth-container').slideDown();
									})
								})
							})
							// Clear the input fields
							$('#id_username').val('');
							$('#id_password').val('');
							// Reset the password type
							$('#id_password').attr('type','password');
							// Clear the errors
							$("#errors").html('');
						});
					}
					else{
						$('#errors').html("Incorrect username and/or password<br/> <a href = 'http://localhost:8000/user/register/'>Create new passlock account.</a>");
					}
						
				}
			});
		}
		else{
			$('#errors').text("You forgot to fill some input fields..");
		}
	});
	
	// A function that shows or hides the password
	$('#show-hide').click(function(){
		if($(this).text() === 'Show'){
			$(this).text('Hide');
			$('#id_password').attr('type','text');
		}
		else{
			$(this).text('Show');
			$('#id_password').attr('type','password');
		}
	})
	
	// A function that produces the user details
	let userDetails = (username,firstName,lastName,accountTotal) => {
		return `<div id = 'user-details' class="card border-info mt-5">
						<div class="card-header bg-info text-center text-light lead">
							User Profile
						</div>
						<div class="card-body">
							<div class="row">
								<div class="col-sm-6 text-center">
									<img class="rounded-circle" style="border:8px solid rgba(0,0,0,.125);padding:5px;" width="200px" height="200px" src="default.png" alt="User avatar">
								</div>
								<div class="col-sm-6 mt-sm-0 mt-5 text-sm-left text-center">
									<p class="lead">First Name: <span class="text-info">${firstName}</span></p>
									<p class="lead">Last Name: <span class="text-info">${lastName}</span></p>
									<p class="lead">Username: <span class="text-info">${username}</span></p>
									<p class="lead">Number of accounts: <span class="text-info">${accountTotal}</span></p>
									<button id="logout" class="btn btn-danger btn-block" >Logout</button>
								</div>
							</div>
						</div>
					</div>`;
	}
})