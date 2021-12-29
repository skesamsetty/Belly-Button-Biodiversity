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
        console.log(`processing first time for the Id ${firstName}`)
        plotCharts(firstName);
        loadDemographics(firstName);
    })
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
    console.log(`Metadata for the ID ${selectedID}`);
    
    let selectedSubject = demographics.filter(row => row.id == selectedID);
    console.log(selectedSubject);

    // Select Demographics tab from the webpage
    demographicsTab = d3.select('#sample-metadata');
    
    // Clear previous data if any
    demographicsTab.html("")

    // Load Key value pair to the table attributes for webpage display
    Object.entries(selectedSubject[0]).forEach(([key,value]) => {
        demographicsTab.append("h5").text(`${key}:${value}`);
    });

function plotCharts(selectedID) {
    console.log(`Charts for the ID ${selectedID}`);
}



}
