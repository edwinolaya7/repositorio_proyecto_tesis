var  map, manzanas,clientes,sectores_comerciales;
var array_feature, geometria, draw;
var features = new ol.Collection();;

function init(){
	$('#dialog-confirm').hide();
	$('#piura_sig_manzanas').prop('checked',false);

	$('.nav-tabs a').click(function(){
	    $(this).tab('show');
	});

	$('#div_administrar_capa').hide();
	var	mapTile = new  ol.layer.Tile({
		source: new ol.source.OSM()
	});
 
	 manzanas = new ol.layer.Tile({
					source : new ol.source.TileWMS({
						url : 'http://localhost:8080/geoserver/wms',
						params: {
							'LAYERS' :'eps_gis:piura_sig_manzanas',
							'FORMAT' : 'image/png'
						},
						transparent:true
					})}); 
	  manzanas.setOpacity(0.5);

	  predios = new ol.layer.Tile({
						source : new ol.source.TileWMS({
							url : 'http://localhost:8080/geoserver/wms',
							params: {
								'LAYERS' :'eps_gis:piura_sig_predios',
								'FORMAT' : 'image/png'
							},
							transparent:true
						})}); 
	  predios.setOpacity(0.5);

	  sectores_comerciales = new ol.layer.Tile({
						source : new ol.source.TileWMS({
							url : 'http://localhost:8080/geoserver/wms',
							params: {
								'LAYERS' :'eps_gis:piura_sig_sector_comercial',
								'FORMAT' : 'image/png'
							},
							transparent:true
						})});  
	  sectores_comerciales.setOpacity(0.5);

	var view = new ol.View({
			center: ol.proj.fromLonLat([-80.615916, -5.191902]),
			zoom:14
		});

	map = new ol.Map({
        target: 'map',
        view: view
  	});
  	manzanas.setVisible(false);
	predios.setVisible(false);
	sectores_comerciales.setVisible(false);
	map.addLayer(mapTile);
	map.addLayer(sectores_comerciales);
	map.addLayer(manzanas);	
	map.addLayer(predios);

}

$(document).ready(function(){

	init();
		
	$('#piura_sig_sector_comercial').click(function(){
		if($('#piura_sig_sector_comercial').prop('checked')){
			sectores_comerciales.setVisible(true);
		}
		else{
			sectores_comerciales.setVisible(false);	
		}		
	});

	$('#piura_sig_manzanas').click(function(){
		if($('#piura_sig_manzanas').prop('checked')){
			manzanas.setVisible(true);
		}
		else{
			manzanas.setVisible(false);
		}		
	});

	$('#piura_sig_predios').click(function(){
		if($('#piura_sig_predios').prop('checked')){
			predios.setVisible(true);
		}
		else{
			predios.setVisible(false);
		}		
	});

	$('#administrar_capa').mouseenter(function(){
		$('#ul_administrar_capa li').remove();
		$('input[name="capas_gis"]:checked').each(function() {
			$('#ul_administrar_capa').append('<li><input name="rb_opcion" value="'+$(this).val()+'" type="radio" >'+$(this).val())+'</li>';
		});		
		$('#ul_administrar_capa').append('<ul><li>'+$('#div_administrar_capa').html()+'</li></ul>');
	});
});

