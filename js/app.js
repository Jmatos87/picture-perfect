// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'
import Backbone from 'bbfire'
import Firebase from 'firebase'
import GoogleMapsLoader from 'google-maps'




GoogleMapsLoader.KEY = 'AIzaSyCBk6YlI4NCtmnGcHzPr8u89xtvKUTfvXg';




//var QueryByEmail = Backbone.Firebase.Collection.extend({
//     initialize: function(targetEmail) {
//         this.url = ref.child('users').orderByChild('email').equalTo(targetEmail)
//     },
//     autoSync: false
// })



//Models and Collections------>
var UserModel = Backbone.Firebase.Model.extend({
    initialize: function(uid) {
        this.url = `http://pictureperfect.firebaseio.com/users/${uid}`
    }
})

var UserPersonalRequests = Backbone.Firebase.Collection.extend({
    initialize: function(uid) {
        this.url = `http://pictureperfect.firebaseio.com/users/${uid}/requests`
    }
})

var AllRequests = Backbone.Firebase.Collection.extend({
    initialize: function() {
        this.url = `http://pictureperfect.firebaseio.com/allRequests/`
    }
})

var ReceivedImages = Backbone.Firebase.Collection.extend({
    initialize: function(uid) {
        this.url = `http://pictureperfect.firebaseio.com/users/${uid}/images`
    }
})

var SentImages = Backbone.Firebase.Collection.extend({
    initialize: function(uid) {
        this.url = `http://pictureperfect.firebaseio.com/users/${uid}/sentImages`
    }
})

//Intro Page
var SplashPage = React.createClass({
    email: '',
    password: '',
    realName: '',

    _handleSignUp: function() {
        this.props.createUser(this.email,this.password,this.realName)
        
    },

    _handleLogIn: function() {
        this.props.logUserIn(this.email,this.password)
    },

    _updateEmail: function(event) {
        this.email = event.target.value
    },

    _updateName: function(event) {
        this.realName = event.target.value
    },

    _updatePassword: function(event) {
        this.password = event.target.value
    },

    render: function() {
        return (
            <div className="loginContainer">
                <img id='bgImg' src='http://bossfight.co/wp-content/uploads/2015/07/bossfight-stock-images-photos-photography-free-high-resolution-map-camera.jpg' />
                <div className='text'>
                    <LogInHeader />
                    <h1>Your visual access to all the places you aren't currently at</h1>
                </div>
                <input placeholder="enter your e-mail" onChange={this._updateEmail} />
                <input placeholder="enter your password" onChange={this._updatePassword} type="password" />
                <input placeholder="enter your real name" onChange={this._updateName} />
                <div className="splashButtons" >
                    <button onClick={this._handleSignUp} >sign up</button>
                    <button onClick={this._handleLogIn} >log in</button>
                </div>
            </div>
            )
    }
})


//Dash

var DashView = React.createClass ({

    componentWillMount: function() {
        var self = this
        this.props.user.on('sync',function() {self.forceUpdate()})
    },

    componentWillUnmount: function() {
        var self = this
        this.props.user.off('sync')
    },


    
    render:function(){

        
        return(

            <div id='dashView'>
                
                <img id='bgImg' src='http://bossfight.co/wp-content/uploads/2015/07/bossfight-stock-images-photos-photography-free-high-resolution-map-camera.jpg' />
                <div id='top'>
                    <image id='logo' src ='http://www.carfacbc.org/wp-content/uploads/2015/01/picture-perfect.png' type='png'/>
                    <NavBar user={this.props.user}/>
                </div>
                <div id='welcome'>
                <h1>Welcome, {this.props.user.attributes.name} </h1>
                </div>
              
                {this.props.viewType}
                <div id='logOut'>
                    <a href="#logout" >log out</a>
                </div>

            </div>
            
        )
    }
})


//Maps

        

