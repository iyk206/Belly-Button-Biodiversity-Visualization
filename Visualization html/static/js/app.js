// mainData = d3.json("data/samples.json")

function init() {
    var dropdownMenu = d3.select("#selDataset")
    d3.json("data/samples.json").then((data) => {
        var speciesNames = data.names;

        speciesNames.forEach((specimen) => {
            dropdownMenu.append("option").text(specimen).node().value
        });
        
        panelUpdate(speciesNames[0])
        barChart(speciesNames[0])
        bubbleChart(speciesNames[0])
    });
};

function optionChanged(alternateSample) {
    barChart(alternateSample);
    bubbleChart(alternateSample);
    panelUpdate(alternateSample);
}

function panelUpdate(specimenID) {

    d3.json("data/samples.json").then((data) => {
        var targetData = data.metadata;

        var filteredData = targetData.filter(row => row.id == specimenID);
        var result = filteredData[0];

        console.log(result);

        panel = d3.select("#sample-metadata");

        panel.html("");

        Object.entries(result).forEach(([key,value]) => {
            panel.append("h5").text(`${key}: ${value}`)
        });
    });
};

function barChart(specimenID) {
    d3.json("data/samples.json").then((data) => {
        var species = data.samples;
        var filteredData = species.filter(row => row.id == specimenID);
        var result = filteredData[0];
        
        var specimen_ID = result.otu_ids;
        var specimen_labels = result.otu_labels;
        var specimen_count = result.sample_values;
        var topTenSamples = specimen_ID.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        var trace = {
            x: specimen_count.slice(0, 10).reverse(),
            y: topTenSamples,
            text: specimen_labels.slice(0, 10).reverse(),
            orientation: "h",
            type: "bar"
        };


        var layout = {
            title: "Top 10 Frequently Found Bacterias",
            xaxis: {title: "Bacteria Count"},
            yaxis: {title: "Bacteria Species"}
        };
        Plotly.newPlot("bar", [trace], layout);

    });
};

function bubbleChart(specimenID) {
    d3.json("data/samples.json").then((data) => {
        var species = data.samples;
        var filteredData = species.filter(row => row.id == specimenID);
        var result = filteredData[0];
        
        var specimen_ID = result.otu_ids;
        var specimen_labels = result.otu_labels;
        var specimen_count = result.sample_values;
        var topTenSamples = specimen_ID;
        
        var trace = {
            x: specimen_ID,
            y: specimen_count,
            text: specimen_labels,
            mode: "markers",
            marker: {
                size: specimen_count,
                color: specimen_ID,
                colorscale: "Earth"
            }
        }
        var layout = {
            title: "Bubble Chart of Bacteria Species Found",
            hovermode: "closest",
            width: 1000,
            height: 500,
            xaxis: {title: "Bacteria Species"}
        }
        Plotly.newPlot("bubble", [trace], layout);
        })
}


init();