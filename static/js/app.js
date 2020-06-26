var select_data = d3.select("#selDataset")
var demographic_data = d3.select("#sample-metadata")

d3.json("samples.json").then(function(data){
    var name_data = data.names;
    var metadata = data.metadata;
    var sample_data = data.samples;
    
    //based on the Dataset, updated the select menu options.
    name_data.forEach(function(person, index){
        var person_selector = select_data.append("option")
        person_selector.attr("value", index).text(person)
    });
    
    //initial data for demographic based on default index:0
    demographic_data.html("");
    Object.entries(metadata[0]).forEach(function([key, value]){
        demographic_data.append("p").text(`${key}: ${value}`)
    });

    //initial chart based on default index:0
    initial_bar_chart(sample_data[0]);
    initial_bubble_chart(sample_data[0]);
    initial_gauge_chart(metadata[0]);
    
    //grap action of selecting different index and call function handling the updated selection
    select_data.on("change",UpdateplotFunction);


    function UpdateplotFunction(event){
        var selected_index = select_data.property("value");
        
        console.log(selected_index);
        console.log(sample_data[selected_index]);
        console.log(metadata[selected_index]);
        
        //update data for demographic based on selected index
        demographic_data.html("");
        Object.entries(metadata[selected_index]).forEach(function([key, value]){
            demographic_data.append("p").text(`${key}: ${value}`)
        });
        
        //update chart based on selected index

        update_bar_chart(sample_data[selected_index]);
        update_bubble_chart(sample_data[selected_index]);
        update_gauge_chart(metadata[selected_index]);
    };
});

function initial_bar_chart(selected_sample){
    //select first 10 OTU having largest values.
    var selected_otu = selected_sample.otu_ids.slice(0,10);
    var selected_value = selected_sample.sample_values.slice(0,10);
    var selected_labels = selected_sample.otu_labels.slice(0,10);
    
    // sort data to show figure decreasing order from top.
    var trace1 = {
        x : selected_value.reverse(),
        y : selected_otu.map(data=>`OTU-${data}`).reverse(),
        text: selected_labels.reverse(),
        type : "bar",
        orientation : "h"
    };
    
    var data = [trace1];
    var layout = { title: `<b>10 largest OTUs of Test subject "ID-${selected_sample.id}"</b>`, xaxis:{title:"Number of Reads"}, yaxis:{title: "OTU ID"}};
    var config = {responsive: true};
    Plotly.newPlot("bar", data, layout, config);
};

function initial_bubble_chart(selected_sample){
    var selected_otu = selected_sample.otu_ids;
    var selected_value = selected_sample.sample_values;
    var selected_labels = selected_sample.otu_labels;
    
    var trace = {
        x : selected_otu,
        y : selected_value,
        mode: 'markers',
        marker: {size: selected_value, color: selected_otu},
        text: selected_labels
    };
    var layout = {width:"1200", title: `<b>Bubble Chart of OTUs of Test subject "ID-${selected_sample.id}"</b>`, showlegend: false,  xaxis:{title:"OTU ID"}, yaxis:{title: "Number of Reads"}};
    var data = [trace];
    var config = {responsive: true};
    Plotly.newPlot("bubble",data,layout,config);
};
    
function initial_gauge_chart(selected_data){
    var selected_wfreq = selected_data.wfreq;
    var trace = {
        type: "indicator",
        name: "Gauge Chart",
		title: { text: `<b>Belly Button Washing Frequency</b><br> Scrubs per Week`},
        visible: true,
		mode: "gauge+number",
        value: selected_wfreq,
		domain: {x:[0,1], y:[0,1]},
        gauge: {
            shape: "angular",
            axis: {range:[0,9]},
            bar:{color:"darkred"},
            steps: [
                {range:[0,1],color:"aliceblue"},
                {range:[1,2],color:"beige"},
                {range:[2,3],color:"paleturquoise"},
                {range:[3,4],color:"mediumturquoise"},
                {range:[4,5],color:"turquoise"},
                {range:[5,6],color:"mediumspringgreen"},
                {range:[6,7],color:"mediumseagreen"},
                {range:[7,8],color:"seagreen"},
                {range:[8,9],color:"forestgreen"}
            ]
        }
    };
    var data = [trace];
    var layout = { margin: { t: 0, b: 0 }};
    var config = {responsive: true};
    Plotly.newPlot('gauge', data, layout, config);
};

function update_bar_chart(selected_sample){
    var selected_otu = selected_sample.otu_ids.slice(0,10);
    var selected_value = selected_sample.sample_values.slice(0,10);
    var selected_labels = selected_sample.otu_labels.slice(0,10);
    var update = { title: `<b>10 largest OTUs of Test subject "ID-${selected_sample.id}"</b>`};
//    var update = { title: `<b>10 largest OTUs of Test subject "ID-${selected_sample.id}"</b>`, xaxis:{title:"Number of Reads"}, yaxis:{title: "OTU ID"}};

    Plotly.restyle("bar","x",[selected_value.reverse()]);
    Plotly.restyle("bar","y",[selected_otu.map(data=>`OTU-${data}`).reverse()]);
    Plotly.restyle("bar","text",[selected_labels.reverse()]);
    Plotly.relayout("bar",update)
};

function update_bubble_chart(selected_sample){
    var selected_otu = selected_sample.otu_ids;
    var selected_value = selected_sample.sample_values;
    var selected_labels = selected_sample.otu_labels;
    var update = {title: `<b>Bubble Chart of OTUs of Test subject "ID-${selected_sample.id}"</b>`};
//    var update = {width:"1200", title: `<b>Bubble Chart of OTUs of Test subject "ID-${selected_sample.id}"</b>`, showlegend: false,  xaxis:{title:"OTU ID"}, yaxis:{title: "Number of Reads"}};
    
    Plotly.restyle("bubble","x",[selected_otu]);
    Plotly.restyle("bubble","y",[selected_value]);
    Plotly.restyle("bubble","marker",[{size: selected_value, color: selected_otu}]),
    Plotly.restyle("bubble","text",[selected_labels]);
    Plotly.relayout("bubble",update);

};
    
function update_gauge_chart(selected_data){
    var selected_wfreq = selected_data.wfreq;
    Plotly.restyle("gauge","value",[selected_wfreq]);
};
