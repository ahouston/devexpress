DevExpress.ui.setTemplateEngine("underscore");

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

var tabPages = [
    { id: "#form"},
    { id: "#places"},
    { id: "#people"},
    { id: "#reports"}
]

var lastIndex = 0;

/* Google Maps API Functions */
function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
            {types: ['geocode']});
        autocomplete.addListener('place_changed', fillInAddress);
				geolocate();
}

function fillInAddress() {
	// Get the place details from the autocomplete object.
	var place = autocomplete.getPlace();
	var placeForm = $("#placeForm").dxForm("instance");
	console.log("Place Object:",place);

	// Get each component of the address from the place details
	// and fill the corresponding field on the form.
	for (var i = 0; i < place.address_components.length; i++) {
		var addressType = place.address_components[i].types[0];
		if (componentForm[addressType]) {
			var val = place.address_components[i][componentForm[addressType]];
			console.log("What is field:",placeMap[addressType]," with value:",val);
			if (placeMap[addressType]) {
				console.log("Updating field:",placeMap[addressType]," with value:",val);
				placeForm.updateData(placeMap[addressType], val);
			}
		}
	}
	
	var yourLat = place.geometry.location.lat();
	var yourLng = place.geometry.location.lng();
	var myInitialBearing = geo.bearing(yourLat,yourLng, -29.826912, 30.749341);
	var dumpDistance = geo.distance(yourLat,yourLng, -29.826912, 30.749341);
	var windDirection = geo.compass(myInitialBearing);
	console.log("Bearing:",myInitialBearing,"Wind Direction:", windDirection);
	placeForm.updateData("placeName",place.name);
	placeForm.updateData("googleAddress",place.name);
	placeForm.updateData("gpsCoords",yourLat+","+yourLng);
//	placeForm.updateData("dumpDirection",windDirection +" ("+Math.round(myInitialBearing*10)/10+" Degrees)");
	placeForm.updateData("dumpDirection",windDirection);
	placeForm.updateData("dumpDistance",dumpDistance);
	
	
}

function insertPlace(){
	
	var placeForm = $("#placeForm").dxForm("instance");
	formKeys = Object.keys(placeForm.option("formData"));
	console.log("Form option:",placeForm.option("formData"),"Keys:",formKeys);
	save = placeForm.option("formData");
	save.estateOther = save.estatOther ? save.estateOther : "";
	
	console.log("Using values:","",save.placeName,save.houseNumber,save.streetName,save.suburbName,save.estateComplex,save.estateOther,save.gpsCoords,save.dumpDirection,save.dumpDistance,save.googleAddress);
	db.transaction(
    function (transaction) {
        transaction.executeSql("INSERT INTO places (placeName, houseNumber,streetName,suburbName,complexName,complexOther,gpsCoords,dumpDirection, dumpDistance, googleAddress) VALUES (?,?,?,?,?,?,?,?,?,?)",
            [save.placeName,save.houseNumber,save.streetName,save.suburbName,save.estateComplex,save.estateOther,save.gpsCoords,save.dumpDirection,save.dumpDistance,save.googleAddress ]); // array of values for the ? placeholders
    }, placeSaveError,placeSaveSuccess
	);
}

function savePlace(id){
	
	var placeForm = $("#placeForm").dxForm("instance");
	formKeys = Object.keys(placeForm.option("formData"));
	console.log("Form option:",placeForm.option("formData"),"Keys:",formKeys);
	save = placeForm.option("formData");
	save.estateOther = save.estateOther ? save.estateOther : "";
	
	console.log("Using values:","",save.placeName,save.houseNumber,save.streetName,save.suburbName,save.estateComplex,save.estateOther,save.gpsCoords,save.dumpDirection,save.dumpDistance,save.googleAddress);
	db.transaction(
    function (transaction) {
        transaction.executeSql("UPDATE places SET placeName=?, houseNumber=?,streetName=?,suburbName=?,complexName=?,complexOther=?,gpsCoords=?,dumpDirection=?, dumpDistance=?, googleAddress=? WHERE id=?",
            [save.placeName,save.houseNumber,save.streetName,save.suburbName,save.estateComplex,save.estateOther,save.gpsCoords,save.dumpDirection,save.dumpDistance,save.googleAddress,save.id]); // array of values for the ? placeholders
    }, placeSaveError,placeSaveSuccess
	);
}

function placeSaveError(error) {
	console.warn("Error save place:",error.message);
}
function placeSaveSuccess(error) {
	console.warn("Saved place OK!");
	db.transaction(fetchPlaces,errorCB);
	$("#placeAdd").hide();
  $("#placeList").show();
}

/*
	Insert People into the DB
*/

