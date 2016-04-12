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

var FulfilledImages = Backbone.Firebase.Collection.extend({
    initialize: function(uid) {
        this.url = `http://pictureperfect.firebaseio.com/users/${uid}/images`
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
                <LogInHeader />
                <h1>Your access to all the places you aren't currently at</h1>
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
    
    render:function(){
        

        return(

            <div id='dashView'> 
                <DashHeader user={this.props.user}/>
                <NavBar />
                {this.props.viewType}
                <a href="#logout" >log out</a>
            </div>
            
        )
    }
})

var MapMakeRequest = React.createClass({

    render:function(){

        var self = this
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
                        title: 'Picture Here?',
                        draggable:true,
                    });

                    google.maps.event.addListener(marker, 'dragend', function(evt){
                    document.getElementById('drag').innerHTML = '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(5) + ' Current Lng: ' + evt.latLng.lng().toFixed(5) + '</p>'
                    self.props.lat(evt.latLng.lat().toFixed(5))
                    self.props.lng(evt.latLng.lng().toFixed(5))

                    });

                    google.maps.event.addListener(marker, 'dragstart', function(evt){
                        document.getElementById('drag').innerHTML = '<p>Currently dragging marker...</p>';
                    });

                    marker.addListener('click', function() {infowindow.open(map, marker);});
                    self.forceUpdate()
            }

            var error= function (err) {
                console.warn('ERROR(' + err.code + '): ' + err.message);
            };

            navigator.geolocation.getCurrentPosition(success, error)

        }

        return(
            <div id="map">
                 <img src="http://img.ffffound.com/static-data/assets/6/f71fbabb835aebca4489ba2e0d5cd6aff3ad528c_m.gif" />   
            </div>
        )
    }
})

var GoogleMap = React.createClass({


    render:function(){

        var self = this

        window.initMap = function(){


            var success= function(pos) {
                var crd = pos.coords;
                var myLatLng = {lat:crd.latitude, lng: crd.longitude}

                var map = new google.maps.Map(document.getElementById('map'), {
                    center: myLatLng,
                    zoom: 10
                });

                var contentString = 
                    '<div id="content">'+
                        '<h5 id="firstHeading" class="firstHeading">Current Position</h5>'+
                        '<div id="bodyContent">'+
                            '<p>Click and drag your position to find where you want a picture taken</p>'+
                            '<p>Latitude:'+crd.latitude+' <br>Longitude:'+crd.longitude+'</p>'
                      '</div>'+
                    '</div>';

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
                //WORK FROM HERE----MARKERS ARRAY-->
                console.log(markers)
                
                var infoWindow = new google.maps.InfoWindow(), marker, i;

                  for(var i = 0; i < markers.length; i++ ) {
                        console.log(markers[i][0])
                        var position = new google.maps.LatLng(markers[i][0], markers[i][1]);

                        var marker = new google.maps.Marker({
                            position: position,
                            map: map,
                            title: 'Picture Here?'
                        })

                        marker.addListener('click', function() {infowindow.open(map, marker)});
                    }
                console.log('GREAT SUCCESS!')
                console.log(self)
                self.forceUpdate()
            }
        
            

            var error= function (err) {
                console.warn('ERROR(' + err.code + '): ' + err.message);
            };

            navigator.geolocation.getCurrentPosition(success, error)


        }
        return(
            <div id="map">
                <img src="http://img.ffffound.com/static-data/assets/6/f71fbabb835aebca4489ba2e0d5cd6aff3ad528c_m.gif" />   
            </div>
        )
    }
})

var LogInHeader = React.createClass ({

    render:function(){

        return (
        <div id='logo'>

            <image src ='http://www.carfacbc.org/wp-content/uploads/2015/01/picture-perfect.png' type='png'/>

        </div>
        )
    }
})

var DashHeader = React.createClass ({

    componentWillMount: function() {
        var self = this
        this.props.user.on('sync',function() {self.forceUpdate()})
    },

    componentWillUnmount: function() {
        var self = this
        this.props.user.off('sync')
    },

    render:function(){

        return (
        <div id='logo'>

            <image src ='http://www.carfacbc.org/wp-content/uploads/2015/01/picture-perfect.png' type='png'/>
            <h1>Welcome, {this.props.user.attributes.name} </h1>
        

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
            requestor_id: ref.getAuth().uid

        })

        self._hash()

    },

    render:function(){
        
        return (
        <div id='makeRequest'>
            <div id='drag'></div>
            <h1> Drag the marker to the place you want a picture taken </h1>
            <MapMakeRequest lat={this._setRequestLatitude} lng={this._setRequestLongitude}/>
            <p>What you need a picture of?</p>
            <textarea id='descr' placeholder='Description' onChange={this._setDescr} />
            <button onClick={this._submitRequest}>Submit</button>
            
        </div>
        
        )
    }
})

