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

var list;

var initDashboard = function() {
  
    var list = $("#list").dxList({ 
        dataSource: listData[0].data,
        itemTemplate: $("#item-template")
    }).dxList("instance");
    var lastIndex = 0;
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
  
  
}

