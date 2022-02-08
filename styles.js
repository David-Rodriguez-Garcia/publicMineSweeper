import {StyleSheet, Dimensions} from 'react-native';

const screenH = Dimensions.get('window').height;
const screenW = Dimensions.get('window').width;

const styles = StyleSheet.create({
	container: {
	  height: screenH,
	  width: screenW,
	  backgroundColor: '#fff',//white
	  alignItems: 'center',
	  justifyContent: 'flex-start',
	},
	//header
	headerView: {
	  height: screenH * 0.1,
	  backgroundColor: 'black',
	  width: screenW,
	  justifyContent: 'center',
	  alignItems: 'center',
	  borderBottomColor: 'white',
	  borderBottomWidth: 3
	},
	title: {
	  fontSize: 24,
	  fontWeight: 'bold',
	  color: 'white',
	},
	//score
	scoreView: {
	  height: screenH * 0.2,
	  backgroundColor: 'black',
	  width: screenW,

	  //pre-double view
	  //justifyContent: 'center',
	  //alignItems: 'flex-start'
	  flexDirection: 'row',
	},
	scoreView2: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,

	},
	//map
	mapView: {
	  height: screenH * 0.6,
	  width: screenW,
	  backgroundColor: 'red',
	  flexDirection: 'row',
	  flexWrap: 'wrap',
	},
	cell: {
		height: (screenH * 0.6)/10,
		width: screenW/10,
		borderWidth: 2,
		borderColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',

	},
	cellText: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 20,
	},
	//info
	infoView: {
	  height: screenH * 0.1,
	  backgroundColor: 'black',
	  width: screenW,
	},
  
  });

module.exports = {styles};