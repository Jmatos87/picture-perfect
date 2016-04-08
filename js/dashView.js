import DOM from 'react-dom'
import React, {Component} from 'react'
import Header from './header'

var DashView = React.createClass ({
	
	render:function(){
		window.initMap = function(){



			var success= function(pos) {
		  			var crd = pos.coords;
		  			var myLatLng = {lat:crd.latitude, lng: crd.longitude}

		  			var map = new google.maps.Map(document.getElementById('map'), {
			  			center: myLatLng,
			  			zoom: 18
					});

					var contentString = 
						'<div id="content">'+
					      	'<h5 id="firstHeading" class="firstHeading">Current Position</h5>'+
					      	'<div id="bodyContent">'+
					      		'<p>Click and drag your position to find where you want a picture taken</p>'+
					      		'<p>Latitude:'+crd.latitude+' <br>Longitude:'+crd.longitude+'</p>'
					      '</div>'+
					    '</div>';

					  var infowindow = new google.maps.InfoWindow({
					    content: contentString
					  });


		  			var marker = new google.maps.Marker({
		    			position: myLatLng,
		    			map: map,
		    			title: 'Hello World!',
		    			draggable:true,
  					});

  					marker.addListener('click', function() {infowindow.open(map, marker);});
			}
		
  			

			var error= function (err) {
  				console.warn('ERROR(' + err.code + '): ' + err.message);
			};

			navigator.geolocation.getCurrentPosition(success, error)
		}
			console.log(this.props.user)
		return(


			<div id='dashView'> 
			<Header user={this.props.user}/>
			<NavBar />
			<div id='crucible'>
			</div>
			<div id="map">
				
			</div>
			<a href="#logout" >log out</a>
			</div>
		)
	}
})


var NavBar = React.createClass ({

	render:function(){

		return (
			<div id='navigation'>
				<ul>
					<a href="#nearby">
						<li className="tabs">Requests Near Me</li>
					</a>
					<a href="#makeRequest">
						<li className="tabs">Make a New Request
						</li>
					</a>
					<a href="#pending">
						<li className="tabs">Pending Requests
						</li>
					</a>
					<a href="#images">
						<li className="tabs">Image Library
						</li>
					</a>

				</ul>

			</div>
		)
	}
})



export default DashView