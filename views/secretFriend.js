$(document).ready(function(){
    $("button").click(function(){
		$.ajax({
		dataType: 'json',
		type: "POST",
		url: "https://xmasapp.mybluemix.net/assign/" + $('select').val(),
		
		success: function(data) {
			
        $('#secret').html(data.secretFriend.name); 
		$('#error').html('');
      },
	  error:function(jqXHR,textStatus,errorThrown){
		  $('#error').html(jqXHR.responseText ); 
	  }		
    });
    });

});