function insertPeople(){
	
	var peopleForm = $("#peopleForm").dxForm("instance");
	formKeys = Object.keys(peopleForm.option("formData"));
	console.log("Form option:",peopleForm.option("formData"),"Keys:",formKeys);
	save = peopleForm.option("formData");
	
	console.log("Using values:","",save.firstName,save.lastName,save.emailAddress,save.phoneNumber,save.ageRange);
	db.transaction(
    function (transaction) {
        transaction.executeSql("INSERT INTO people (firstName, lastName,emailAddress,phoneNumber,ageRange) VALUES (?,?,?,?,?)",
            [save.firstName,save.lastName,save.emailAddress,save.phoneNumber,save.ageRange]); // array of values for the ? placeholders
    }, peopleSaveError,peopleSaveSuccess
	);
}

/* Update People into the DB */

function savePeople(id){
	
	var peopleForm = $("#peopleForm").dxForm("instance");
	formKeys = Object.keys(peopleForm.option("formData"));
	console.log("Form option:",peopleForm.option("formData"),"Keys:",formKeys);
	save = peopleForm.option("formData");
	
	console.log("["+id+"]"+" Using values:","",save.firstName,save.lastName,save.emailAddress,save.phoneNumber,save.ageRange,save.id);
	db.transaction(
    function (transaction) {
        transaction.executeSql("UPDATE people SET firstName=?, lastName=?, phoneNumber=?,emailAddress=?,ageRange=? WHERE id=?",
            [save.firstName,save.lastName,save.phoneNumber,save.emailAddress,save.ageRange, save.id]); // array of values for the ? placeholders
    }, peopleSaveError,peopleSaveSuccess
	);
}

function peopleSaveError(error) {
	console.warn("Error save place:",error.message);
}
function peopleSaveSuccess(error) {
	console.warn("Saved person OK!");
	db.transaction(fetchPeople,errorCB);
	$("#peopleAdd").hide();
  $("#peopleList").show();
}



 /*
  * Fill the Place Add form with data if an ID is supplied, otherwise wipe it
  */

function fillPlaceAdd(id) {
	
	var placeForm = $("#placeForm").dxForm("instance");
	
	if (id) {
		console.log("Loading data for ID:",id);
		placeDataSource.load({filter: ["id", "=", id]}).done(function(result) {
			console.log("Result:",result[0]);
			$.each(result[0],function(key,val) { placeForm.updateData(key,val); });
		});
	}
	else {
		$("#autocomplete").val("");
		placeForm.resetValues();
	}
}

 /*
  * Fill the People Add form with data if an ID is supplied, otherwise wipe it
  */

function fillPeopleAdd(id) {
	
	var peopleForm = $("#peopleForm").dxForm("instance");
	
	if (id) {
		console.log("Loading data for ID:",id);
		peopleDataSource.load({filter: ["id", "=", id]}).done(function(result) {
			console.log("Fill Data Result:",result[0]);
			$.each(result[0],function(key,val) { peopleForm.updateData(key,val);});
		});
	}
	else { peopleForm.resetValues();}
}

 /*
  * Fill the People Add form with data if an ID is supplied, otherwise wipe it
  */

