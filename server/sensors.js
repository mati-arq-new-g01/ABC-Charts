Meteor.startup(function () {
    Sensors.remove({});
	Temperature.remove({});
	Popularidad.remove({});
	if (Sensors.find().count() === 0) {
        var data = [{
            name: "Temperature",
            sensorType: "Temperature"
        },
		{
            name: "Social Networks",
            sensorType: "Twitter"
        }];
        _.each(data, function(list) {
			console.log(list);
          var sensor_id = Sensors.insert({
              name: list.name,
              sensorType: list.sensorType
          });
		  
		  //Descomentar para simular los sensores
		  
		  Meteor.setInterval(function () {
			  valor = getRandomValue(10,35);
			  fecha = new Date();
              Temperature.insert({
                  value: valor,
                  sensorType: list.sensorType,
                  createdAt: fecha
              });		  
			  animalStr = getAnimal(valor);
              Popularidad.insert({
                  cuenta: valor,
                  sensorType: list.sensorType, 
				  animal: animalStr,
                  createdAt: fecha
              });
			  
			  
              console.log(list.sensorType + ":" + valor );
            }, 5000);
			function getRandomValue(max, min) {
			 return Math.floor(Math.random() * (max - min)) + min;
        };
		function getAnimal( valor)
			{
			 	
				if (valor % 2 == 0)
					return "Perro";
				else
					return "Gato";
			};
		
		//Descomentar para simular los sensores
		
        });

    }
});