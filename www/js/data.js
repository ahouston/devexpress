var contacts = [
    { name: "Barbara J. Coggins", phone: "512-964-2757", image: "img/employees/04.png", email: "BarbaraJCoggins@rhyta.com", category: "Favorites" },
    { name: "Leslie S. Alcantara", phone: "360-684-1334", image: "img/employees/01.png", email: "LeslieSAlcantara@teleworm.us", category: "Missed" },
    { name: "Chad S. Miles", phone: "520-573-7903", image: "img/employees/02.png", email: "ChadSMiles@rhyta.com", category: "Favorites" },
    { name: "Michael A. Blevins", phone: "530-480-1961", image: "img/employees/03.png", email: "MichaelABlevins@armyspy.com", category: "Missed" },
    { name: "Jane K. Hernandez", phone: "404-781-0805", image: "img/employees/05.png", email: "JaneKHernandez@teleworm.us", category: "Favorites" },
    { name: "Kim D. Thomas", phone: "603-583-9043", image: "img/employees/06.png", email: "KimDThomas@teleworm.us", category: "Outgoing call" },
    { name: "Donald L. Jordan", phone: "772-766-2842", image: "img/employees/07.png", email: "DonaldLJordan@dayrep.com", category: "Favorites" },
    { name: "Nicole A. Rios", phone: "213-812-8400", image: "img/employees/09.png", email: "NicoleARios@armyspy.com", category: "Missed" },
    { name: "Barbara M. Roberts", phone: "614-365-7945", image: "img/employees/08.png", email: "BarbaraMRoberts@armyspy.com", category: "Outgoing call" }
];

var formFields = [ "firstName", "lastName", "emailAddress", "phoneNumber", "houseNumber", "streetName","suburbName","estateComplex","estateOther","windDirection","sideEffects","otherEffects","smellType","comments","fileAttachment","incidentDate","authorityRating"];

var now = new Date();

    var suburbData = ["Kloof","Hillcrest"];
    var estateData = ["Plantations","MooCow"];
    var windData = [ "N", "NNW"];
    var sideEffects = [];

var jobArrayPODTab = [{
  guid: 0,
  name: "<<New Order>>"
}, {
  guid: 1,
  name: "Job 1"
}, {
  guid: 2,
  name: "Job 2"
}];

var formDataItems = [
                { dataField     : "firstName",          editorOptions: { disabled: false},},
                { dataField     : "lastName",           editorOptions: { disabled: false},},
                { dataField     : "emailAddress",       editorOptions: { disabled: false},},
                { dataField     : "phoneNumber",        editorOptions: { disabled: false},},
                { dataField     : "houseNumber",        editorOptions: { disabled: false},},
                { dataField     : "streetName",         editorOptions: { disabled: false},},
                { dataField     : "suburbName",         editorType: "dxSelectBox", editorOptions: { items: suburbData, value: ""}},
                { dataField     : "estateComplex",      editorType: "dxSelectBox", editorOptions: { items: estateData, value: ""}},
                { dataField     : "estateOther",        editorOptions: { disabled: false},},
                { dataField     : "windDirection",      editorType: "dxSelectBox", editorOptions: { items: windData, value: ""},validationRules: [{ type: "required", message: "Wind Direction is required"}]},
                { dataField     : "sideEffects",        editorType: "dxCheckBox",  editorOptions: { items: sideEffects, value: ""},validationRules: [{ type: "required", message: "Side Effects required"}]},
                { dataField     : "otherEffects",       editorOptions: { disabled: false},},
                { dataField     : "smellType",          editorType: "dxSelectBox", editorOptions: { items: windData, value: ""},validationRules: [{ type: "required", message: "Smell is required"}]},
                { dataField     : "otherEffects",       editorType: "dxTextArea",  editorOptions: { disabled: false},},
                { dataField     : "fileAttachment",     editorType: "dxFileUploader",  editorOptions: { disabled: false},},
                { dataField     : "incidentDate",       editorType: "dxDateBox",  editorOptions: { type: "datetime", value: now},width:"90%"},
                { dataField     : "authorityRating",    editorType: "dxSlider",   editorOptions: { min:0, max:5,width:"90%", tooltip: {enabled: true,showMode:"always",position:"bottom"}},},
];

var navData = [{
        text: "Complain",
        icon: "globe"
    }, {
        text: "Places",
        icon: "map",
        badge: 3
    }, {
        text: "People",
        icon: "user",
        badge: 2
    }
];