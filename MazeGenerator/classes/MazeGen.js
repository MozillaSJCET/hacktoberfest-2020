import SeedRandom from 'seedrandom';

export default class MazeGen {

    constructor(data) {
        this.pathWidth = data.pathWidth || 10;       //Width of the Maze Path
        //this.pathWidth = 10;       //Width of the Maze Path
        this.wall = data.wall || 2;             //Width of the Walls between Paths
        //this.wall = 2;             //Width of the Walls between Paths
        this.outerWall = data.outerWall || 2;        //Width of the Outer most wall
        //this.outerWall = 2;        //Width of the Outer most wall
        this.width = data.width || 25;           //Number paths fitted horisontally
        //this.width = 25;           //Number paths fitted horisontally
        this.height = data.height || 25;          //Number paths fitted vertically
        //this.height = 25;          //Number paths fitted vertically
        this.x = this.width / 2 | 0;        //Horisontal starting position
        this.y = this.height / 2 | 0;       //Vertical starting position
        this.seed = data.seed || '1';//Seed for random numbers
        //this.seed = '1';//Seed for random numbers
        this.wallColor = data.wallColor || '#000';   //Color of the walls
        //this.wallColor = '#fff';   //Color of the walls
        this.pathColor = data.pathColor || '#fff';//Color of the path
        //this.pathColor = '#000';//Color of the path
        //this.route = null;
        this.seedRand = new SeedRandom(this.seed);
        this.delay = 10;
        this.timer = null;
        this.init();
    }

    init() {
        this.offset = this.pathWidth / 2 + this.outerWall;
        this.map = [];

        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id", "maze");
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.outerWall * 2 + this.width * (this.pathWidth + this.wall) - this.wall;
        this.canvas.height = this.outerWall * 2 + this.height * (this.pathWidth + this.wall) - this.wall;
        this.ctx.fillStyle = this.wallColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = this.pathColor;
        this.ctx.lineCap = 'square';
        this.ctx.lineWidth = this.pathWidth;
        this.ctx.beginPath();
        for (var i = 0; i < this.height * 2; i++) {
            this.map[i] = [];
            for (var j = 0; j < this.width * 2; j++) {
                this.map[i][j] = false;
            }
        }
        this.map[this.y * 2][this.x * 2] = true;
        this.route = [[this.x, this.y]];
        this.ctx.moveTo(this.x * (this.pathWidth + this.wall) + this.offset, this.y * (this.pathWidth + this.wall) + this.offset);
        this.generate();
    }

    generate() {

        let x = this.route[this.route.length - 1][0] | 0;
        let y = this.route[this.route.length - 1][1] | 0;

        let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        let alternatives = [];

        for (var i = 0; i < directions.length; i++) {
            if (this.map[(directions[i][1] + y) * 2] != undefined && this.map[(directions[i][1] + y) * 2][(directions[i][0] + x) * 2] === false) {
                alternatives.push(directions[i]);
            }
        }

        if (alternatives.length === 0) {
            this.route.pop();
            if (this.route.length > 0) {
                this.ctx.moveTo(this.route[this.route.length - 1][0] * (this.pathWidth + this.wall) + this.offset, this.route[this.route.length - 1][1] * (this.pathWidth + this.wall) + this.offset);
                this.generate();
            }
            return;
        }
        let direction = alternatives[this.seedRand() * alternatives.length | 0];
        this.route.push([direction[0] + x, direction[1] + y]);
        this.ctx.lineTo((direction[0] + x) * (this.pathWidth + this.wall) + this.offset, (direction[1] + y) * (this.pathWidth + this.wall) + this.offset);
        this.map[(direction[1] + y) * 2][(direction[0] + x) * 2] = true;
        this.map[direction[1] + y * 2][direction[0] + x * 2] = true;
        this.ctx.stroke();
        
        if (this.route.length > 0 ) this.generate();
    }

    getDataURL(){
        return this.canvas.toDataURL();
    }
}
