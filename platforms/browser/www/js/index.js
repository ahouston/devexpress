/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var db;


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        DevExpress.ui.themes.current('ios7.default');
        db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        
        db.transaction(createDB, errorCB, successCB);
        //db.transaction(populateDB, errorCB, successCB);
        db.transaction(fetchPlaces,errorCB);
        db.transaction(fetchPeople,errorCB);
        db.transaction(fetchReports,errorCB);
        db.transaction(fetchUnsyncedReports,errorCB);
        initDashboard();
        
        // Try to load the Google API Javascript
        
        $.getScript( "https://maps.googleapis.com/maps/api/js?key=AIzaSyDz8ImBTm4f666p-T_jY85t-ahhR3ivJmw&libraries=places&callback=initAutocomplete" )
        .done(function( script, textStatus ) {
                console.log("Loaded Google API JS. Working in online mode.");
                $("#locationField").toggle();
        })
        .fail(function( jqxhr, settings, exception ) {
             console.log("Failed to load Google API JS. Working in offline mode.");
        });

            
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
    }
    
};

    /* Fetch all the places from the database */

    function fetchPlaces(tx) {
        tx.executeSql('SELECT * FROM places', [], placesSuccess, errorCB);
    }
    function placesSuccess(tx, results) {
        
        var len = results.rows.length;
        console.log(placeDataSource);
        placeDataSource.clear();
        numPlaces = len;
        console.log("table: " + len + " rows found. numPlaces=",numPlaces);
        var navbar = $("#navbar").dxNavBar('instance');
        if(!(typeof(navbar.option()) === 'undefined')) {
            console.log("NavBar:",navbar.option());
            navbar.option().items[1].badge = numPlaces;
            navbar.repaint();
        }
        for (var i=0; i<len; i++){
            //placeDataSource.store().insert(results.rows.item(i));
            placeDataSource.insert(results.rows.item(i));
            console.log("Results:",results.rows.item(i),"Row = " + i + " ID = " + results.rows.item(i).id + " Name =  " + results.rows.item(i).place_name);
        }
        $("#placeList").dxList("instance").reload();
        
    }
    
     /* Fetch all the people from the database */
    
    function fetchPeople(tx) {
        tx.executeSql('SELECT * FROM people', [], peopleSuccess, errorCB);
    }
    function peopleSuccess(tx, results) {
        var len = results.rows.length;
        peopleDataSource.clear();
        numPeople = len;
        console.log("People table: " + len + " rows found. numPeople=",numPeople);
        var navbar = $("#navbar").dxNavBar('instance');
        if(!(typeof(navbar.option()) === 'undefined')) {
            console.log("NavBar:",navbar.option());
            navbar.option().items[2].badge = numPeople;
            navbar.repaint();
        }
        for (var i=0; i<len; i++){
            peopleDataSource.insert(results.rows.item(i));
            console.log("Results:",results.rows.item(i),"Row = " + i + " ID = " + results.rows.item(i).id + " Name =  " + results.rows.item(i).person_name);
        }
        $("#peopleList").dxList("instance").reload();
        
    }
    
    /* Fetch all the reports from the database */
    
    
    function fetchReports(tx) {
        tx.executeSql('SELECT * FROM reports', [], reportsSuccess, errorCB);
    }
    function reportsSuccess(tx, results) {
        var len = results.rows.length;
        reportDataSource.clear();
        numReports = len;
        console.log("Reports table: " + len + " rows found. numReports=",numReports);
        var navbar = $("#navbar").dxNavBar('instance');
        if(!(typeof(navbar.option()) === 'undefined')) {
            console.log("NavBar:",navbar.option());
            navbar.option().items[3].badge = numReports;
            navbar.repaint();
        }
        for (var i=0; i<len; i++){
            reportDataSource.insert(results.rows.item(i));
            console.log("Results:",results.rows.item(i),"Row = " + i + " ID = " + results.rows.item(i).id + " Report Date =  " + results.rows.item(i).report_date);
        }
        $("#reportList").dxList("instance").reload();
        
    }
    
    /* Fetch the unsynced reports from the DB for uploading */
    
    function fetchUnsyncedReports(tx) {
        tx.executeSql('SELECT * FROM reports where syncSuccess==0', [], reportsUnsyncedSuccess, errorCB);
    }
    function reportsUnsyncedSuccess(tx, results) {
        var len = results.rows.length;
        numUnsyncedReports = len;
        console.log("Unsynced Reports table: " + len + " rows found. numReports=",numReports);
        for (var i=0; i<len; i++){
            reportUnsyncedDataSource.store().insert(results.rows.item(i));
            console.log("Results:",results.rows.item(i),"Row = " + i + " ID = " + results.rows.item(i).id + " Report Date =  " + results.rows.item(i).report_date);
        }
    }
    
    
    
    function querySuccess(tx, results) {
        var len = results.rows.length;
        console.log("table: " + len + " rows found.");
        for (var i=0; i<len; i++){
            console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Name =  " + results.rows.item(i).place_name);
        }
    }

    function populateDB(tx) {
         
        // tx.executeSql('INSERT INTO places VALUES ("","12 Old Main Rd","12","Old Main Road","Hillcrest","","","-29.786757,30.77221099999997","SSW","4981","12 Old Main Rd")');
       tx.executeSql('INSERT INTO places (place_name, street_number,street_name,suburb,complex_name,complex_other,gps,wind_direction, distance, google_address) VALUES ("Home","21","Lynwood Road","Kloof","","","-29.0001,312232","SSW","6994","21 Lynwood Rd, Kloof")');
       //tx.executeSql('INSERT INTO people VALUES ("","Me","Allan","Houston","0836307885","ahouston@gmail.com")');
    }
    
    function createDB(tx){
        console.log("Creating DB tables...");
        //tx.executeSql('DROP TABLE IF EXISTS places');
        //tx.executeSql('DROP TABLE IF EXISTS people');
        //tx.executeSql('DROP TABLE IF EXISTS reports');
        tx.executeSql('CREATE TABLE IF NOT EXISTS places (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,placeName text, houseNumber text,streetName text,suburbName text,complexName text, complexOther text,gpsCoords text, dumpDirection text, dumpDistance text, googleAddress text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS people (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,firstName text,lastName text,phoneNumber text,emailAddress text,ageRange text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS reports (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,firstName text,lastName text,phoneNumber text,emailAddress text,placeName text, houseNumber text,streetName text,suburbName text,complexName text, complexOther text,gpsCoords text, dumpDirection text, dumpDistance text, googleAddress text,syncSuccess int,syncDate datetime)');
    }
    

    // Transaction error callback
    //
    function errorCB(tx, err) {
        console.error("Error processing SQL: ",tx,"err:",err);
    }

    // Transaction success callback
    //
    function successCB() {
        console.log("success!");
    }
