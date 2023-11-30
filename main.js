import './style.css'
import Phaser from 'phaser'


//global variables
const sizes={
    width:960,
    height:540
};
const speedDown = 450;


//GET HTML TAGS and functionalities
const gameStartDiv = document.querySelector("#gameStartDiv");
const gameStartBtn = document.querySelector("#gameStartBtn");
const gameEndDiv = document.querySelector("#gameEndDiv");
const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan");
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan");
gameStartBtn.addEventListener("click", () => {
    gameStartDiv.style.display = "none";
    game.scene.resume("scene-game");
})


//class game scene from phaser game engine
class GameScene extends Phaser.Scene{
    constructor(){
        super("scene-game");


        //player stuff
        this.player;
        this.cursor;
        this.playerSpeed = speedDown + 50;


        //enemy stuff
        this.target;


        //gameplay stuff
        this.points = 0;
        this.life = 100;
        this.textScore;
        this.textTime;
        this.timedEvent;
        this.remainingTime;
        this.bgMusic;
        this.explosion;
        this.explosionEmitter
    };


    //upload assets
    preload(){

        //images
        this.load.image("bg", "/assets/bg.png");
        this.load.image("player", "/assets/player.png");
        this.load.image("astheroid", "/assets/astheroid.png");
        this.load.image("explosionEmitter", "/assets/explosionEmitter.png")


        //audio
        this.load.audio("explosion", "/assets/explosion.mp3");
        this.load.audio("bgMusic", "/assets/bgMusic.mp3");
    };


    //on begin play do all this
    create(){

        //start game paused (to show menu)
        this.scene.pause("scene-game")


        //sounds
        this.explosion = this.sound.add("explosion");
        this.bgMusic = this.sound.add("bgMusic");
        //this.bgMusic.play();
        //this.bgMusic.stop();


        //background image
        this.add.image(0,0,"bg").setOrigin(0,0);


        //player
        this.player = this.physics.add.image(0,sizes.height-100,"player").setOrigin(0,0);
        this.player.setScale(0.1);
        this.player.setImmovable(true);
        this.player.body.allowGravity = false;
        this.player.setCollideWorldBounds(true);
        this.player.setSize(800,950).setOffset(90,0);


        //astheroid
        this.target = this.physics.add.image(0, 0, "astheroid").setOrigin(0, 0);
        this.target.setScale(0.1);
        this.target.setMaxVelocity(0, speedDown);


        //call functions into library
        this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)
        this.cursor=this.input.keyboard.createCursorKeys();


        //text stuff
        this.textScore = this.add.text(sizes.width -120, 200,"Score:0", {
            font: "25px Arial",
            fill: "#000000",
        });
        this.textTime = this.add.text(sizes.width -250, 230,"Time:0", {
            font: "25px Arial",
            fill: "#000000",
        });


        //defines a timer to a variable
        this.timedEvent = this.time.delayedCall(30000, this.gameOver,[], this)


        //definition and settings for emitter
        this.explosionEmitter=this.add.particles(0,0,"explosionEmitter", {
            speed:100,
            gravityY:speedDown-200,
            scale:0.1,
            duration:100,
            emitting:false
        })
        this.explosionEmitter.setScale(0.4);
        this.explosionEmitter.startFollow(this.target, this.target.width / 2, this.target.height / 2,
        true);
    };


    //event tick, while game is running, keep doing all this inside
    update(){


        //get the timer information and attribute to a variable and updates the screen text
        this.remainingTime=this.timedEvent.getRemainingSeconds();
        this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`)


        //When the object reach the bottom of screen realocates to Top (Y) with X (horizontal) in a random value between specified number
        if (this.target.y >= sizes.height) {
            this.target.setY(0);
            this.target.setX(Math.floor(Math.random() * 950));
        };


        //control movement direction by assigning values to X and Y axis 
        const { up, down, left, right } = this.cursor;
        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        }else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
        }else if (down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
        }else if (up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
        }else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        };
    };


    //Function to deal with collision settings for an object
    targetHit() {
        this.target.setY(0); //makes it go back to Y 0;
        this.target.setX(Math.floor(Math.random() * 950)); //set a random X location between the calculation of a specified number;
        this.explosionEmitter.start(); //calls emitter variable to scene (not playing yet);
        this.explosion.play(); //calls emitter function to render in screen;
        this.points++; //add points when this collision happens;
        this.textScore.setText(`Score: ${this.points}`); //Set text for Score text screen object;
    };


    //Game Over Function
    gameOver(){
        this.sys.game.destroy(true)
        gameEndScoreSpan.textContent = this.points;
        gameWinLoseSpan.textContent = "Your Score"

        gameEndDiv.style.display="flex"
    };
}


//config and start phaser game instance
const config = {
    type:Phaser.WEBGL,
    width:sizes.width,
    height:sizes.height,
    canvas:gameCanvas,
    physics:{
        default:"arcade",
        arcade:{
            gravity:{y:speedDown},
            debug:true
        }
    },
    scene:[GameScene]
};
const game = new Phaser.Game(config);
