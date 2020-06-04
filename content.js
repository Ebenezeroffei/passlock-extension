// Track all submit buttons that have been clicked 

$('input[type = "submit"], button[type = "submit"]').click(function(){
	let labelsList = [];
	let inputValuesList = [];
	let inputTypesList = [];
	let fields = [];
	// Get all the labels in it
	$('label').each(function(){
//		console.log($(this).text());
		labelsList.push($(this).text());
	})
	$('input:not(input[type = "submit"])').each(function(){
//		console.log($(this).val());
		if ($(this).val()){
			inputValuesList.push(encryptBeforeAppend($(this).val()));
			inputTypesList.push($(this).attr('type'))
		}
			
	})
	
	if(labelsList.length < inputValuesList.length){
		$('input:not(input[type = "submit"])').each(function(){
			labelsList.push($(this).attr('placeholder'));
		})
	}
	if(labelsList.length === inputValuesList.length){
		console.log(labelsList)
		console.log(inputValuesList)
		console.log(inputTypesList)
		for(let i = 0; i < inputTypesList.length; i++){
			fields.push({
				'fieldName': labelsList[i],
				'fieldType': inputTypesList[i],
				'fieldValue': inputValuesList[i]
			});
		}
		console.log(fields)
		chrome.storage.sync.set({"fields":fields});
		// Don't forget about the notificattion
	}
});

// A function that encrypts any string before appending it to the fields
		let encryptBeforeAppend = (string) => {
			let encWord = "";
			let countAdditions = "";
			let ciphers = "r+emip^sudo2lorsi%}tamet,c8on=se@cte3tu?raisc$ing_6elit.Ma0u)s&1aliq7u!et[5male9ad#afeugiat.4Cu*b(itur";
			for(let word of string){
				let encLetter = word;
				let additions = Number(String(Math.random() * 10).split('.')[0]);
				for(let i = 0;i < additions;i++){
					let pos = Number(String(Math.random() * 100).split('.')[0]);
					encLetter += ciphers[pos];
				}
				countAdditions += additions;
				encWord += encLetter;
			}
			encWord += `-${countAdditions}`;
//			console.log(encWord)
			return encWord;
		}

