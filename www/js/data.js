/*
var placeDataSource = new DevExpress.data.DataSource({
    store: [],
    map: function (dataItem) {
        return dataItem;
    }
});
*/

var numPeople;
var numPlaces;
var numReports;
var numUnsyncedReports;

var placeDataSource = new DevExpress.data.ArrayStore([]);
var peopleDataSource = new DevExpress.data.ArrayStore([]);
var reportDataSource = new DevExpress.data.ArrayStore([]);

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

var formPlaceDbMap = {
    
    id              : "id",     
    complex_name    : "complexName",     
    complex_other   : "complexOther",
    distance        : "dumpDistance",
    google_address  : "googleAddress",
    gps             : "gpsCoords",
    place_name      : "placeName",
    street_name     : "streetName",
    street_number   : "houseNumber",
    suburb          : "suburbName",
    wind_direction  : "dumpDirection",
};

var formPeopleDbMap = {
    
    id              : "id",     
    first_name      : "firstName",
    last_name       : "lastName",
    tel_number      : "phoneNumber",
    email_address   : "emailAddress",
    child_adult     : "childAdult",
};



var formFields = [ "firstName", "lastName", "emailAddress", "phoneNumber", "houseNumber", "streetName","suburbName","estateComplex","estateOther","windDirection","sideEffects","otherEffects","smellType","comments","fileAttachment","incidentDate","authorityRating"];
var placeFields = [ "id","houseNumber", "streetName","suburbName","estateComplex","estateOther"];
var peopleFields = [ "id","firstName", "lastName", "emailAddress", "phoneNumber"];
var reportFields = ["id", "firstName", "lastName", "emailAddress", "phoneNumber", "houseNumber", "streetName","suburbName","estateComplex","estateOther","windDirection","sideEffects","otherEffects","smellType","comments","fileAttachment","incidentDate","authorityRating"];

var now = new Date();

var suburbData  = ["Hillcrest","Winston Park","Gillitts","St Helier","Kloof","Botha's Hill","Waterfall","Assagay","Summerveld","Shongweni","Kwandengezi","Dassenhoek","Alverstone","Hammarsdale","Forest Hills","Monteseel","Everton","Crestholme","Salem","Westriding","Monteseel","Hammarsdale","Other"];
var estateData  = ["Not Applicable","Plantations","Greenvale Village","Manorfields","Langford","Augusta","The Willows","Sunshine Valley","Balmoral","Camelot","Silver Oaks","Queensbridge","Aintree Lane","Emoyeni Heights","Shongweni Heights","101 Acutts","Clifton Hill","Cotswold Downs","Kirtlington Park","Le Domaine","Other"];
var windData    = ["N","NNE","NNE","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","Undetermined" ];
var sideEffects = ["Nausea / Stomach pain","Vomiting","Headaches","Sinusitis / Runny nose","Hayfever","Dizziness","Eczema/ Tingling skin","Irregular or rapid heart rate","Asthma/ Tight chest","Drowsiness ","Burning / Itchy eyes","Coughing","Sore throat","Nuisance odour"];
var smellData   = ["Refinery","Burning","Chemical"];
var ageRange    = ["Under 14","Over 14"];

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
                { dataField     : "otherEffects",       editorType: "dxTextArea",  editorOptions: { disabled: false},},
                { dataField     : "smellType",          editorType: "dxSelectBox", editorOptions: { items:smellData, value: ""},validationRules: [{ type: "required", message: "Smell is required"}]},
                { dataField     : "childrenAffected",    editorType: "dxSelectBox", editorOptions: { items: ["1","2","3","4","5"], value: "", label: { text: "Children Affected"}},},
                { dataField     : "fileAttachment",     editorType: "dxFileUploader",  editorOptions: { disabled: false},},
                { dataField     : "incidentDate",       editorType: "dxDateBox",  editorOptions: { type: "datetime", width:"150px", value: now},},
                { dataField     : "authorityRating",    editorType: "dxSelectBox", editorOptions: { items: ["1","2","3","4","5"], value: ""},},
];

