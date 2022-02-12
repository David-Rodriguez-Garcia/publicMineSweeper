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

let valueMap = new Array(10);
for (let i = 0; i < 10; i++){
	valueMap[i] = new Array(10);
}

let stats = {
	bombs: 0,
	hiddenCells: 0,
	totalCells: 0,
	lost: false,
	won: false,
	timerStopped: true
}

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
	defineBombs(valueMap);
	valueFinder(valueMap);
}

initialize();



export default function App() {
	
	const [timer, setTimer] = useState('00:00');

	const [totalCells, setTotalCells] = useState(stats.totalCells);
	const [hiddenCells, setHiddenCells] = useState(stats.hiddenCells);
	const [bombs, setBombs] = useState(stats.bombs);

	let colorStateMap = new Array(10);
	let setColorStateMap = new Array(10);
	for (let i = 0; i < 10; i++){
		colorStateMap[i] = new Array(10);
		setColorStateMap[i] = new Array(10);
		for (let y = 0; y < 10; y++){
			[colorStateMap[i][y], setColorStateMap[i][y]] = useState('gray');
		}
	}
	let valueStateMap = new Array(10);
	let setValueStateMap = new Array(10);
	for (let i = 0; i < 10; i++){
		valueStateMap[i] = new Array(10);
		setValueStateMap[i] = new Array(10);
		for (let y = 0; y < 10; y++){
			[valueStateMap[i][y], setValueStateMap[i][y]] = useState('');
		}
	}

	useEffect(() => {
		interval = setInterval(setCurrentTime, 1000);
	}, [])
	
	function setCurrentTime(){
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
		}
	}

	function mainPopper(x, y){
		if (!stats.lost && !stats.won){
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

		for(let x = 0; x < 10; x++){
			for(let y = 0; y < 10; y++){
				dataToReturn.push(<Cell onPress={() => mainPopper(x, y)} size={15} color={colorStateMap[x][y]} value={valueStateMap[x][y]} style={styles.cell} key={x + ', ' + y}/>);
			}
		}
		return (dataToReturn);
	}

	const restart = () => {
		initialize();
		setTotalCells(stats.totalCells);
		setHiddenCells(stats.hiddenCells);
		setBombs(stats.bombs);
		setTimer('00:00')
		for (let i = 0; i < 10; i++){
			for (let y = 0; y < 10; y++){
				setColorStateMap[i][y]('gray');
				setValueStateMap[i][y]('');
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

function valueFinder(valueMap) {
	let bombCounter;
	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
			if (valueMap[x][y].value != -1) {
				bombCounter = 0;
				for (let x_add = -1; x_add < 2; x_add++) {
					for (let y_add = -1; y_add < 2; y_add++) {
						if (x_add + x < 10 && y_add + y < 10 && x_add + x >= 0 && y_add + y >= 0) {
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

function defineBombs(valueMap) {
	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
			if (Math.random() < 0.2) {
				stats.bombs++;
				valueMap[x][y] = new CellClass(-1, x, y);
			} else {
				stats.hiddenCells++;
				valueMap[x][y] = new CellClass(1, x, y);
			}
			stats.totalCells++;
		}
	}
}

