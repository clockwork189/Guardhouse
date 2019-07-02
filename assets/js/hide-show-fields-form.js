$("#seeAnotherField").change(function() {
			if ($(this).val() == "dropIn") {
				$('#dropInDiv').show();
				$('#dropIn').attr('required','');
				$('#dropIn').attr('data-error', 'This field is required.');
				$('#firstClassDiv').hide();
				$('#firstClass').removeAttr('required');
				$('#firstClass').removeAttr('data-error');	
			} 
			else if ($(this).val() == "firstClass") {
				$('#firstClassDiv').show();
				$('#firstClass').attr('required','');
				$('#firstClass').attr('data-error', 'This field is required.');
				$('#dropInDiv').hide();
				$('#dropIn').removeAttr('required');
				$('#dropIn').removeAttr('data-error');		
			}


			else {
				$('#dropInDiv').hide();
				$('#dropIn').removeAttr('required');
				$('#dropIn').removeAttr('data-error');
				$('#firstClassDiv').hide();
				$('#firstClass').removeAttr('required');
				$('#firstClass').removeAttr('data-error');			
			}
		});
		$("#seeAnotherField").trigger("change");
		
