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


