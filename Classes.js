class CellClass {
	constructor (value, x, y) {
		this.found = false;
		this.value = value;
		this.x = x;
		this.y = y;
	}
	//map of Cell classes[][], table size[x, y]
	pop (objectsMap, t_size, setColorStateMap, setValueStateMap){
		let count = 0;
		if (!this.found){
			this.found = true;
			this.showVal(setColorStateMap, setValueStateMap);
			if (this.value == -1){
				//endgame
				return (-1);
			}else {
				if (this.value == 0){
					for (let x = -1; x < 2; x++){
						if (x + this.x < t_size[0] && x + this.x >= 0){
							for (let y = -1; y < 2; y++){
								if (y + this.y < t_size[1] && y + this.y >= 0){
									count += objectsMap[x + this.x][y + this.y].pop(objectsMap, t_size, setColorStateMap, setValueStateMap);
								}
							}
						}
					}
				}
			}
			return (count + 1);
		}
		return (0);
	}

	showVal(setColorStateMap, setValueStateMap){
		switch (this.value){
			case -1:
				setValueStateMap[this.x][this.y]('X');
				setColorStateMap[this.x][this.y]('red');
				break;
			case 0:
				setColorStateMap[this.x][this.y]('white');
				break;
			case 1:
				setValueStateMap[this.x][this.y]('1');
				setColorStateMap[this.x][this.y]('white');
				break;
			case 2:
				setValueStateMap[this.x][this.y]('2');
				setColorStateMap[this.x][this.y]('white');
				break;
			case 3:
				setValueStateMap[this.x][this.y]('3');
				setColorStateMap[this.x][this.y]('white');
				break;
			case 4:
				setValueStateMap[this.x][this.y]('4');
				setColorStateMap[this.x][this.y]('white');
				break;
			case 5:
				setValueStateMap[this.x][this.y]('5');
				setColorStateMap[this.x][this.y]('white');
				break;
			case 6:
				setValueStateMap[this.x][this.y]('6');
				setColorStateMap[this.x][this.y]('white');
				break;
			case 7:
				setValueStateMap[this.x][this.y]('7');
				setColorStateMap[this.x][this.y]('white');
				break;
			case 8:
				setValueStateMap[this.x][this.y]('8');
				setColorStateMap[this.x][this.y]('white');
				break;			
		}
	}
}

module.exports = {CellClass}