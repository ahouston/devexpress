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
        db.transaction(populateDB, errorCB, successCB);
        db.transaction(fetchPlaces,errorCB);
        db.transaction(fetchPeople,errorCB);
        initDashboard();

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    }
    
  
    
};

    function fetchPlaces(tx) {
        tx.executeSql('SELECT * FROM places', [], placesSuccess, errorCB);
    }
    function placesSuccess(tx, results) {
        var len = results.rows.length;
        numPlaces = len;
        console.log("table: " + len + " rows found. numPlaces=",numPlaces);
        var navbar = $("#navbar").dxNavBar('instance');
        if(!(typeof(navbar.option()) === 'undefined')) {
            console.log("NavBar:",navbar.option());
            navbar.option().items[1].badge = numPlaces;
            navbar.repaint();
        }
        for (var i=0; i<len; i++){
            placeDataSource.store().insert(results.rows.item(i));
            console.log("Results:",results.rows.item(i),"Row = " + i + " ID = " + results.rows.item(i).id + " Name =  " + results.rows.item(i).place_name);
        }
        $("#placeList").dxList("instance").reload();
        
    }
    
    function fetchPeople(tx) {
        tx.executeSql('SELECT * FROM people', [], peopleSuccess, errorCB);
    }
    function peopleSuccess(tx, results) {
        var len = results.rows.length;
        numPeople = len;
        console.log("People table: " + len + " rows found. numPeople=",numPeople);
        var navbar = $("#navbar").dxNavBar('instance');
        if(!(typeof(navbar.option()) === 'undefined')) {
            console.log("NavBar:",navbar.option());
            navbar.option().items[2].badge = numPeople;
            navbar.repaint();
        }
        for (var i=0; i<len; i++){
            peopleDataSource.store().insert(results.rows.item(i));
            console.log("Results:",results.rows.item(i),"Row = " + i + " ID = " + results.rows.item(i).id + " Name =  " + results.rows.item(i).person_name);
        }
        $("#peopleList").dxList("instance").reload();
        
    }
    
    
    function querySuccess(tx, results) {
        var len = results.rows.length;
        console.log("table: " + len + " rows found.");
        for (var i=0; i<len; i++){
            console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Name =  " + results.rows.item(i).place_name);
        }
    }

    function populateDB(tx) {
         
         tx.executeSql('DROP TABLE IF EXISTS places');
         tx.executeSql('DROP TABLE IF EXISTS people');
         tx.executeSql('CREATE TABLE IF NOT EXISTS places (id int primary key not null,place_name text, street_number text,street_name text,suburb text,complex_name text,gps text)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS people (id int primary key not null,person_name text, first_name text,last_name text,tel_number text,email_address text)');
         tx.executeSql('INSERT INTO places VALUES ("","Home","21","Lynwood Road","Kloof","","")');
         tx.executeSql('INSERT INTO people VALUES ("","Me","Allan","Houston","0836307885","ahouston@gmail.com")');
    }

    // Transaction error callback
    //
    function errorCB(tx, err) {
        console.error("Error processing SQL: "+err);
    }

    // Transaction success callback
    //
    function successCB() {
        console.log("success!");
    }
