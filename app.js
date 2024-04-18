document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'YIBXJG6ZZ8R0PI2A';
    const channelId = '2488210';
    const results = 30; 

    function fetchData() {
        fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=${results}`)
          .then(response => response.json())
          .then(data => {
            
            const validField1Data = data.feeds.filter(feed => !isNaN(parseFloat(feed.field1))).map(feed => ({
                x: new Date(feed.created_at),
                y: parseFloat(feed.field1)
            }));

            
            const validField2Data = data.feeds.filter(feed => !isNaN(parseFloat(feed.field2))).map(feed => ({
                x: new Date(feed.created_at),
                y: parseFloat(feed.field2)
            }));

            console.log(validField1Data[validField1Data.length - 1]);
            console.log(validField2Data[validField2Data.length - 1]);


           
            // const field1Average = calculateAverage(validField1Data.map(feed => feed.y));
            // const field2Average = calculateAverage(validField2Data.map(feed => feed.y));
            

            const deviceStatus1 = determineDeviceStatus(validField1Data);
            const deviceStatus2 = determineDeviceStatus(validField2Data);

            displayDeviceStatus(deviceStatus1, 4);
            displayDeviceStatus(deviceStatus2, 3);

            plotData(validField2Data, 'Current in Washing Machine 3', 'plot-container3');
            plotData(validField1Data, 'Current in Washing Machine 4', 'plot-container4');
          })
          .catch(error => console.error('Error fetching data:', error));
    }

    function calculateAverage(data) {
        return data.reduce((acc, curr) => acc + curr, 0) / data.length;
    }

    function determineDeviceStatus(validFieldData) {
        let flag = 0;
        let countg = 0;
        let countl = 0;
        for (let i = 0; i < validFieldData.length; i++) {
            if (validFieldData[i].y > 0.05) {
                countg++;
            }
            if (validFieldData[i].y < 0.05) {
                countl++;
            }
        }
        if (countl == 0) {
            flag = 1;
        }else{
            if (countg/countl > 1.5) {
                flag = 1;
            }
        }
        if (flag === 1) {
            return 'On';
        } else {
            return 'Off';
        }
    }

    function displayDeviceStatus(status, deviceNumber) {
        const statusContainer = document.getElementById(`device-status${deviceNumber}`);
        if (statusContainer) {
            statusContainer.textContent = `Washing Machine ${deviceNumber} Status: ${status}`;
            statusContainer.style.color = status === 'Off' ? 'red' : 'green';
        }
    }


    function plotData(data, name, containerId) {
        var layout = {
            title: name,
            xaxis: {
                title: 'Timestamp (UTC)',
                color: '#ffffff'
            },
            yaxis: {
                title: 'Current (rms in A)',
                color: '#ffffff'
            },
            plot_bgcolor: '#1f1f1f',
            paper_bgcolor: '#1f1f1f',
            font: {
                color: '#ffffff'
            }
        };

        var config = {responsive: true};

        var trace = {
            x: data.map(feed => feed.x),
            y: data.map(feed => feed.y),
            mode: 'lines+markers'
        };

        Plotly.newPlot(containerId, [trace], layout, config);
    }




    fetchData();

    setInterval(fetchData, 5000);
});