var placeDataItems = [
                { dataField     : "id",                 visible: false, editorOptions: { visible: false},},
                { dataField     : "placeName",       editorOptions: { editorType: "dxTextBox", disabled: false}, helpText: "Example 'Home' or 'School'"},
                { dataField     : "houseNumber",        editorOptions: { disabled: false},},
                { dataField     : "streetName",         editorOptions: { disabled: false},},
                { dataField     : "suburbName",         editorType: "dxSelectBox", editorOptions: { items: suburbData, value: ""}},
                { dataField     : "estateComplex",      editorType: "dxSelectBox", editorOptions: { items: estateData, value: ""}},
                { dataField     : "estateOther",        editorOptions: { disabled: false},},
                { dataField     : "gpsCoords",          editorOptions: { readonly: true},},
                { dataField     : "dumpDirection",      editorOptions: { readonly: true},},
                { dataField     : "dumpDistance",       editorOptions: { readonly: true},},
                { dataField     : "googleAddress",      editorOptions: { readonly: true},},
];

var peopleDataItems = [
                { dataField     : "id",                 visible: false, editorOptions: { visible: false},},
                { dataField     : "firstName",          editorOptions: { disabled: false},},
                { dataField     : "lastName",           editorOptions: { disabled: false},},
                { dataField     : "emailAddress",       editorOptions: { disabled: false},},
                { dataField     : "phoneNumber",        editorOptions: { disabled: false},},
                { dataField     : "ageRange",           editorType: "dxSelectBox", editorOptions: { items: ageRange, value: ""}},
];

var reportDataItems = [
                { dataField     : "id",                 editorOptions: { visible: false},},
                { dataField     : "firstName",          editorOptions: { disabled: false},},
                { dataField     : "lastName",           editorOptions: { disabled: false},},
                { dataField     : "emailAddress",       editorOptions: { disabled: false},},
                { dataField     : "phoneNumber",        editorOptions: { disabled: false},},
                { dataField     : "houseNumber",        editorOptions: { disabled: false},},
                { dataField     : "streetName",         editorOptions: { disabled: false},},
                { dataField     : "suburbName",         editorType: "dxSelectBox", editorOptions: { items: suburbData, value: ""}},
                { dataField     : "estateComplex",      editorType: "dxSelectBox", editorOptions: { items: estateData, value: ""}},
                { dataField     : "estateOther",        editorOptions: { disabled: false},},
                { dataField     : "gpsCoords",          editorOptions: { readonly: true},},
                { dataField     : "dumpDirection",      editorOptions: { readonly: true},},
                { dataField     : "dumpDistance",       editorOptions: { readonly: true},},
                { dataField     : "googleAddress",      editorOptions: { readonly: true},},
                { dataField     : "windDirection",      editorType: "dxSelectBox", editorOptions: { items: windData, value: ""},validationRules: [{ type: "required", message: "Wind Direction is required"}]},
                { dataField     : "sideEffects",        editorType: "dxTagBox",  editorOptions: { items: sideEffects, value: ""},validationRules: [{ type: "required", message: "Side Effects required"}]},
                { dataField     : "smellType",          editorType: "dxSelectBox", editorOptions: { items:smellData, value: ""},validationRules: [{ type: "required", message: "Smell is required"}]},
                { dataField     : "otherEffects",       editorType: "dxTextArea",  editorOptions: { disabled: false},},
                { dataField     : "childrenAffected",    editorType: "dxSelectBox", editorOptions: { items: ["1","2","3","4","5"], value: "", label: { text: "Children Affected"}},},
                { dataField     : "fileAttachment",     editorType: "dxFileUploader",  editorOptions: { disabled: false},},
                { dataField     : "incidentDate",       editorType: "dxDateBox",  editorOptions: { type: "datetime", width:"150px", value: now},},
                { dataField     : "authorityRating",    editorType: "dxSelectBox", editorOptions: { items: ["1","2","3","4","5"], value: ""},},
];


var numPlaces = 0;
var numPeople = 0;

var navData = [{
        text: "Complain",
        icon: "comment"
    }, {
        text: "Places",
        icon: "map",
        badge: numPlaces,
    }, {
        text: "People",
        icon: "user",
        badge: numPeople,
    },
    {
        text: "Reports",
        icon: "doc",
        badge: numReports,
    },
    
];