var MapMakeRequest = React.createClass({


    componentWillMount:function(){

        var self = this

            GoogleMapsLoader.load(function(google) {


            
            var success= function(pos) {
               
                    var mapEl = document.querySelector('#map')
                    var crd = pos.coords;
                    var myLatLng = {lat:crd.latitude, lng: crd.longitude}

                     var options = {
                            center: myLatLng,
                            zoom: 18
                    }

                    var contentString = 
                        '<div id="content">'+
                            '<h5 id="firstHeading" class="firstHeading">Current Position</h5>'+
                            '<div id="bodyContent">'+
                                '<p>Click and drag your position to find where you want a picture taken</p>'+
                                '<p>Latitude:'+crd.latitude+' <br>Longitude:'+crd.longitude+'</p>'
                            '</div>'+
                        '</div>';

                    
               
                    var map = new google.maps.Map(mapEl, options);

                    

                       var marker = new google.maps.Marker({
                            position: myLatLng,
                            map: map,
                            title: 'Picture Here?',
                            draggable:true,
                        });

                        var infoWindow = new google.maps.InfoWindow({
                            content: contentString,
                          });

                        

                          marker.addListener('click', function() {
                            infoWindow.open(map, marker);
                          });

                        google.maps.event.addListener(marker, 'dragend', function(evt){
                            document.getElementById('drag').innerHTML = '<h1>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(5) + ' Current Lng: ' + evt.latLng.lng().toFixed(5) + '</h1>'
                            self.props.lat(evt.latLng.lat().toFixed(5))
                            self.props.lng(evt.latLng.lng().toFixed(5))

                        });


                        google.maps.event.addListener(marker, 'dragstart', function(evt){
                            document.getElementById('drag').innerHTML = '<h1>Currently dragging marker...</h1>';
                        });
                       
            }

            var error= function (err) {
                console.warn('ERROR(' + err.code + '): ' + err.message);
            };

            navigator.geolocation.getCurrentPosition(success, error)


   
    
            });
        },



    render:function(){
            
         
       
        return(
                <div id='map'>
            
                     <img src="http://i.giphy.com/xTk9ZvMnbIiIew7IpW.gif" />   
      
                </div>
            )
    }
 })

   

var GoogleMap = React.createClass({



    componentWillMount:function(){

        var self = this

            GoogleMapsLoader.load(function(google) {


            
                var success= function(pos) {
               

                    var mapEl = document.querySelector('#map')

                    var crd = pos.coords;
                    var myLatLng = {lat:crd.latitude, lng: crd.longitude}


                     var options = {
                            center: myLatLng,
                            zoom: 10
                    }


                    
               
                    var map = new google.maps.Map(mapEl, options);

                    var LocationsArray = function(data){
                        var outputArr = []
                        var locationObj = data.get('requestLocation')

                        for(var prop in locationObj){
                           var latLng =parseFloat(locationObj[prop])
                           
                           outputArr.push(latLng)

             

                        }
                        return outputArr
                    }

                    var markers = self.props.requestData.models.map(LocationsArray)


                    for(var i = 0; i < markers.length; i++ ) {
                            var newMarker = markers[i]
                          
                            var position = new google.maps.LatLng(markers[i][0], markers[i][1]);

                            markers[i][2]=i

                            var marker = new google.maps.Marker({
                                position: position,
                                map: map,
                                title: 'Picture Here?'
                            })

                        var infoWindow = new google.maps.InfoWindow({
                            content: 'holding...'
                          },i);

                        var content = '<div id="content">'+
                            '<h5 id="firstHeading" class="firstHeading">Request #'+(i+1)+'</h5></div>'


                        google.maps.event.addListener(marker, 'click', function (m) {
                        
                       
                              var latLong = {
                                lat: m.latLng.lat(),
                                lng: m.latLng.lng()
                            }

                            Backbone.Events.trigger("reqMarkerClick", latLong)

                          

                        });

                        google.maps.event.addListener(marker,'click', (function(marker,content,infoWindow,m){ 
                            return function() {

                                infoWindow.setContent(content);
                                infoWindow.open(map,marker);


                            };
                        })(marker,content,infoWindow)); 
                       

                    

                       
                    }
                            self.forceUpdate()
                }
                    


                       
            

                var error= function (err) {
                    console.warn('ERROR(' + err.code + '): ' + err.message)
                }

                navigator.geolocation.getCurrentPosition(success, error)


                
    
            })
    },


    render:function(){


        
        return(
            <div id="map">
                <img src="http://i.giphy.com/xTk9ZvMnbIiIew7IpW.gif" />   
            </div>
        )
    }
})



//Static stuff

