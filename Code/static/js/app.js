//Function executed while loading the webpage
function init() {
    let selector = d3.select('#selDataset');

    d3.json("samples.json").then((data) => {
        inputNames = data.names;
        demographics = data.metadata;
        samples = data.samples;

        console.log(`names: ${inputNames}`);

        inputNames.forEach(name => {
            selector.append("option")
                    .text(name)
                    .property("value", name)
        });

        let firstName = inputNames[0];
        // console.log(`processing first time for the Id ${firstName}`)
        plotCharts(firstName);
        loadDemographics(firstName);
    });
}

// Call init function so the app executes for the first time
init();

// Function executed when value is changed from the dropdown, 
function optionChanged(selectedID) {
    console.log(`Selected ID: ${selectedID}`);
    plotCharts(selectedID);
    loadDemographics(selectedID);    
}

// Function to load the demographics of selected Subject ID.
function loadDemographics(selectedID) {
    
    let selectedSubject = demographics.filter(row => row.id == selectedID);
    console.log(`Demographics for the ID ${selectedID}`);
    console.log(selectedSubject)

    // Select Demographics tab from the webpage
    demographicsTab = d3.select('#sample-metadata');
    
    // Clear previous data if any
    demographicsTab.html("")

    // Load Key value pair to the table attributes for webpage display
    Object.entries(selectedSubject[0]).forEach(([key,value]) => {
        demographicsTab.append("h6").text(`${key}: ${value}`);
    });

}

// Function to plot charts
function plotCharts(selectedID) {

    let selectedSample = samples.filter(row => row.id == selectedID);
    let sample = selectedSample[0];
    console.log(`Samples for ID ${selectedID}`);
    console.log(sample);

    let washFrequency = demographics.filter(row => row.id == selectedID)[0]["wfreq"];
    console.log(`Wash Frequency: ${washFrequency}`);

    // Plot Horizontal Bar chart
    let plotTitle = `Top 10 OTUs for ID: ${selectedID}`;
    let xValues = sample['sample_values'].slice(0,10).reverse();
    let yLabels = sample['otu_ids'].slice(0,10).map((otu_id) => "OTU " + otu_id).reverse();
    let hoverText = sample['otu_labels'].slice(0,10).reverse();

    let barTrace = {
        x: xValues,
        y: yLabels,
        type: "bar",
        text: hoverText,
        orientation: "h"
    };

    let data = [barTrace];
    let chartLayout = {
            title: plotTitle,
            height: 600,
            width: 400            
    };
    Plotly.newPlot("bar", data, chartLayout);

    // Plot Bubble chart
    plotTitle = `Bubble chart to show samples for ID: ${selectedID}`;
    xValues = sample['otu_ids'];
    yLabels = sample['sample_values'];
    hoverText = sample['otu_labels'];

    let bubbleTrace = {
        x: xValues,
        y: yLabels,
        text: hoverText,
        mode: 'markers',
        marker: {
            size: yLabels,
            color: xValues
        }
    };

    data = [bubbleTrace];
    chartLayout = {
            title: plotTitle,
            height: 800,
            width: 1200,
            xaxis: {
                title: 'OTU ID'
            }
    };
    Plotly.newPlot("bubble", data, chartLayout);


    // Function to plot Washing frequency
// Plot Gauge chart
    plotTitle = 'Belly Buttom Washing Frequency';
    var gaugeTrace = {
            domain: { x: [0, 1], y: [0, 1] },
            value: washFrequency,
            title: { text: "<b> Belly Buttom Washing Frequency </b> <br> Scrubs per Week " },
            type: "indicator",
            gauge: {
                axis: { range: [0, 9], tickcolor: "black", tickmode: "array", tickvals: [0,1,2,3,4,5,6,7,8,9], ticktext: [0,1,2,3,4,5,6,7,8,9] },
                bar: { color: "#669999" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "transparent",
                textposition: "inside",
                steps: [
                    { range: [0, 1], color: "#FFFFF0"},
                    { range: [1, 2], color: "#F5F5DC"},
                    { range: [2, 3], color: "#FFFFCC"},
                    { range: [3, 4], color: "#E5FFCC"},
                    { range: [4, 5], color: "#CCFFCC"},
                    { range: [5, 6], color: "#CCFFE5"},
                    { range: [6, 7], color: "#99FFCC"},
                    { range: [7, 8], color: "#66FFB2"},
                    { range: [8, 9], color: "#33FF99"}
                ],
            },
            mode: "gauge+number"

        };
    data = [gaugeTrace];
    chartLayout = {
            title: plotTitle,
            width: 600,
            height: 400,
            margin: { t: 0, b: 0 }
    };    
    Plotly.newPlot("gauge", data, chartLayout);

}
