// Js handling the autorefresh option or the manual option

// Supposed to memorize the state of the check box
function AR_checkbox_cookie(){
	$("input[id='aRCB']").each(function(){
		  var id = $(this).attr('id');
		  var str = $.cookie("autorefresh");
		  //index de l'élément à retirer
		  if(str > 0){
		    $(this).prop('checked',true);
		  }
		  else{
		    $(this).prop('checked',false);
		  }
  	});
}



function manual_or_auto_refresh(){	

// If the checkbox is checked before using the call of function, this will run the function associated
	$("input[id='aRCB']").each(function(){
		if($(this).is(':checked')){
        	autoUpdate()
       	}else{//si décoché
       		if (myReset!= null){
      			clearInterval(myReset);
      		}
        	updateMap()
		}
	});


// Detect the click on the check box
	$("#aRCB").click(function(){
      if($(this).is(':checked')){
        autoUpdate()
        $.cookie("autorefresh",1);
      }else{//si décoché
      	if (myReset!= null){
      		clearInterval(myReset);
      	}
        updateMap()
		$.cookie("autorefresh",0);
      }
	});

}

//--------------------------------------------------------------------------------------------------
	//gather newly added coordinates or add coordinates since begining of mission
function getNewCoordinates(){
	$("#getNewCoordinates").click( function() {
		$.ajax({
			type: "GET",
			url: "/gatherCoordsSince",
			data: {datetime : getLastDatetime(), trackers: getDesiredTrackers(), mission_id: getCurrentMission()},
			dataType: "json",
			success: function(data){
				if(data.length > 0){
					refreshWithNewMarkers2(data,getMap());
					//clearDesiredTrackers(getDesiredTrackers()); //need to check
				}
			}       
		});
	});
}

function getNewTrackers(){
	$("#getNewTrackers").click(function() {
		$.ajax({
			type: "GET",
			url: "/getNewTrackers",
			data: {datetime : getLastDatetime(), trackers: getKnownTrackers(), mission_id: getCurrentMission()}, //!!!!! Be careful, datetime can not begin with 0
			dataType: "json",
			success: function(data){// retrieve an array containing the not yet known trackers
				if(data.length > 0){
					saveNewDesiredTracker(data);//need to check???? need to clear when finish
					saveNewKnownTracker(data);
					//alert("Received data: "+data);
				}
			}       
		});
	});
}

function getNewCoordinatesAuto(){
		$.ajax({
			type: "GET",
			url: "/gatherCoordsSince",
			data: {datetime : getLastDatetime(), trackers: getDesiredTrackers(), mission_id: getCurrentMission()},
			dataType: "json",
			success: function(data){
				if(data.length > 0){
					refreshWithNewMarkers2(data,getMap());
					//clearDesiredTrackers(getDesiredTrackers()); //need to check
				}
			}       
		});
}
// not sure but
//getNewCoordinatesAuto is used in getNewTrackersAuto because somehow getNewCoordinatesAuto don't find the trackers otherwise
function getNewTrackersAuto(){
		$.ajax({
			type: "GET",
			url: "/getNewTrackers",
			data: {datetime : getLastDatetime(), trackers: getKnownTrackers(), mission_id: getCurrentMission()}, //!!!!! Be careful, datetime can not begin with 0
			dataType: "json",
			success: function(data){// retrieve an array containing the not yet known trackers
				if(data.length > 0){
					saveNewDesiredTracker(data)//need to check???? need to clear when finish
					saveNewKnownTracker(data);
					getNewCoordinatesAuto();
				}
			}       
		});
}

function updateMap(){
		$.ajax({
			type: "GET",
			url: "/update_map",
			data: {mission_id: getCurrentMission()},
			
			success: function(){
				getNewTrackers()
				getNewCoordinates()
			}       
		});
}



function autoUpdate(){
		$.ajax({
			type: "GET",
			url: "/update_map_auto",
			data: {mission_id: getCurrentMission()},
			
			success: function(){
				getNewTrackersAuto()
				myReset = setInterval(function() {
					getNewTrackersAuto()
					getNewCoordinatesAuto()
				}, 10000);
			}       
		});
}

