$(function(){
	// A function that checks if a user is logged in or not
	function isUserLoggedIn(){
		chrome.storage.sync.get(['username','password','fields'],function(auth){
			if(auth.username && auth.password){
				$('.card-body').append(
					`<img src = 'default.png' alt = 'User Avatar' class = 'rounded-circle' style = 'width:150px;height:150px;padding:3px;border:3px solid rgba(0,0,0,.125);'/>
					<p class = 'text-dark text-center'>Hi<span class = 'text-info'> ${auth.username}</span></p>`
				);
				if(Object.keys(auth.fields).length > 0){
					$('.card-body').append(
						`<div id = 'remove-or-upload'>
							<p>Upload your account to passlock.</p>
							<div>
								<p class= 'text-left small'>Unknown Account <span style = 'float:right;border-radius:20px;padding:0px 2px;cursor:pointer;border:thin solid rgba(0,0,0,.2);' id = 'expand-or-contract'>+</span></p>
								<div id = 'account-fields' class = 'mb-2'></div>
							</div>
							<div class = "btn-group btn-group-sm w-100">
								<button id = 'upload' class = 'btn btn-success'>Upload</button>
								<button id = 'remove' class = 'btn btn-secondary'>Remove</button>
							</div>
						</div>
						<button id = 'logout' class = "btn mt-4 btn-block btn-danger btn-sm">Logout</button>`
					);
					
					// Slide up the fields options
					$('#account-fields').slideUp(function(){
						for(let field of auth.fields){
							$(this).append(
								`<div style = 'position:relative'>
									<hr style = 'margin:auto'>
									<p style = 'margin:auto' class = 'small text-left'>${field['fieldName']}:</p>
									<p style = 'margin:auto' class = 'small text-left'>${decryptWord(field['fieldValue'])}</p>
									<p style = 'position:absolute;right:0px;top:1px;padding:7px 10px;cursor:pointer;' title = 'Remove Field' class = 'bg-danger text-light text-center remove-field'>x</p>
								</div>`
							);
						}
					});
					
					// Expand or contract
					$('#expand-or-contract').click(function(){
						if($(this).text() === '+'){
							$('#account-fields').slideDown();
							$(this).text('-');
						}
						else{
							$('#account-fields').slideUp();
							$(this).text('+');
						}
					});
					
					// Remove field
					$('.remove-field').click(function(){
						let fieldName = $(this).parent().find('p').eq(0).text();
						let fields = auth.fields;
						let count = 0;
						console.log("Hmmm")
						console.log(fieldName)
						for(let field of fields){
							if(field['fieldName'] === fieldName){
								fields.splice(count,1);
								chrome.storge.sync.set({'fields':fields});
								$(this).parent().slideUp(function(){
									$(this).remove();
								});
								break;
							}
							count ++;
						}
					});
					
					// Upload the account to passlock
					$('#upload').click(function(){
						$('.btn-group').slideUp(function(){
							$(this).remove();
							$('#remove-or-upload').append(
								`<input type = 'text' class = 'form-control form-control-sm' placeholder = 'Account name'/>
								<button id = 'upload-to-passlock' class = 'btn-block btn-sm mt-2 btn btn-success'>Upload</button>`
							);
							$('#upload-to-passlock').click(function(){
								// Has the user given the name for the account
								if($('input[type = "text"]')){
									let accountName  = $('input[type = "text"]').val();
									chrome.storage.sync.get(['fields','username'],function(auth){
										for(let field of auth.fields){
											field['accountName'] = accountName;
											field['username'] = auth.username;
											$.ajax({
												url: 'http://localhost:8000/account/extension/create-custom-field-for-account/',
												data: field,
												dataType: 'json'
											});
										}
										chrome.storage.sync.set({'fields':''},function(){
											$('#remove-or-upload').slideUp(function(){
												$(this).remove();
												// Don't forget to add a notification
											})
										});
									});
								}
							});
						});
					})
					
					// Remove an account stored in the chrome storage
					$('#remove').click(function(){
						chrome.storage.sync.set({'fields':''},function(){
							$('#remove-or-upload').slideUp(function(){
								$(this).remove()
							})
						});
					})
				}
				else{
					$('.card-body').append(`<button id = 'logout' class = "btn btn-block mt-4 btn-danger btn-sm">Logout</button>`);
				}
				$('#logout').click(function(){
					$('.card-body').slideUp(function(){
						chrome.storage.sync.set({'username':'','password':'','firstName':'','lastName':'','accountTotal':'','fields':''},function(){
							$('.card-body').empty();
							$('.card-body').append(
								`<p class = 'text-center text-info'>Opps! Looks like no one has signed in</p>`
							);
							$('.card-body').slideDown();
						});
					});
				});
			}
			else{
				$('.card-body').append(
					`<p class = 'text-center text-info'>Opps! Looks like no one has signed in</p>
					<a href = "options.html" class = "btn btn-block btn-dark btn-sm">Sign In</a>`
				);
			}
		});
	}
	isUserLoggedIn()
	
	
	// A function that decrypts a word
	let decryptWord = (string) => {
		// Get the encrypted field value
		let values = string.split('-')[0]
		let keys = string.split('-')[1]
		let field_value = ""
		let count = 0
		//Decrypt it
		for(let i of keys){
			if(count < values.length){
				field_value += values[count];
				count += Number(i) + 1;
			}
		}
		
		return field_value;
	}
})