var LogInHeader = React.createClass ({

    render:function(){

        return (
        <div id='logo'>

            <image src ='http://www.carfacbc.org/wp-content/uploads/2015/01/picture-perfect.png' type='png'/>

        </div>
        )
    }
})



var NavBar = React.createClass ({

    //<a href="#search">
                       // <li className="tabs">Search Around the World
                     //   </li>
                   // </a>


    render:function(){

        return (
       
                <div id='navigation'>
                    <ul>
                        <a href="#nearby">
                            <li className="tabs">Requests Near Me</li>
                        </a>

                        <a href="#makeRequest">
                            <li className="tabs">Make a Local Request
                            </li>
                        </a>

                       <a href="#pending">
                           <li className="tabs">Your Requests
                            </li>
                        </a>

                         <a href="#sent">
                            <li className="tabs">Images Sent
                            </li>
                        </a>

                        <a href="#images">
                            <li className="tabs">Images Received
                            </li>
                        </a>

                    </ul>

                </div>
                
           
        )
    }
})


//Views
var MakeRequestView = React.createClass ({
    requestLocation: '',
    descr: '',

    _setRequestLatitude: function(e) {
        this.requestLatitude = e
    },

    _setRequestLongitude: function(e) {
        this.requestLongitude = e
    },

    _setDescr: function(e) {
        this.descr = e.target.value
    },

    _hash:function(){
        location.hash = 'dash'
    },

    _submitRequest: function (){
        var self = this
        var location = {lat:self.requestLatitude, lng: self.requestLongitude}
        var uid = this.props.user.get('id')
        
        var request = new UserPersonalRequests(uid)
        var allRequest = new AllRequests ()

        var objToday = new Date(),
                weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
                dayOfWeek = weekday[objToday.getDay()],
                domEnder = new Array( 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th' ),
                dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder[objToday.getDate()] : objToday.getDate() + domEnder[parseFloat(("" + objToday.getDate()).substr(("" + objToday.getDate()).length - 1))],
                months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
                curMonth = months[objToday.getMonth()],
                curYear = objToday.getFullYear(),
                curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
                curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
                curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
                curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
            var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
   
        
        allRequest.create({
            content:self.descr,
            requestLocation:location,
            requestor_email: ref.getAuth().password.email,
            requestor_id: ref.getAuth().uid

        })

        request.create({
            content:self.descr,
            requestLocation:location,
            requestor_email: ref.getAuth().password.email,
            requestor_id: ref.getAuth().uid,
            time: today,

        })

        alert('Request made!')

    },

    render:function(){
        
        return (
        <div id='makeRequest'>
            
            <div className='text'>
                 <div id='drag'>
                    <h1> Drag the marker to the place you want a picture taken</h1><br/>
                 </div>
                <h1> Briefly describe what you want photographed </h1>

            </div>

            <MapMakeRequest lat={this._setRequestLatitude} lng={this._setRequestLongitude}/>

            <div id='descr'>
                
                <textarea id='descr' placeholder='Description' onChange={this._setDescr} />
                <button onClick={this._submitRequest}>Submit</button>
            </div>
            
        </div>
        
        )
    }
})

var NearbyView = React.createClass ({
    getInitialState: function(){
        return {
            currentlySelectedModel: {}
        }
    },
    
    componentWillMount: function() {
        var self = this
        this.props.allRequests.on('sync',function() {self.forceUpdate()})
        this.props.userInbox.on('sync',function() {self.forceUpdate()})

        Backbone.Events.on("reqMarkerClick", function(payload){
            console.log('...polo!', payload)
            var selectedModel = self.props.allRequests.find(function(req){
                var reqCoords = req.get('requestLocation')
                
                var modelCoords = ( parseInt(  (parseFloat(reqCoords.lat) + parseFloat(reqCoords.lng) ) * 10000000 ) )

                var selectedCoords = ( parseInt( (payload.lat + payload.lng) * 10000000 ) )
                
                console.log (selectedCoords, "----", modelCoords)
                return modelCoords ===  selectedCoords  
            })

            self.setState({
                currentlySelectedModel: selectedModel
            })


        })
        
    },

   componentWillUnmount: function(){
    Backbone.Events.off()
   },

   componentWillUnmount: function() {
        var self = this
        this.props.allRequests.off('sync')
        this.props.userInbox.off('sync')
    },

    _updater:function(){
        var self = this
        self.forceUpdate()
    },

    _changeImage:function(input){

        this.imagePreview=input
        this._updater()

    },

    _allRequestsComponents: function (requestObj,i){
        var isSelectedVal = false
        if( requestObj.id === this.state.currentlySelectedModel.id ){ 
            isSelectedVal = true 
            console.log('FROM <NearbyView> , isSelected', requestObj)
        }
        return <Request isSelected={isSelectedVal} changer={this._changeImage} update={this._updater} requestData={requestObj} userInbox={this.props.userInbox} key={i} keyNumber={i}/>
    },

    imagePreview:'',

    render:function(){

       
        
        return (
        <div id='nearbyView'>
            <div className='text'>
                <h1>These are all the requests in your area</h1>
            </div>
            <div>
           {this.imagePreview}
            </div>
            <div id='nearbyBot'>
                <GoogleMap requestData={this.props.allRequests} />
                <div className='list'>
                    {this.props.allRequests.map(this._allRequestsComponents)}
                </div>
            </div>

            
        </div>
        
        )
    }
})

var PendingView = React.createClass ({

    componentWillMount: function() {
        var self = this
        this.props.user.on('sync',function() {self.forceUpdate()})
    },

    componentWillUnmount: function() {
        var self = this
        this.props.user.off('sync')
    },


    _pendingRequestComponent:function(requestObj,i){
        var newArray=[]
        for(var prop in requestObj){
            var desiredObj=requestObj[prop]
            newArray.push(<UserRequests userRequestData={desiredObj} key={i} />)
        }
        return newArray

        

    },

    render:function(){
        return (
        <div id='pending'>
            <div className='text'>
                <h1>All the requests you are waiting for</h1>
            </div>
            {this._pendingRequestComponent(this.props.user.get('requests'))}
              
        </div>
        )
    }
})

var ImageView = React.createClass ({


    componentWillMount: function() {
        var self = this
        this.props.images.on('sync',function() {self.forceUpdate()})
    },

    componentWillUnmount: function() {
        var self = this
        this.props.images.off('sync')
    },


    _imageComponentsCreator:function(imageModelArray,i){

        return <ReceivedImage imageData={imageModelArray} key={i}/>


    },

    render:function(){
        
        return (
        <div id='image'>
            <div className='text'>
                <h1>View your requested pictures</h1>
            </div>
            {this.props.images.models.map(this._imageComponentsCreator)}
        </div>
        )
    }
})

var SentImagesView = React.createClass({

    componentWillMount: function() {
        var self = this
        this.props.images.on('sync',function() {self.forceUpdate()})
    },

    componentWillUnmount: function() {
        var self = this
        this.props.images.off('sync')
    },


    _imageComponentsCreator:function(imageModelArray,i){

        return <SentImage imageData={imageModelArray} key={i}/>


    },

    render:function(){
        
        return (
        <div id='image'>
            <div className='text'>
                <h1>View your requested pictures</h1>
            </div>
            {this.props.images.models.map(this._imageComponentsCreator)}
        </div>
        )
    }

})



//Sub-components
var UserRequests = React.createClass ({
    
    _removePost:function(){
        var messageId = this.props.userRequestData.id
        var uid = ref.getAuth().uid
        var userPost = new Firebase(`http://pictureperfect.firebaseio.com/users/${uid}/requests/${messageId}`)
        userPost.remove()
    },

    render:function(){
    
        return (
            <div className='userRequests'>
                <p>Picture Objective: {this.props.userRequestData.content}</p><br/>
                <p>Time Made: {this.props.userRequestData.time}</p>
                <button onClick={this._removePost}>Remove</button>
            
            </div>
        )
    }
})


var ReceivedImage = React.createClass ({

    _removePicture:function(){
        var messageId = this.props.imageData.id
        var uid = ref.getAuth().uid
        var receivedPic = new Firebase(`http://pictureperfect.firebaseio.com/users/${uid}/images/${messageId}`)
        receivedPic.remove()
    },

    render:function(){

        var containerStyle = {display: 'block'}
        var imgStyle = {display: 'block'}
        if (!this.props.imageData.get('sender_email')) imgStyle.display = "none"
        if (this.props.imageData.id === undefined) containerStyle.display = "none"

        return(
            <div style={containerStyle} className='images'>
                <p>From: {this.props.imageData.get('sender_email')}</p>
                <p>Sent: {this.props.imageData.get('time_sent')} </p>
                <img style={imgStyle} src={this.props.imageData.get('imageURL')} />
                <button onClick={this._removePicture}>Remove</button>
                
            </div>
        )
    }
})

var SentImage = React.createClass ({

    _removePicture:function(){
        var messageId = this.props.imageData.id
        var uid = ref.getAuth().uid
        var sentPic = new Firebase(`http://pictureperfect.firebaseio.com/users/${uid}/sentImages/${messageId}`)
        sentPic.remove()
    },

    render:function(){

        var containerStyle = {display: 'block'}
        var imgStyle = {display: 'block'}
        if (!this.props.imageData.get('receiver_email')) imgStyle.display = "none"
        if (this.props.imageData.id === undefined) containerStyle.display = "none"

        return(
            <div style={containerStyle} className='images'>
                <p>Sent To: {this.props.imageData.get('receiver_email')} </p>
                <p>Sent At: {this.props.imageData.get('time_sent')} </p>
                <img style={imgStyle} src={this.props.imageData.get('imageURL')} />
                <button onClick={this._removePicture}>Remove</button>
                
            </div>
        )
    }
})

var Request = React.createClass ({
    

    imageFile: '',

    _handleImageUpload: function(e) {
        var self=this
        var inputEl = e.target
        
        
        this.imageFile = inputEl.files[0] 
        var reader = new FileReader()
        reader.readAsDataURL(this.imageFile)

               
        reader.onload = function () {
            var base64string = reader.result 
            //self.props.changer(<img src={base64string} />)
            self.imagePreview=<img src={base64string} />
            self.forceUpdate()
           
        }
             
    },

     _submitImage: function (){
        var self = this
        var uid = this.props.requestData.get('requestor_id')
        var imageSend = new ReceivedImages(uid)
        var myUid = ref.getAuth().uid
        var myImageCopy = new SentImages(myUid)
        var messageId = this.props.requestData.get('id')
    
        var sendImage = function (imageString){

           var objToday = new Date(),
                weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
                dayOfWeek = weekday[objToday.getDay()],
                domEnder = new Array( 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th' ),
                dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder[objToday.getDate()] : objToday.getDate() + domEnder[parseFloat(("" + objToday.getDate()).substr(("" + objToday.getDate()).length - 1))],
                months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
                curMonth = months[objToday.getMonth()],
                curYear = objToday.getFullYear(),
                curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
                curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
                curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
                curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
            var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
      
            imageSend.create({
            imageURL:imageString,
            sender_email: ref.getAuth().password.email,
            sender_id: ref.getAuth().uid,
            time_sent: today


            })
            
        } 

        var saveImage = function (imageString){

           var objToday = new Date(),
                weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
                dayOfWeek = weekday[objToday.getDay()],
                domEnder = new Array( 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th' ),
                dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder[objToday.getDate()] : objToday.getDate() + domEnder[parseFloat(("" + objToday.getDate()).substr(("" + objToday.getDate()).length - 1))],
                months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
                curMonth = months[objToday.getMonth()],
                curYear = objToday.getFullYear(),
                curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
                curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
                curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
                curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
            var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
      
            myImageCopy.create({
            imageURL:imageString,
            receiver_email: self.props.requestData.get('requestor_email'),
            time_sent: today


            })
            
        } 
        

        if (this.imageFile) {
            var reader = new FileReader()
            reader.readAsDataURL(this.imageFile)
            reader.addEventListener('load', function() {
                var base64string = reader.result
                sendImage(base64string)
                var allMessage= new Firebase(`http://pictureperfect.firebaseio.com/allRequests/${messageId}`)
                allMessage.remove()
                
                saveImage(base64string)


                self.imagePreview=''

                
                self.props.update()
               

            })
           
        }


    },

    render:function(){
       
        
        return(
            <div className='nearbyRequest'>
                {this.props.isSelected ? <h3>Clicked Target!</h3> : ""}
                <div className='part1'>
                    <p>Request #{(this.props.keyNumber) +1}</p>
                    <p>User: {this.props.requestData.get('requestor_email')}
                    </p><br/>
                    <p>Picture Objective: {this.props.requestData.get('content')}</p>
                    <div>
                        <p>Picture Preview</p>
                        {this.imagePreview}
                    </div>
                </div>
                <div className='part2'>
                    <p>Image Upload</p>
                    <input type='file' onChange={this._handleImageUpload}/>
                    <button onClick={this._submitImage}>Submit Image</button>
                </div>
                
            </div>
        )

    }
})

//Router

function app() {

    // window.onhashchange = function(){window.location.reload()}
    // start app
    // new Router()
    var PPRouter = Backbone.Router.extend({
        routes: {
            'splash': "showSplashPage",
            'dash': "showDashboard",
            'logout': "doLogOut",
            'nearby': 'showNearbyRequests',
            'makeRequest': 'showMakeRequests',
            'pending': 'showPendingRequests',
            'images': 'showImageLibrary',
            'sent': 'showSentImages',
            '*default':'showSplashPage',
        },

        initialize: function() {
            this.ref = new Firebase('http://pictureperfect.firebaseio.com/')
            window.ref = this.ref

            this.on('route', function() {
                if (!this.ref.getAuth()) {
                    location.hash = "splash"
                }
            })
        },

        _updater: function(){
            var self = this
            self.forceUpdate()
        },

        doLogOut: function() {
            this.ref.unauth()
            location.hash = "splash"
        },

        showSplashPage: function() {

            DOM.render(<SplashPage logUserIn={this._logUserIn.bind(this)} createUser={this._createUser.bind(this)} />, document.querySelector('.container'))
        },

        showDashboard: function() {
            var uid = ref.getAuth().uid
            var user= new UserModel(uid)
        
            DOM.render(<DashView user={user} />,document.querySelector('.container'))
        },

        showNearbyRequests: function() {
            
            var uid = ref.getAuth().uid
            var user= new UserModel(uid)
            var allRequests= new AllRequests()
            allRequests.fetch()
            var userInbox = new UserPersonalRequests (uid)
            userInbox.fetch()
            var viewType = <NearbyView userInbox={userInbox} allRequests={allRequests} user={user} />
            DOM.render(<DashView viewType ={viewType} user={user} />,document.querySelector('.container'))
        },

        showMakeRequests: function() {
        
            var uid = ref.getAuth().uid
            var user= new UserModel(uid)  
            var viewType =  <MakeRequestView user={user} />
            DOM.render(<DashView viewType ={viewType} user={user} />,document.querySelector('.container'))
        },   

        showPendingRequests: function() {
            
            var uid = ref.getAuth().uid
            var user= new UserModel(uid)
            var viewType = <PendingView user={user} />
            DOM.render(<DashView viewType ={viewType} user={user} />,document.querySelector('.container'))
        },

        showImageLibrary: function() {
            
            var uid = ref.getAuth().uid
            var user= new UserModel(uid)
            var images = new ReceivedImages(uid)
            var viewType = <ImageView images={images}user={user} />
            DOM.render(<DashView viewType ={viewType} user={user} />,document.querySelector('.container'))
        },
        showSentImages:function(){

            var uid = ref.getAuth().uid
            var user= new UserModel(uid)
            var images = new SentImages(uid)
            var viewType = <SentImagesView images={images}user={user} />
            DOM.render(<DashView viewType ={viewType} user={user} />,document.querySelector('.container'))
        },

        // showSearch: function() {
        //     var uid = ref.getAuth().uid
        //     var user= new UserModel(uid)  
        //     var viewType =  <SearchView user={user} />
        //     DOM.render(<DashView viewType ={viewType} user={user} />,document.querySelector('.container'))
        // },


        _logUserIn: function(email,password){
        
            this.ref.authWithPassword({
                email: email,
                password: password
            }, function(err,authData) {
                if (err) console.log(err)
                else {
                    location.hash = "makeRequest"
                   
                }
              }
            )
        },


        _createUser: function(email,password,realName) {
        
            this.ref.createUser({
                email: email,
                password: password,
            },function(error,authData) {
                if (error) console.log(error)
                else {
                    var userMod = new UserModel(authData.uid)
                    userMod.set({
                    	name: realName,
                    	email:email,
                    	id:authData.uid
                    })
                       

                }
            })
        }
    })

    var pr = new PPRouter()
    Backbone.history.start()
}

app()