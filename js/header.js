import DOM from 'react-dom'
import React, {Component} from 'react'

import DashView from './dashView'
import Header from './header'
import NearbyView from './nearbyView'
import MakeRequestView from './makeRequestView'
import PendingView from './pendingView'
import ImageView from './imageView'

var Header = React.createClass ({

	render:function(){
		return (
		<div id='logo'>
			<image src ='http://www.carfacbc.org/wp-content/uploads/2015/01/picture-perfect.png' type='png'/>

		</div>
		)
	}
})



export default Header