function fillReportAdd(id) {
	
	var reportForm = $("#reportForm").dxForm("instance");
	
	if (id) {
	
		console.log("Loading data for ID:",id);
		reportDataSource.load({filter: ["id", "=", id]}).done(function(result) {
			console.log("Result:",result[0]);
			$.each(result[0],function(key,val) {
					if (!(typeof(formReportDbMap[key]) === "undefined")) {
						console.log("Mapping key => ", key, "to form: ",formReportDbMap[key], " with val=",val);
						peopleForm.updateData(formReportDbMap[key],val);
					}
			});
		});
	}
	else { reportForm.resetValues();}
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {

			console.log("Using a 15km RADIUS of Enviroserv as the bounding circle");
			var circle = new google.maps.Circle({
				center: {lat: -29.826912, lng: 30.749341},
				radius: 15000,
			});
			autocomplete.setBounds(circle.getBounds());
		
}


var initDashboard = function() {

		var placeToolbar = $("#placeToolbar").dxToolbar({ items: [{
            location: 'before',
            widget: 'dxButton',
            locateInMenu: 'auto',
            options: {
                icon: "plus",
                onClick: function() {
										$("#placeList").toggle();
										fillPlaceAdd();
										$("#placeAddButton").show();
										$("#placeSaveButton").hide();
										$("#placeAdd").toggle();
                    //DevExpress.ui.notify("Add button has been clicked!");
                }
            }
        }
    ]}).dxToolbar("instance");
		
		var placeForm = $("#placeForm").dxForm({
				formData: placeFields,
				readOnly: false,
				labelLocation: "left",
				colCount: 1,
				showColonAfterLabel: true,
				minColWidth: 300,
				items: placeDataItems,
			}).dxForm("instance");
		
		$("#placeAddButton").dxButton({
			"icon": "add",
			"text": "Add",
			onClick: function() { insertPlace(); },
		});
		
		$("#placeSaveButton").dxButton({
			"icon": "save",
			"text": "Save",
			onClick: function() { savePlace(); },
		});
		
		$("#placeBackButton").dxButton({
			"icon": "back",
			"text": "Back",
			onClick: function() { $("#placeAdd").hide(); $("#placeList").show();  },
		});
		
		/* People Toolbar and Buttons */
		
		var peopleToolbar = $("#peopleToolbar").dxToolbar({ items: [{
            location: 'before',
            widget: 'dxButton',
            locateInMenu: 'auto',
            options: {
                icon: "plus",
                onClick: function() {
										$("#peopleList").toggle();
										fillPeopleAdd();
										$("#peopleAddButton").show();
										$("#peopleSaveButton").hide();
										$("#peopleAdd").toggle();
                    //DevExpress.ui.notify("Add button has been clicked!");
                }
            }
        }
    ]}).dxToolbar("instance");
		
		var peopleForm = $("#peopleForm").dxForm({
				formData: peopleFields,
				readOnly: false,
				labelLocation: "left",
				colCount: 1,
				showColonAfterLabel: true,
				minColWidth: 300,
				items: peopleDataItems,
			}).dxForm("instance");
		
		$("#peopleAddButton").dxButton({
			"icon": "add",
			"text": "Add",
			onClick: function() { insertPeople(); },
		});
		
		$("#peopleSaveButton").dxButton({
			"icon": "save",
			"text": "Save",
			onClick: function() { savePeople(); },
		});
		
		$("#peopleBackButton").dxButton({
			"icon": "back",
			"text": "Back",
			onClick: function() { $("#peopleAdd").hide(); $("#peopleList").show();  },
		});
		
		
		/* reports Toolbar and Buttons */
		
		
    $("#placeList").dxList({
      dataSource: placeDataSource,
			itemHoldAction: function(e) {
					placeContext.show();
			},
      itemTemplate: function (itemData, itemIndex, itemElement) {
        itemElement.append('<div id="'+itemData.id+'" class="placeDelete" style="float:right"></div><div id="'+itemData.id+'" class="placeEdit" style="float:right"></div> ');
        itemElement.append('<p style="font-size:larger;"><b>' + itemData.placeName + '</b></p>');
        itemElement.append('<p>Address:<i>' + itemData.houseNumber + ' ' + itemData.streetName +' </i></p>');
        if (itemData.suburbName)    { itemElement.append('<p>Suburb:<i>' + itemData.suburbName + ' </i></p>'); }
        if (itemData.complexName)   { itemElement.append('<p>Complex:<i>' + itemData.complexName + ' </i></p>'); }
        if (itemData.gpsCoords)     { itemElement.append('<p>GPS Coordinates:<i>' + itemData.gps + ' </i></p>'); }
        if (itemData.dumpDirection) { itemElement.append('<p>Dump Direction:<i>' + itemData.dumpDirection + ' </i></p>'); }
        itemElement.append('</div>');
        
      },
      onContentReady: function() {
				$(".placeEdit").each(function(index,object) {
					console.log("PlaceEdits Key:",index," Object: ",object);
					  var listID = $(object).attr("id");
						$(object).dxButton({
								icon:"edit",
								onClick: function(e) {
									$("#placeList").toggle();
									  fillPlaceAdd(listID);
										$("#placeAddButton").hide();
										$("#placeSaveButton").show();
										$("#placeAdd").toggle();
								}
						});
				});
				$(".placeDelete").each(function(index,object) {
					console.log("PlaceEdits Key:",index," Object: ",object);
						$(object).dxButton({icon:"trash"});
				});
				
      }
    });
	
	$("#peopleList").dxList({
      dataSource: peopleDataSource,
      itemTemplate: function (itemData, itemIndex, itemElement) {
        itemElement.append('<div id="'+itemData.id+'" class="peopleDelete" style="float:right"></div><div id="'+itemData.id+'" class="peopleEdit" style="float:right"></div> ');
        itemElement.append('<p style="font-size:larger;"><b>' + itemData.firstName + ' ' + itemData.lastName +'</b></p>');
        if (itemData.phoneNumber)   { itemElement.append('<p>Phone:<i>' + itemData.phoneNumber + ' </i></p>'); }
        if (itemData.emailAddress)   { itemElement.append('<p>Email:<i>' + itemData.emailAddress + ' </i></p>'); }
        if (itemData.ageRange)       { itemElement.append('<p>Age:<i>' + itemData.ageRange + ' </i></p>'); }
        itemElement.append('</div>');
      },
      onContentReady: function() {
				$(".peopleEdit").each(function(index,object) {
					  var listID = $(object).attr("id");
						$(object).dxButton({
								icon:"edit",
								onClick: function(e) {
									$("#peopleList").toggle();
									  fillPeopleAdd(listID);
										$("#peopleAddButton").hide();
										$("#peopleSaveButton").show();
										$("#peopleAdd").toggle();
								}
						});
				});
				$(".peopleDelete").each(function(index,object) {
					console.log("peopleEdits Key:",index," Object: ",object);
						$(object).dxButton({icon:"trash"});
				});
				
      }
    });
	
		console.log("Making report list...")
		$("#reportList").dxList({
      dataSource: reportDataSource,
      itemTemplate: function (itemData, itemIndex, itemElement) {
        itemElement.append('<div id="'+itemData.id+'" class="reportDelete" style="float:right"></div><div id="'+itemData.id+'" class="reportEdit" style="float:right"></div> ');
        itemElement.append('<p style="font-size:larger;"><b>' + itemData.report_date + '</b></p>');
        itemElement.append('<p>Address:<i>' + itemData.houseNumber + ' ' + itemData.streetName +' </i></p>');
        if (itemData.suburb)        { itemElement.append('<p>Suburb:<i>' + itemData.suburb + ' </i></p>'); }
        if (itemData.complexName)   { itemElement.append('<p>Complex:<i>' + itemData.complexName + ' </i></p>'); }
        if (itemData.gps)           { itemElement.append('<p>GPS Coordinates:<i>' + itemData.gps + ' </i></p>'); }
        if (itemData.dumpDirection) { itemElement.append('<p>Dump Direction:<i>' + itemData.dumpDirection + ' </i></p>'); }
        itemElement.append('</div>');
        
      },
      onContentReady: function() {
				$(".reportEdit").each(function(index,object) {
					console.log("reportEdits Key:",index," Object: ",object);
					  var listID = $(object).attr("id");
						$(object).dxButton({
								icon:"edit",
								onClick: function(e) {
									$("#reportList").toggle();
									  fillreportAdd(listID);
										$("#reportAddButton").hide();
										$("#reportSaveButton").show();
										$("#reportAdd").toggle();
								}
						});
				});
				$(".reportDelete").each(function(index,object) {
					console.log("reportEdits Key:",index," Object: ",object);
						$(object).dxButton({icon:"trash"});
				});
				
      }
    });
	

    console.log("Making form!");
    

    var form = $("#form").dxForm({
				formData: formFields,
				readOnly: false,
				labelLocation: "left",
				colCount: 1,
				showColonAfterLabel: true,
				minColWidth: 300,
				items: formDataItems,
			}).dxForm("instance");  
  
    $("#navbar").dxNavBar({
            dataSource: navData,
            selectedIndex: 0,
                onItemClick: function(e) {
                  var newIndex = e.component.option("selectedIndex");
                  var lastDivId = tabPages[lastIndex].id;
                  var newDivId = tabPages[newIndex].id;
                  $(lastDivId).hide();
                  $(newDivId).show();
                  lastIndex = newIndex;
                  console.log("Selected tab",e.component.option("selectedIndex"));
									console.log("Hiding ",lastDivId,", showing ",newDivId);
            },
    });
  
}

var geo = {
        /**
         * Calculate the bearing between two positions as a value from 0-360
         *
         * @param lat1 - The latitude of the first position
         * @param lng1 - The longitude of the first position
         * @param lat2 - The latitude of the second position
         * @param lng2 - The longitude of the second position
         *
         * @return int - The bearing between 0 and 360
         */
        bearing : function (lat1,lng1,lat2,lng2) {
            var dLon = this._toRad(lng2-lng1);
            var y = Math.sin(dLon) * Math.cos(this._toRad(lat2));
            var x = Math.cos(this._toRad(lat1))*Math.sin(this._toRad(lat2)) - Math.sin(this._toRad(lat1))*Math.cos(this._toRad(lat2))*Math.cos(dLon);
            var brng = this._toDeg(Math.atan2(y, x));
            return ((brng + 360) % 360);
        },
				
				/* Convert a bearing into a compass point */
				
				compass: function (num) {
					var val = Math.floor((num / 22.5) + 0.5);
					var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
					return arr[(val % 16)];
				},
				
				distance: function (lat1, lon1, lat2, lon2) {
  
					var p = 0.017453292519943295;    // Math.PI / 180
					var c = Math.cos;
					var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

					return Math.round(12742 * Math.asin(Math.sqrt(a)) * 1000); // 2 * R; R = 6371 km
				},
				
        _toRad : function(deg) {
             return deg * Math.PI / 180;
        },
				
        _toDeg : function(rad) {
            return rad * 180 / Math.PI;
        },
    };