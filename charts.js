function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      var resultSamp = sampleArray[0];
      
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_ids = resultSamp.otu_ids;
      var otu_labels = resultSamp.otu_labels;
      var sample_values = resultSamp.sample_values;
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      top_otus = otu_ids.slice(0,10)
      //console.log(top_otus)
      top_values = sample_values.slice(0,10)
      //console.log(top_values)

      sorted_otus = top_otus.reverse()
      sorted_values = top_values.sort(function(a,b){
        return a-b
      })
      //console.log(sorted_otus)
      //console.log(sorted_values)
      var otu_strings = sorted_otus.map(String)
      //console.log(otu_strings)

      let full_otu_strings = otu_strings.map((string) => "OTU " + string )
      //console.log(full_otu_strings)
      // 8. Create the trace for the bar chart. 
      var barData = [{ 
        x: sorted_values,
        y: full_otu_strings,
        type: "bar",
        orientation: "h",
        text: otu_labels.reverse()        
    }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
       title: "Highest Sample Values",
       autosize: true
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
    
        // 1. Create the trace for the bubble chart.
        var bubbleData = [{
          x: otu_ids,
          y: sample_values,
          type: "bubble",
          mode: 'markers',
          text: otu_labels,
          marker:{
            color: otu_ids,
            size: sample_values,
            colorscale: 'YlGnBu'
          }
        }

        ];
    
        // 2. Create the layout for the bubble chart.
        var bubbleLayout = {
          title: "Bacterial Cultures in Sample",
          xaxis: { title: {text: "OTU of bacteria"}},
          yaxis: {title: {text: "Value found in sample"}},
          hovermode: "closest",
          margin: {pad: 5},
          autosize: true
        };
    
        // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 






    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  

    // 2. Create a variable that holds the first sample in the metadata array.
    var resultMeta = resultArray[0];


    // 3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(resultMeta.wfreq)
  
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: washFreq,
        type: "indicator",
        mode: "gauge+number",
        title: "<b>" + "Navel Washing Frequency" + "</b>",
        gauge: {
          axis: { range: [0,10], tickwidth: 1},
          bar: { color: "black" },
          bgcolor: "white",
          steps: [
            { range: [0, 2], color: "plum" },
            { range: [2, 4], color: "cornflowerblue" },
            { range: [4,6], color: "lightskyblue"},
            {range: [6,8], color: "paleturquoise"},
            {range: [8,10], color: "mediumspringgreen"}
          ],
         
      }
    }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     title: "Navel Washes Per Week",
     autosize: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    })};


