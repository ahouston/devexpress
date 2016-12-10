/*
var placeDataSource = new DevExpress.data.DataSource({
    store: [],
    map: function (dataItem) {
        return dataItem;
    }
});
*/
var placeDataSource = new DevExpress.data.ArrayStore([]);

var peopleDataSource = new DevExpress.data.DataSource({
    store: [],
    map: function (dataItem) {
        return dataItem;
    }
});

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


var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
};

var placeMap = {

    street_number: "houseNumber",
    route: "streetName",
    locality: "suburbName",
};

var formFields = [ "firstName", "lastName", "emailAddress", "phoneNumber", "houseNumber", "streetName","suburbName","estateComplex","estateOther","windDirection","sideEffects","otherEffects","smellType","comments","fileAttachment","incidentDate","authorityRating"];
var placeFields = [ "houseNumber", "streetName","suburbName","estateComplex","estateOther"];
var peopleFields = ["firstName", "lastName", "emailAddress", "phoneNumber"];

var now = new Date();

    var suburbData  = ["Hillcrest","Winston Park","Gillitts","St Helier","Kloof","Botha's Hill","Waterfall","Assagay","Summerveld","Shongweni","Kwandengezi","Dassenhoek","Alverstone","Hammarsdale","Forest Hills","Monteseel","Everton","Crestholme","Salem","Westriding","Monteseel","Hammarsdale","Other"];
    var estateData  = ["Not Applicable","Plantations","Greenvale Village","Manorfields","Langford","Augusta","The Willows","Sunshine Valley","Balmoral","Camelot","Silver Oaks","Queensbridge","Aintree Lane","Emoyeni Heights","Shongweni Heights","101 Acutts","Clifton Hill","Cotswold Downs","Kirtlington Park","Le Domaine","Other"];
    var windData    = ["N","NNE","NNE","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","Undetermined" ];
    var sideEffects = ["Nausea / Stomach pain","Vomiting","Headaches","Sinusitis / Runny nose","Hayfever","Dizziness","Eczema/ Tingling skin","Irregular or rapid heart rate","Asthma/ Tight chest","Drowsiness ","Burning / Itchy eyes","Coughing","Sore throat","Nuisance odour"];
    var smellData   = ["Refinery","Burning","Chemical"];

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
                { dataField     : "sideEffects",        editorType: "dxTagBox",  editorOptions: { items: sideEffects, value: ""},validationRules: [{ type: "required", message: "Side Effects required"}]},
                { dataField     : "otherEffects",       editorOptions: { disabled: false},},
                { dataField     : "smellType",          editorType: "dxSelectBox", editorOptions: { items:smellData, value: ""},validationRules: [{ type: "required", message: "Smell is required"}]},
                { dataField     : "otherEffects",       editorType: "dxTextArea",  editorOptions: { disabled: false},},
                { dataField     : "fileAttachment",     editorType: "dxFileUploader",  editorOptions: { disabled: false},},
                { dataField     : "incidentDate",       editorType: "dxDateBox",  editorOptions: { type: "datetime", width:"150px", value: now},},
                { dataField     : "authorityRating",    editorType: "dxSelectBox", editorOptions: { items: ["1","2","3","4","5"], value: ""},},
];

var placeDataItems = [
                { dataField     : "friendlyName",       editorOptions: { editorType: "dxTextBox", disabled: false}, helpText: "Example 'Home' or 'School'"},
                { dataField     : "houseNumber",        editorOptions: { disabled: false},},
                { dataField     : "streetName",         editorOptions: { disabled: false},},
                { dataField     : "suburbName",         editorType: "dxSelectBox", editorOptions: { items: suburbData, value: ""}},
                { dataField     : "estateComplex",      editorType: "dxSelectBox", editorOptions: { items: estateData, value: ""}},
                { dataField     : "estateOther",        editorOptions: { disabled: false},},
                { dataField     : "gpsCoords",          editorOptions: { readonly: true},},
                { dataField     : "dumpDirection",      editorOptions: { readonly: true},},
                { dataField     : "dumpDistance",       editorOptions: { readonly: true},},
                { dataField     : "googleAddress",       editorOptions: {visible: false},},
];

var peopleDataItems = [
                { dataField     : "firstName",          editorOptions: { disabled: false},},
                { dataField     : "lastName",           editorOptions: { disabled: false},},
                { dataField     : "emailAddress",       editorOptions: { disabled: false},},
                { dataField     : "phoneNumber",        editorOptions: { disabled: false},},
];

var numPlaces = 0;
var numPeople = 0;

var navData = [{
        text: "Complain",
        icon: "globe"
    }, {
        text: "Places",
        icon: "map",
        badge: numPlaces,
    }, {
        text: "People",
        icon: "user",
        badge: numPeople,
    }
];