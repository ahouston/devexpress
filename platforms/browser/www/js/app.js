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

var listData = [
    {
      data: new DevExpress.data.DataSource({
          store: contacts,
          sort: "name"
      })
    }, {
      data: new DevExpress.data.DataSource({
          store: contacts,
          sort: "name",
          filter: ["category", "=", "Missed"]
      })
    }, {
      data: new DevExpress.data.DataSource({
          store: contacts,
          sort: "name",
          filter: ["category", "=", "Favorites"]
      })
    }
];

var tabPages = [
    { id: "#form"},
    { id: "#places"},
    { id: "#people"}
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
	placeForm.updateData("friendlyName",place.name);
	placeForm.updateData("googleAddress",place.name);
	placeForm.updateData("gpsCoords",yourLat+","+yourLng);
//	placeForm.updateData("dumpDirection",windDirection +" ("+Math.round(myInitialBearing*10)/10+" Degrees)");
	placeForm.updateData("dumpDirection",windDirection);
	placeForm.updateData("dumpDistance",dumpDistance);
	
	
}

function savePlace(tx){
	
	var placeForm = $("#placeForm").dxForm("instance");
	formKeys = Object.keys(placeForm.option("formData"));
	console.log("Form option:",placeForm.option("formData"),"Keys:",formKeys);
	save = placeForm.option("formData");
	save.estateOther = save.estatOther ? save.estateOther : "";
	
	console.log("Using values:","",save.friendlyName,save.houseNumber,save.streetName,save.suburbName,save.estateComplex,save.estateOther,save.gpsCoords,save.dumpDirection,save.dumpDistance,save.googleAddress);
	//tx.executeSql('INSERT INTO places VALUES ("","Home"          ,"21","Lynwood Road" ,"Kloof","","","-29.0001,312232"             ,"SSW","6994" ,"21 Lynwood Rd, Kloof")');
                 //INSERT INTO places VALUES ("","12 Old Main Rd","12","Old Main Road","Kloof","","","-29.791256,30.84553900000003","WSW","10093","12 Old Main Rd")
	var sqlString = 'INSERT INTO places VALUES ("","{0}","{1}","{2}","{3}","{4}","{5}","{6}","{7}","{8}","{9}")'.format(save.friendlyName,save.houseNumber,save.streetName,save.suburbName,save.estateComplex,save.estateOther,save.gpsCoords,save.dumpDirection,save.dumpDistance,save.googleAddress)
	console.log("SQL:",sqlString);
	db.transaction(
    function (transaction) {
        transaction.executeSql("INSERT INTO places (place_name, street_number,street_name,suburb,complex_name,complex_other,gps,wind_direction, distance, google_address) VALUES (?,?,?,?,?,?,?,?,?,?)",
            [save.friendlyName,save.houseNumber,save.streetName,save.suburbName,save.estateComplex,save.estateOther,save.gpsCoords,save.dumpDirection,save.dumpDistance,save.googleAddress ]); // array of values for the ? placeholders
    }, placeSaveError,placeSaveSuccess
	);
}

function placeSaveError(error) {
	console.warn("Error save place:",error.message);
}
function placeSaveSuccess(error) {
	console.warn("Saved place OK!");
	db.transaction(fetchPlaces,errorCB);
  $("#placeList").toggle();
	$("#placeAdd").toggle();
	
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
  
    var list = $("#list").dxList({ 
        dataSource: listData[0].data,
        itemTemplate: $("#item-template")
    }).dxList("instance");  

		var placeToolbar = $("#placeToolbar").dxToolbar({ items: [{
            location: 'before',
            widget: 'dxButton',
            locateInMenu: 'auto',
            options: {
                icon: "plus",
                onClick: function() {
										$("#placeList").toggle();
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
			onClick: function() { savePlace(); },
		});
		
    $("#placeList").dxList({
      dataSource: placeDataSource,
      itemTemplate: function (itemData, itemIndex, itemElement) {
        itemElement.append('<p style="font-size:larger;"><b>' + itemData.place_name + '</b></p>');
        itemElement.append('<p>Address:<i>' + itemData.street_number + ' ' + itemData.street_name +' </i></p>');
        if (itemData.suburb)        { itemElement.append('<p>Suburb:<i>' + itemData.suburb + ' </i></p>'); }
        if (itemData.complex_name)  { itemElement.append('<p>Complex:<i>' + itemData.complex_name + ' </i></p>'); }
        if (itemData.gps)           { itemElement.append('<p>GPS Coordinates:<i>' + itemData.gps + ' </i></p>'); }
        
      },
      onContentReady: function() {
      }
    });
    
    $("#peopleList").dxList({
      dataSource: peopleDataSource,
      itemTemplate: function (itemData, itemIndex, itemElement) {
        itemElement.append('<p style="font-size:larger;"><b>' + itemData.person_name + '</b></p>');
        itemElement.append('<p>Name:<i>' + itemData.first_name + ' ' + itemData.last_name +' </i></p>');
        if (itemData.tel_number)        { itemElement.append('<p>Telephone:<i>' + itemData.tel_number + ' </i></p>');}
        if (itemData.email_address)     { itemElement.append('<p>Email:<i>' + itemData.email_address + ' </i></p>'); }
      },
      onContentReady: function() {
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