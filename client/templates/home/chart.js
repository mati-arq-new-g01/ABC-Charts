Template.senseChart.created = function () {
    var self = this;

    var sensors1 = [{
        _id: 0,
        name: 'Temperature',
        sensorId: 'Temperature',
        color: '#0066FF'
    }];
    self.senseSeriesSensors = new ReactiveVar(sensors1);
};

Template.twitterChart.created = function () {
    var self = this;

    var sensors2 = [{
        _id: 0,
        name: 'Social Networks',
        sensorId: 'Twitter',
        color: '#0066FF'
    }];
    self.twitterSeriesSensors = new ReactiveVar(sensors2);
};

Template.senseChart.helpers({
    listSensors: function () {
        return Template.instance().senseSeriesSensors.get();
    },
    Sensors: function () {
        return Sensors.find({});
    }
});

Template.twitterChart.helpers({
    listSensors: function () {
        return Template.instance().twitterSeriesSensors.get();
    },
    Sensors: function () {
        return Sensors.find({});
    },
	
	popularidad: function() {
    var animales = {};
    Popularidad.find().forEach(function(e) {
      if (animales[e.animal] == null)
        animales[e.animal] = 0;
      animales[e.animal] += e.cuenta;
    });

    var results = [];
    _.each(animales, function(value, key) {
      results.push({name: key, y: value});
    });
	
    return results;
  }
});


Template.senseChart.rendered = function () {
    var self = this;
    $('#color').colorpicker();
    builtSenseColumn();

    self.autorun(function () {
        updateSenseChart();
    });
};


Template.twitterChart.rendered = function () {
    var self = this;
    $('#color').colorpicker();
    builtTwitterColumn();
    self.autorun(function () {
        updateTwitterChart();
    });
};

var senseSeriesList = [{
    name: 'Temperatura',
	lineWidth: 4,
    data: [],
    yAxis: 0,
    tooltip: {
        valueSuffix: ' mm'
    }
}] ;

var twitterSeriesList = [{
    name: 'Twitter',
    colorByPoint: true,
	data: []
	
}] ;


function updateSenseChart() {
    if (typeof (chartSense) !== 'undefined') {
        Temperature.find({
            sensorType: "Temperature"
        }).observe({
            added: function (temperature) {
                if (chartSense.series.length > 0) {
                    var series = chartSense.series[0],
                        shift = series.data.length > 20; // Si la serie es mayor a 20 empezar a correr
                    var point = {
                        x: temperature.createdAt,
                        y: temperature.value
                    };
                    // añadir el punto a la serie
                    chartSense.series[0].addPoint(point, true, shift);
                };

            }
        });

    } else {
        console.log('gráfico indefinido');
    }
};


function builtSenseColumn() {


    chartSense = new Highcharts.Chart({
        chart: {
            zoomType: 'xy',
            renderTo: 'container-column',
			type: "spline"
        },
        colors: ["#0066FF"],
        title: {
            text: 'Temperatura'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
			labels: {
			format: '{value}°C',
			style: {
				color: '#0066FF'
			}
		},
		title: {
			text: 'Temperatura',
			style: {
				color: '#0066FF'
				}
			}
		},
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>Hora:' + Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>Valor:' + Highcharts.numberFormat(this.y, 0);
            }
        },
        exporting: {
            enabled: false
        },
		plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: senseSeriesList
    });
	Highcharts.setOptions({
	  global: {
		useUTC: false
	  }
	});
};

function updateTwitterChart() {
	
    if (typeof (chartTwitter) !== 'undefined') {
        Popularidad.find({
            sensorType: "Twitter"
        }).observe({
            added: function (popularidad) {
		var res = Template.twitterChart.__helpers.get('popularidad').call();
		chartTwitter.series[0].setData(res, true);
					}
				});

			} else {
				console.log('gráfico indefinido');
			}
};


function builtTwitterColumn() {
    chartTwitter = new Highcharts.Chart({
        chart: {
            zoomType: 'xy',
            renderTo: 'container-column2',
			type: "pie",
			options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },

        title: {
            text: 'Twitter'
        },
        xAxis: {
			type: 'category'
        },
        yAxis: {
			labels: {
			format: '{value}'
			
		},
		title: {
			text: 'Twitter',
			style: {
				color: '#0066FF'
				}
			}
		},
        tooltip: {
            formatter: function () {
                return 'Recuento:' + Highcharts.numberFormat(this.y, 0);
            }
        },
        exporting: {
            enabled: false
        },
		plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: twitterSeriesList
    });
};