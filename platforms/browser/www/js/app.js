DevExpress.ui.setTemplateEngine("underscore");

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

var initDashboard = function() {
  
    var list = $("#list").dxList({ 
        dataSource: listData[0].data,
        itemTemplate: $("#item-template")
    }).dxList("instance");  

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

