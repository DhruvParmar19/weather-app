let currentWeather = {
    apikey: "e88c429a5f4e8bce8fee211955f8d9b3",

    fetchWeather: function(latitude, longitude){
        fetch("https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&units=metric&appid="+this.apikey)
        .then((response) => response.json())
        .then((data) => this.displayCurrentWeather(data));
    },

    displayCurrentWeather: function(data){
        const {name} = data;
        const{feels_like,humidity,pressure,temp,temp_max,temp_min} = data.main;
        const {dt} = data;
        const {deg, speed} = data.wind;
        const {id, main, description, icon} = data.weather[0];
        const {country, sunrise, sunset}= data.sys;

        //converting to appropriate format 
        convertors.epochConvertor(dt);

        document.querySelector(".city").innerHTML = "Weather in " + name +", "+country;
        document.querySelector(".temp").innerHTML = Math.round(temp)+ "°C";
        document.querySelector(".feels_like").innerHTML = "Feels like: "+Math.round(feels_like)+ "°C";
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon +".png";
        document.querySelector(".description").innerHTML = description;
        document.querySelector(".humidity").innerHTML = "Humidity: " + humidity +"%";
        document.querySelector(".wind").innerHTML = ""+convertors.windSpeed(speed).toFixed(2)+ " km/h";

         function myFunction(x) {
                document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?"+description+"')";
          };
          
          var x = window.matchMedia("(max-width: 500px)");
          myFunction(x); // Call listener function at run time
          x.addListener(myFunction) // Attach listener function on state changes

        // Console logging varibles for testing
        console.log(data);
        console.log(country, "Sunrise: "+convertors.epochConvertor(sunrise).hours +":"+ convertors.epochConvertor(sunrise).minutes, 
        "sunset: "+convertors.epochConvertor(sunset).hours+":"+ convertors.epochConvertor(sunrise).minutes);
        console.log(id, main, description, icon);
        console.log(feels_like,humidity,pressure,temp,temp_max,temp_min,dt,deg,convertors.windSpeed(speed)+ " km/h");
    }
};

let convertors = {

    epochConvertor: function(dt){
        var myDate = new Date( dt *1000);
        var hours = myDate.getHours();
        var minutes = myDate.getMinutes();
        return {hours, minutes};
    },

    windSpeed: function(speed){
        return speed * 3.6;
    }


};

let geocode = {

    fetchGeoCode: function(name){
        fetch("https://api.openweathermap.org/geo/1.0/direct?q="+name+"&appid=" + currentWeather.apikey)
        .then((response) => response.json())
        .then((data) => this.geoCoding(data));
    },

    geoCoding: function(data){
        currentWeather.fetchWeather(data[0].lat,data[0].lon);
        console.log("geoCoding: ");
        console.log(data);
    },

    getLocation: function(){
        function sucess(data){
            currentWeather.fetchWeather(data.coords.latitude, data.coords.longitude);
            console.log(data);
        }
        if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(sucess, console.error);
        }
        else{
          this.fetchGeoCode("seattle");
        }
    }
};


document.querySelector(".search-button").addEventListener("click", function(){
    geocode.fetchGeoCode(document.querySelector(".search-bar").value);
});

document.querySelector(".search-bar").addEventListener('keyup',function(event){
    if(event.key == "Enter"){
        geocode.fetchGeoCode(document.querySelector(".search-bar").value);
    }
});

document.querySelector(".location-button").addEventListener("click", function(){
    geocode.getLocation();
});

geocode.fetchGeoCode("seattle");
