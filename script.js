function start(){
    var dateForm = document.getElementById('dateform');
    dateForm.classList.remove('hidden');
    var dummy = document.getElementById('dummyButton');
    dummy.classList.add('hidden');
    var header = document.getElementById('mainHeader');
    var headerDiv = document.getElementById('headerDiv');
    headerDiv.classList.add('navbar');
    header.classList.add('headerRunning');
}

const url = 'https://script.google.com/macros/s/AKfycbzrOw2MrsHiOgZ-l3nNH_9HB1RVbObp3mUOVFCNEFuxsqFi3VVM4nWyjPUFaRtP0D6EOg/exec'


document.getElementById('dateButton').addEventListener('click',function(){
    var stationForm = document.getElementById('stationform');
    var submitButton = document.getElementById('submitButton');

    stationForm.classList.remove('hidden');
    submitButton.classList.remove('hidden');

    var date = document.getElementById('date').value;
    var action ='get_rainfall_data';
    var GETurl = `${url}?action=${action}&date=${date}`;

    fetch(GETurl, {
        method : 'GET',
    })
    .then(response => response.text())
    .then(data =>{
        var jsonData = JSON.parse(data);
        displayRainfallData(jsonData);
    })
})

function displayRainfallData(data) {
    var container = document.getElementById('rainfall-container');

    container.innerHTML = '';

    var table = document.createElement('table');
    table.classList.add('rainfall-table');


    var headerRow = document.createElement('tr');


    var stationHeader = document.createElement('th');
    stationHeader.textContent = 'Station';
    var rainfallHeader = document.createElement('th');
    rainfallHeader.textContent = 'Rainfall';


    headerRow.appendChild(stationHeader);
    headerRow.appendChild(rainfallHeader);


    table.appendChild(headerRow);


    data.forEach(function(entry) {

        var row = document.createElement('tr');


        var stationCell = document.createElement('td');
        stationCell.textContent = entry.station;
        var rainfallCell = document.createElement('td');
        rainfallCell.textContent = entry.rainfall;


        row.appendChild(stationCell);
        row.appendChild(rainfallCell);


        table.appendChild(row);
    });


    container.appendChild(table);
}

function populateDropdown(stationNames) {
    var dropdown = document.getElementById('stationDropdown');
    stationNames.forEach(function(station) {
        var option = document.createElement('option');
        option.text = station;
        option.value = station;
        dropdown.appendChild(option);
    });
    
}

function getStationNames() {

    var action = 'get_station_data';
    var GETurl = `${url}?action=${action}`;
    fetch(GETurl, {
        method: 'GET',
        
    })
    .then(response => response.text())
    .then(data => 
    {
        var jsonData = JSON.parse(data)
        populateDropdown(jsonData)
    })
    .catch(error => console.error('Error fetching station names:', error));
}


document.addEventListener('DOMContentLoaded', function() {
    var stationSelect = document.getElementById('stationDropdown');
    var stationAttributes = document.getElementById('station-attributes');
    var rainfallAttributes = document.getElementById('rainfall-attributes')
    
    stationSelect.addEventListener('change', function() {
        if (this.value === 'create_station') {
            stationAttributes.classList.remove('hidden');
            rainfallAttributes.classList.add('hidden')
        } else {
            rainfallAttributes.classList.remove('hidden')
            stationAttributes.classList.add('hidden')
        }
    });

    var form = document.getElementById('rainfall-form');
    document.getElementById('submitButton').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission
        
        var formData = new FormData(form);
        var stationValue = formData.get('station');

        var passkey = prompt("Enter Password: ");

        if (stationValue === 'create_station') {
            var stationName = document.getElementById('stationName')
            var stationOwner = document.getElementById('stationOwner')
            var request = {
                action: 'create_station',
                station: stationName.value,
                owner: stationOwner.value,
                passkey: passkey
            }
            console.log('Creating new station...');
        } else {
            var Date = document.getElementById('date')
            var Rainfall = document.getElementById('rainfall')
            var request = {
                action:'add_rainfall_data',
                station: stationSelect.value,
                date: Date.value,
                rainfall:Rainfall.value,
                passkey: passkey
            }
            console.log('Submitting rainfall data...');
        }

        

        fetch(url, {
            redirect: 'follow',
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response:', data);

            if (data.status == 'Success!'){
                alert("Data Saved Successfully!");
            }
            else{
                alert("Couldn't save data due to "+data.status);
            }
            

        })
        .catch(error => {
            console.error('Error:', error);

        });

        rainfallAttributes.classList.add('hidden')
        stationAttributes.classList.add('hidden')
    });
});
