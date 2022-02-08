//import { StatusBar } from 'expo-status-bar';
import { styles } from './styles';
import { Text, View, StatusBar, Pressable, Alert, Button } from 'react-native';
import {useState, useEffect} from 'react';

import {CellClass} from './Classes'

function Cell(props) {
	return (
	<Pressable style={[props.style, {backgroundColor: props.color}]} onPress={props.onPress}>
		<Text style={styles.cellText}>{props.value}</Text>
	</Pressable>)
}

//generate the map - must be outside of the app func. so it is generated once
//create the map array
let valueMap = new Array(10);
for (let i = 0; i < 10; i++){
	valueMap[i] = new Array(10);
}

//making it global
let stats = {
	bombs: 0,
	hiddenCells: 0,
	totalCells: 0,
	lost: false,
	won: false,
	timerStopped: true
}

let interval;
let startingTime;

function initialize(){
	startingTime = Date.now();
	stats = {
		bombs: 0,
		hiddenCells: 0,
		totalCells: 0,
		lost: false,
		won: false,
		timerStopped: true
	}
		//define the bombs
	defineBombs(valueMap);
		//find the numbers corresponding to each and saving it into an array
	valueFinder(valueMap);
}

initialize();



//it isn't exactly as the one before class...
export default function App() {
	
	//const [rightMinTimer, setRightMinTimer] = useState(0);
	//const [leftMinTimer, setLeftMinTimer] = useState(0);
	//const [rightSecTimer, setRightSecTimer] = useState(0);
	//const [leftSecTimer, setLeftSecTimer] = useState(0);
	const [timer, setTimer] = useState('00:00');

	//total cells is as a hook even though it didn't need it to be since there is only one level. It never changes
	const [totalCells, setTotalCells] = useState(stats.totalCells);
	const [hiddenCells, setHiddenCells] = useState(stats.hiddenCells);
	const [bombs, setBombs] = useState(stats.bombs);

	let colorStateMap = new Array(10);
	let setColorStateMap = new Array(10);
	for (let i = 0; i < 10; i++){
		colorStateMap[i] = new Array(10);
		setColorStateMap[i] = new Array(10);
		for (let y = 0; y < 10; y++){
			[colorStateMap[i][y], setColorStateMap[i][y]] = useState('gray');//no value assigned
		}
	}
	let valueStateMap = new Array(10);
	let setValueStateMap = new Array(10);
	for (let i = 0; i < 10; i++){
		valueStateMap[i] = new Array(10);
		setValueStateMap[i] = new Array(10);
		for (let y = 0; y < 10; y++){
			[valueStateMap[i][y], setValueStateMap[i][y]] = useState('');//no value assigned
		}
	}

	/*function addSec(){
		if (rightSecTimer === 9){
			setRightSecTimer(0);
			if (leftSecTimer === 5){
				setLeftSecTimer(0);
				if (rightMinTimer === 9){
					setRightMinTimer(0);
					if (leftMinTimer === 5){
						setLeftMinTimer(0)
					}else {
						setLeftMinTimer(leftMinTimer + 1);
					}
				}else {
					setRightMinTimer(rightMinTimer + 1);
				}
			}else {
				setLeftSecTimer(leftSecTimer + 1);
			}
		}else {
			setRightSecTimer(rightSecTimer + 1);
		}
	}*/

	useEffect(() => {
		interval = setInterval(setCurrentTime, 1000);
	}, [])
	
	//get current time
	function setCurrentTime(){
		//we should look for a better alternative (clearInterval()?)
		if (!stats.timerStopped){
			let secs = Math.floor((Date.now() - startingTime)/1000 % 60);
			let secsString;
			let min = Math.floor((Date.now() - startingTime)/1000/60 % 60);
			let minString;
			if (secs < 10)
			{
				secsString = '0' + secs;
			}else{
				secsString = secs.toString();
			}
			if (min < 10){
				minString = '0' + min;
			}else {
				minString = min.toString();
			}
			setTimer(minString + ":" + secsString);
			//setTimer(Math.floor((Date.now() - startingTime)/1000)%60);
		}
	}
	//game logic
	function mainPopper(x, y){
		if (!stats.lost && !stats.won){
			//start timer
			if (stats.timerStopped){
				stats.timerStopped = false;
				startingTime = Date.now();
			}
			let res = valueMap[x][y].pop(valueMap, [10, 10], setColorStateMap, setValueStateMap);
			if (res == -1){
				Alert.alert('You lost', 'A bomb exploded');
				stats.lost = true;
				stats.timerStopped = true;
			}else {
				if (hiddenCells - res === 0){
					stats.timerStopped = true;
					stats.won = true;
					Alert.alert('You won!', 'You were able to clear all the cells in ' + timer + ' minutes!')
				}
				setHiddenCells(hiddenCells - res);
			}
		}else if(stats.lost) {
			Alert.alert('YOU ALREADY LOST', 'Please restart the game in order to play');
		}else if (stats.won) {
			Alert.alert('YOU ALREADY WON', 'You were able to clear all the cells in ' + timer + ' minutes!');
		}
	}
	const generateMapElements = () => {
		let dataToReturn = [];
		//loading the data of the map into elements and returning the elements
			//before coming here, the full map must have been already defined
		for(let x = 0; x < 10; x++){
			for(let y = 0; y < 10; y++){
				dataToReturn.push(<Cell onPress={() => mainPopper(x, y)} size={15} color={colorStateMap[x][y]} value={valueStateMap[x][y]} style={styles.cell} key={x + ', ' + y}/>);
				//dataToReturn.push(<Cell size={15} color='white' value={valueMap[x][y]} style={styles.cell} key={x + ', ' + y}/>);
			}
		}
		//too many re-renders with the following code:
		//setStateMap[1][1](valueMap[1][1]);
		return (dataToReturn);
	}

	//ui logic
	const restart = () => {
		/*setLeftSecTimer(0);
		setRightSecTimer(0);
		setLeftMinTimer(0);
		setRightMinTimer(0);
		clearInterval(interval);
		interval = setInterval(addSec, 100);*/
		initialize();
		setTotalCells(stats.totalCells);
		setHiddenCells(stats.hiddenCells);
		setBombs(stats.bombs);
		setTimer('00:00')
		for (let i = 0; i < 10; i++){
			for (let y = 0; y < 10; y++){
				setColorStateMap[i][y]('gray');//no value assigned
				setValueStateMap[i][y]('');//no value assigned
			}
		}
	}

	return (
    <View style={styles.container}>
		<View style={styles.headerView}><Text style={styles.title}>DAVID'S MINESWEEPER</Text></View>
		<View style={styles.scoreView}>
			<View style={styles.scoreView2}>
				<Text style={styles.title}>Total Cells: {totalCells}</Text>
				<Text style={styles.title}>Hidden Cells: {hiddenCells}</Text>
				<Text style={styles.title}>Bombs: {bombs}</Text>
			</View>
			<View style={styles.scoreView2}>
				<Text style={styles.title}>{timer}</Text>
			</View>
		</View>
		<View style={styles.mapView}>
			{
				generateMapElements()
			}
		</View>
		<View style={[styles.infoView, {justifyContent: 'center'}]}><Button title="Restart" onPress={() => restart()}/></View>
      <StatusBar style="auto" />
    </View>
  );
}

//find the numbers corresponding to each and saving it into an array
function valueFinder(valueMap) {
	let bombCounter;
	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
			//if it is a bomb, whe should not check it
			if (valueMap[x][y].value != -1) {
				bombCounter = 0;
				for (let x_add = -1; x_add < 2; x_add++) {
					for (let y_add = -1; y_add < 2; y_add++) {
						//check that it is within the map bounds
						if (x_add + x < 10 && y_add + y < 10 && x_add + x >= 0 && y_add + y >= 0) {
							//add to bombCounter if it is a bomb
							if (valueMap[x + x_add][y + y_add].value === -1)
								bombCounter++;
						}
					}
				}
				valueMap[x][y].value = bombCounter;
			}
		}
	}
}

//define the bombs
function defineBombs(valueMap) {
	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
			if (Math.random() < 0.2) {
				stats.bombs++;
				valueMap[x][y] = new CellClass(-1, x, y);
				//valueMap[x][y] = -1;
			} else {
				stats.hiddenCells++;
				valueMap[x][y] = new CellClass(1, x, y);
				//not necesary
				//valueMap[x][y] = 0;
			}
			stats.totalCells++;
		}
	}
}