function agregarElementoGis(){
	
	var radio_button = $('input:radio[name=radio_capas]:checked').attr('id');
	if(radio_button=='radio_manzanas'){

		  features = new ol.Collection();
	      var featureOverlay = new ol.layer.Vector({
	        source: new ol.source.Vector({features: features}),
	        style: new ol.style.Style({
	          fill: new ol.style.Fill({
	            color: 'rgba(255, 255, 255, 0.2)'
	          }),
	          stroke: new ol.style.Stroke({
	            color: '#ffcc33',
	            width: 2
	          }),
	          image: new ol.style.Circle({
	            radius: 7,
	            fill: new ol.style.Fill({
	              color: '#ffcc33'
	            })
	          })
	        })
	      });
	      featureOverlay.setMap(map);

	      var draw;

	      function addInteraction() {
	        draw = new ol.interaction.Draw({
	          features: features,
	          type: 'Polygon'
	        });
	        map.addInteraction(draw);

	        draw.on('drawend', function (object) {
	        	
	        	var format = new ol.format.WKT();
	        	var geometria = format.writeFeature(object.feature);
	        	$.ajax({
			    	method: "POST",
			    	url: "/manzana/add_form",
			    	data: {geometria: geometria},
			    	success: function(data){
			    		$('#ventana_emergente').html(data);
			    		$('#ventana_emergente').dialog();
			    	}
			    });
			});
	      }
	      
	      addInteraction();

	}
	else if(radio_button=='radio_predios'){
		
	}
	else{
		$('#lbl_mensaje').text('Debe Elegir una opcion del Menu Administrar Capa');      	 				
		$('#lbl_mensaje').toggle(2000, function(){	$('#lbl_mensaje').text('');	});
	}
}

function seleccionarElementoGis(){
	var radio_button = $('input:radio[name=radio_capas]:checked').val();
	if(radio_button!='undefined'){

		  var featureOverlay = new ol.layer.Vector({
	        source: new ol.source.Vector({features: features}),
	        style: new ol.style.Style({
	          fill: new ol.style.Fill({
	            color: 'rgba(255, 255, 255, 0.2)'
	          }),
	          stroke: new ol.style.Stroke({
	            color: '#ffcc33',
	            width: 2
	          }),
	          image: new ol.style.Circle({
	            radius: 7,
	            fill: new ol.style.Fill({
	              color: '#ffcc33'
	            })
	          })
	        })
	      });
	      featureOverlay.setMap(map);

	      function addInteraction() {
	        draw = new ol.interaction.Draw({
	          features: features,
	          type: 'Polygon'
	        });
	        map.addInteraction(draw);
	        
	        draw.on('drawend', function (object) {

	        	var format = new ol.format.WKT(); 
	        	geometria = format.writeFeature(object.feature);
	        	features.clear();
			});
	      }
	      
	      addInteraction();
	}
	else{
		$('#lbl_mensaje').text('Debe Elegir una opcion del Menu Administrar Capa');
		$('#lbl_mensaje').toggle(2000, function(){	$('#lbl_mensaje').text('');	});
	}
}

function editarElementoGis(){

	var radio_button = $('input:radio[name=radio_capas]:checked').val();
	if(radio_button!='undefined'){

	}
	else{
		$('#lbl_mensaje').text('Debe Elegir una opcion del Menu Administrar Capa');
		$('#lbl_mensaje').toggle(2000, function(){	$('#lbl_mensaje').text('');	});
	}
}

function eliminarElementoGis(){
	var radio_button = $('input:radio[name=radio_capas]:checked').val();
	if(radio_button!='undefined'){

		$( "#dialog-confirm" ).dialog({
		      resizable: false,
		      height: "auto",
		      width: 400,
		      modal: true,
		      buttons: {
		        "Eliminar Manzana": function() {
		          		$.ajax({
					    	method: "POST",
					    	url: "/manzana/delete",
					    	data: {geometria: geometria},
					    	success: function(data){
					    		if(data='1'){
					    			manzanas.getSource().updateParams({'time':Date.now()});					    			
					    		}
					    		else{
					    			$('#mensaje').show(); 	 		
				                    $('#mensaje').text('Error al eliminar manzana!!!');
								    setTimeout(function() {
				                            $("#mensaje").fadeOut(1500);
				                        },3000);
					    		}
					    	}
					    });
					    $( this ).dialog( "close" );
		        },
		        Cancel: function() {
		          $( this ).dialog( "close" );
		        }
		      }
		    });		
	}
	else{
		$('#lbl_mensaje').text('Debe Elegir una opcion del Menu Administrar Capa');      	 				
		$('#lbl_mensaje').toggle(2000, function(){	$('#lbl_mensaje').text('');	});
	}
}
