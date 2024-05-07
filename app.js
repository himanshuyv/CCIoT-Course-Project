document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'YIBXJG6ZZ8R0PI2A';
    const channelId = '2488210';
    const results = 10000; 

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

            
            const last5Field1Data = validField1Data.slice(-5);
            const last5Field2Data = validField2Data.slice(-5);


            const deviceStatus1 = determineDeviceStatus(last5Field1Data,0.15);
            const deviceStatus2 = determineDeviceStatus(last5Field2Data,0.13);

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

    function determineDeviceStatus(validFieldData, threshold) {
        let average = calculateAverage(validFieldData.map(feed => feed.y));
        if (average > threshold) {
            return "On";
        } else{
            return "Off";
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
                color: '#ffffff',
            },
            yaxis: {
                title: 'Current (rms in A)',
                color: '#ffffff',
                range: [0, 6]
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
            mode: 'lines'
        };
        Plotly.newPlot(containerId, [trace], layout, config);
    }


    fetchData();

    setInterval(fetchData, 5000);
});
