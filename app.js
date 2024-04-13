document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'YIBXJG6ZZ8R0PI2A';
    const channelId = '2488210';
    const results = 2; // Number of latest entries to fetch

    function fetchData() {
        fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=${results}`)
          .then(response => response.json())
          .then(data => {
            // Filter out timestamps with NaN values for field 1
            const validField1Data = data.feeds.filter(feed => !isNaN(parseFloat(feed.field1))).map(feed => ({
                x: new Date(feed.created_at),
                y: parseFloat(feed.field1)
            }));

            // Filter out timestamps with NaN values for field 2
            const validField2Data = data.feeds.filter(feed => !isNaN(parseFloat(feed.field2))).map(feed => ({
                x: new Date(feed.created_at),
                y: parseFloat(feed.field2)
            }));

            // Calculate average of field1 and field2 data
            const field1Average = calculateAverage(validField1Data.map(feed => feed.y));
            const field2Average = calculateAverage(validField2Data.map(feed => feed.y));

            // Determine device status based on averages
            const deviceStatus1 = determineDeviceStatus(field1Average);
            const deviceStatus2 = determineDeviceStatus(field2Average);

            // Display device status
            displayDeviceStatus(deviceStatus1, 1);
            displayDeviceStatus(deviceStatus2, 2);

            // Plot data
            plotData(validField1Data, 'Current in Washing Machine 1', 'plot-container1');
            plotData(validField2Data, 'Current in Washing Machine 2', 'plot-container2');
          })
          .catch(error => console.error('Error fetching data:', error));
    }

    // Function to calculate average
    function calculateAverage(data) {
        return data.reduce((acc, curr) => acc + curr, 0) / data.length;
    }

    // Function to determine device status
    function determineDeviceStatus(average) {
        return average < 1 ? 'Off' : 'On';
    }

    // Function to display device status
    // Function to display device status
    function displayDeviceStatus(status, deviceNumber) {
        const statusContainer = document.getElementById(`device-status${deviceNumber}`);
        if (statusContainer) {
            // Clear previous status before updating with new status
            statusContainer.textContent = `Device ${deviceNumber} Status: ${status}`;
            statusContainer.style.color = status === 'Off' ? 'red' : 'green';
        }
    }


    // Function to plot data
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




    // Initial fetch
    fetchData();

    setInterval(fetchData, 5000);
});