var NearbyView = React.createClass ({
    
    componentWillMount: function() {
        var self = this
        this.props.allRequests.on('sync',function() {self.forceUpdate()})
        this.props.userInbox.on('sync',function() {self.forceUpdate()})
    },

   componentWillUnmount: function() {
        var self = this
        this.props.allRequests.off('sync')
        this.props.userInbox.off('sync')
    },

    _updater:function(){
        this.forceUpdate()
    },

    _allRequestsComponents: function (requestObj,i){
        return <Request update={this.updater} requestData={requestObj} userInbox={this.props.userInbox} key={i}/>

    },

    render:function(){
        
        return (
        <div id='nearbyView'>
            <h1>These are all the requests in your area
            </h1>
            <GoogleMap requestData={this.props.allRequests} />
            {this.props.allRequests.map(this._allRequestsComponents)}
            
        </div>
        
        )
    }
})

var Request = React.createClass ({

    imageFile: '',

    _handleImageUpload: function(e) {
        var inputEl = e.target
        this.imageFile = inputEl.files[0]        
    },

     _submitImage: function (){
        var self = this
        var uid = this.props.requestData.get('requestor_id')
        var imageSend = new FulfilledImages(uid)
        var messageId = this.props.requestData.get('id')
        var messageLocation = this.props.requestData.get('requestLocation')
        var inboxArray = this.props.userInbox.models
        console.log(inboxArray)
        console.log(messageId)
        console.log(messageLocation)

        var identifyInboxRequest= function (arrayofrequests){
            var newStr = ''
            arrayofrequests.forEach(function(el){
                var location= el.get('requestLocation')
                console.log(location)
                console.log(messageLocation)
                if(messageLocation.lat === location.lat){
                    console.log(el.get('id'))
                    newStr += el.get('id') 
                }
                
                
            })

            console.log (newStr)
            return newStr
              
            
        }

        identifyInboxRequest(inboxArray)

        var sendImage = function (imageString){

            imageSend.create({
            imageURL:imageString,
            sender_email: ref.getAuth().password.email,
            sender_id: ref.getAuth().uid


            })
            
        } 

        

        if (this.imageFile) {
            var reader = new FileReader()
            reader.readAsDataURL(this.imageFile)
            reader.addEventListener('load', function() {
                var base64string = reader.result
                sendImage(base64string)
                var allMessage= new Firebase(`http://pictureperfect.firebaseio.com/allRequests/${messageId}`)
                var userMessage= new Firebase(`http://pictureperfect.firebaseio.com/users/${uid}/requests/${inboxId}`)
                allMessage.remove()

                userMessage.remove()

            })
           
        }


    },

    render:function(){
        
        return(
            <div className='nearbyRequest'>
                <div className='part1'>
                    <p>User: {this.props.requestData.get('requestor_email')}
                    </p><br/>
                    <p>Latitude: {this.props.requestData.get('requestLocation').lat}</p><br/>
                    <p>Longitude: {this.props.requestData.get('requestLocation').lng} </p><br/>
                    <p>Picture Objective: {this.props.requestData.get('content')}</p>
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
            <h1>All the requests you are waiting for</h1>
            {this._pendingRequestComponent(this.props.user.get('requests'))}
              
        </div>
        )
    }
})

var UserRequests = React.createClass ({
    render:function(){
  
        return (
            <div className='userRequests'>
                <p>Latitude: {this.props.userRequestData.requestLocation.lat}</p><br/>
                <p>Longitude: {this.props.userRequestData.requestLocation.lng} </p><br/>
                <p>Picture Objective: {this.props.userRequestData.content}
                </p><br/>
            
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

        return <Image imageData={imageModelArray} key={i}/>


    },

    render:function(){
        
        return (
        <div id='image'>
            <h1>View your requested pictures</h1>
            {this.props.images.models.map(this._imageComponentsCreator)}
        </div>
        )
    }
})

var Image = React.createClass ({

    render:function(){

        var containerStyle = {display: 'block'}
        var imgStyle = {display: 'block'}
        if (!this.props.imageData.get('sender_email')) imgStyle.display = "none"
        if (this.props.imageData.id === undefined) containerStyle.display = "none"

        return(
            <div style={containerStyle} className='images'>
                <p>From: {this.props.imageData.get('sender_email')}</p>
                <img style={imgStyle} src={this.props.imageData.get('imageURL')} />
                
            </div>
        )
    }
})


function app() {
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
            'images': 'showImageLibrary'
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
            var images = new FulfilledImages(uid)
            var viewType = <ImageView images={images}user={user} />
            DOM.render(<DashView viewType ={viewType} user={user} />,document.querySelector('.container'))
        },

        _logUserIn: function(email,password){
        
            this.ref.authWithPassword({
                email: email,
                password: password
            }, function(err,authData) {
                if (err) console.log(err)
                else {
                    location.hash = "dash"
                   
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