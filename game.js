let game;

// game configuration
window.onload = function () {
  const gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0xb7cc1c,
    parent: "game",
    scale: {
      // mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 900,
      height: 500,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: 400,
        },
        debug: true,
      },
    },
    // 5 DIFFERENT SCENES
    scene: [
      // GameIntro,
      GamePlay,
      // GameOver,
      // GameWin,
      // GameHud,
    ],
  };
  // new game bruh
  game = new Phaser.Game(gameConfig);
  window.focus();
};

var tokenGreenOverlay;
var tokenYellowOverlay;
var tokenRedOverlay;
var tokenGreenTabGroup;
var tokenYellowTabGroup;
var tokenRedTabGroup;
var completedGreenMission = false;
var completedYellowMission = false;
var completedRedMission = false;

// GLOBAL GAME VARIABLES
let kiwiTool1Count = 0;

/* ======================
    GAME INTRO SCENE
=========================*/
class GameIntro extends Phaser.Scene {
  constructor() {
    super("game-intro");
  }
  // preloads for the intro scene
  preload() {
    this.load.image(
      "platform",
      "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fground_grass.png?v=1603601137907"
    );
    // this.load.image("background", "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fbg_layer1.png?v=1603601139028");
    this.load.image(
      "touchSides",
      "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Ftouch-sides.png?v=1603601138715"
    );
    this.load.image(
      "kowhaiwhai",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fkowhaiwhai.png?v=1609829230478"
    );
    this.load.image(
      "platformer-instructions",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fplatformer-instructions.png?v=1615280452997"
    );

    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );
  }
  // create for the intro scene
  create() {
    // background layers
    // this.add.image(240, 320, "background").setScrollFactor(1, 0);
    this.add.image(240, 320, "Layer 5").setScrollFactor(1, 0);
    this.add.image(240, 320, "Layer 4").setScrollFactor(1, 0);
    this.add.image(240, 320, "Layer 3").setScrollFactor(1, 0);
    this.add.image(240, 320, "Layer 2").setScrollFactor(1, 0);
    this.add.image(240, 320, "Layer 1").setScrollFactor(1, 0);

    // kowhaiwhai pattern
    this.add
      .tileSprite(
        game.config.width / 2,
        game.config.height / 2 + 500,
        game.config.width,
        3000,
        "kowhaiwhai"
      )
      .setScrollFactor(0, 0.25)
      .setAlpha(0.2)
      .setScale(1);

    // dialog ONE (Using rexUI)
    this.dialog1 = this.rexUI.add
      .dialog({
        x: game.config.width / 2,
        y: game.config.height / 2,
        width: 500,
        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x533d8e),
        content: this.createLabel(
          this,
          "Find the keys to help unlock\nTāne's Action step tokens",
          50,
          50
        ),
        description: this.add.image(0, 0, "platformer-instructions"),
        actions: [this.createLabel(this, "NEXT", 10, 10)],
        space: {
          left: 20,
          right: 20,
          top: 50,
          bottom: 20,
          content: 20,
          toolbarItem: 5,
          choice: 15,
          action: 15,
        },
        align: {
          center: "center",
          actions: "right", // 'center'|'left'|'right'
        },
        click: {
          mode: "release",
        },
      })
      .layout()
      // .drawBounds(this.add.graphics(), 0xff0000)
      .popUp(1000);

    // dialog TWO
    this.dialog2 = this.rexUI.add
      .dialog({
        x: game.config.width / 2,
        y: game.config.height / 2,
        width: 500,
        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x533d8e),
        content: this.createLabel(
          this,
          "Hold space button to jump.\nThe longer you hold space the higher Tāne can jump!",
          50,
          50
        ),
        // description:  this.add.image(0, 0, "platformer-instructions"),
        actions: [this.createLabel(this, "BEGIN", 10, 10)],
        space: {
          left: 20,
          right: 20,
          top: 50,
          bottom: 20,
          content: 20,
          toolbarItem: 5,
          choice: 15,
          action: 15,
        },
        align: {
          content: "center",
          actions: "right", // 'center'|'left'|'right'
        },

        click: {
          mode: "release",
        },
      })
      .layout()
      // .drawBounds(this.add.graphics(), 0xff0000)
      .setVisible(false);

    var tween = this.tweens.add({
      targets: [this.dialog1, this.dialog2],
      scaleX: 1,
      scaleY: 1,
      ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 1000,
      repeat: 0, // -1: infinity
      yoyo: false,
    });

    this.dialog1.on(
      "button.click",
      function (button) {
        if (button.text === "NEXT") {
          this.dialog1.setVisible(false);
          this.dialog2.setVisible(true).popUp(1000);
        }
      },
      this
    );

    this.dialog2.on(
      "button.click",
      function (button) {
        if (button.text === "BEGIN") {
          console.log("starting game");
          this.scene.start("game-play");
          // this.scene.start("game-hud")
        }
      },
      this
    );
  }
  // settings for the dialog labels
  createLabel(scene, text, spaceTop, spaceBottom) {
    return scene.rexUI.add.label({
      width: 40, // Minimum width of round-rectangle
      height: 40, // Minimum height of round-rectangle
      background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xffffff),
      text: scene.add.text(0, 0, text, {
        fontSize: "24px",
        color: "#533d8e",
        stroke: "#533d8e",
        strokeThickness: 2,
      }),
      space: {
        left: 10,
        right: 10,
        top: spaceTop,
        bottom: spaceBottom,
      },
    });
  }
  update() {}
}

/* ======================
    GAME OVER SCENE
=========================*/
class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }
  // Game Over scene preload
  preload() {
    this.load.audio(
      "die",
      // "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fquake-die.ogg?v=1603606001864",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fdie.ogg?v=1609829227262"
    );
    this.load.audio(
      "end-music",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fgameover-music.mp3?v=1609829224481"
    );
  }
  // Game Over scene create
  create() {
    // music
    this.scene.stop("game-hud");
    this.scene.stop("game-play");
    this.sound.stopAll();
    this.sound.play("die");
    // load song
    const musicConfig = {
      volume: 0.5,
      loop: true,
      delay: 3000,
    };
    this.endMusic = this.sound.add("end-music", musicConfig);
    this.endMusic.play();

    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .tileSprite(
        game.config.width / 2,
        game.config.height / 2 + 500,
        game.config.width,
        3000,
        "kowhaiwhai"
      )
      .setScrollFactor(0, 0.25)
      .setAlpha(0.2)
      .setScale(1);

    WebFont.load({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"],
      },
      active: () => {
        this.gameOver = this.add
          .text(
            game.config.width / 2,
            game.config.height / 2 - 50,
            "Game Over",
            {
              fontFamily: "Freckle Face",
              fontSize: 50,
              color: "#ffffff",
            }
          )
          .setShadow(2, 2, "#333333", 2, false, true);
        this.gameOver.setAlign("center");
        this.gameOver.setOrigin();
        this.gameOver.setScrollFactor(0);

        this.pressRestart = this.add
          .text(
            game.config.width / 2,
            game.config.height / 2 + 50,
            "Press Space to Restart",
            {
              fontFamily: "Finger Paint",
              fontSize: 20,
              color: "#ffffff",
            }
          )
          .setShadow(2, 2, "#333333", 2, false, true);
        this.pressRestart.setAlign("center");
        this.pressRestart.setOrigin();
        this.pressRestart.setScrollFactor(0);
      },
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("game-play");
    });
  }
}

/* ======================
    GAME WIN SCENE
=========================*/
class GameWin extends Phaser.Scene {
  constructor() {
    super("game-win");
  }

  create() {
    this.scene.stop("game-hud");
    this.cameras.main.setBackgroundColor("#533d8e");

    this.sound.stopAll();
    // load song
    const musicConfig = {
      volume: 0.5,
      loop: false,
      delay: 3000,
    };
    this.cheer = this.sound.add("cheer", musicConfig);
    this.cheer.play();

    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .tileSprite(
        game.config.width / 2,
        game.config.height / 2 + 500,
        game.config.width,
        3000,
        "kowhaiwhai"
      )
      .setScrollFactor(0, 0.25)
      .setAlpha(0.2)
      .setScale(1);

    WebFont.load({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"],
      },
      active: () => {
        this.gameOver = this.add
          .text(
            game.config.width / 2,
            game.config.height / 2 - 100,
            "You Win!",
            {
              fontFamily: "Freckle Face",
              fontSize: 50,
              color: "#ffffff",
            }
          )
          .setShadow(2, 2, "#333333", 2, false, true);
        this.gameOver.setAlign("center");
        this.gameOver.setOrigin();
        this.gameOver.setScrollFactor(0);

        this.add
          .text(
            game.config.width / 2,
            game.config.height / 2,
            "Tino pai to mahi.",
            {
              fontFamily: "Finger Paint",
              fontSize: 20,
              color: "#ffffff",
            }
          )
          .setShadow(2, 2, "#333333", 2, false, true)
          .setAlign("center")
          .setOrigin()
          .setScrollFactor(0);
        this.add
          .text(
            game.config.width / 2,
            game.config.height / 2 + 100,
            "You collected all the actions\n to complete this moemoeā.",
            {
              fontFamily: "Finger Paint",
              fontSize: 20,
              color: "#ffffff",
            }
          )
          .setShadow(2, 2, "#333333", 2, false, true)
          .setAlign("center")
          .setOrigin()
          .setScrollFactor(0);
      },
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("game-play");
    });
  }
}

/* ======================
    GAME HUD SCENE
=========================*/
class GameHud extends Phaser.Scene {
  constructor() {
    super("game-hud");
  }
  init() {
    this.countdownTime = 60;
  }
  // Game hud preload
  preload() {
    this.load.audio(
      "cheer",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fcheer.wav?v=1609829231162"
    );

    // token types
    this.load.image(
      "green-token-type",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftane-green-token.png?v=1609829228862"
    );
    this.load.image(
      "yellow-token-type",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftane-yellow-token.png?v=1609829228207"
    );
    this.load.image(
      "red-token-type",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftane-red-token.png?v=1609829227986"
    );

    this.load.image(
      "green-token-overlay",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fgreen-overlay.png?v=1609829230044"
    );
    this.load.image(
      "yellow-token-overlay",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fyellow-overlay.png?v=1609829229357"
    );
    this.load.image(
      "red-token-overlay",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fred-overlay.png?v=1609829536466"
    );

    this.load.image(
      "green-token-tab",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fgreen-tab.png?v=1609829227708"
    );
    this.load.image(
      "yellow-token-tab",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fyellow-tab.png?v=1609829223274"
    );
    this.load.image(
      "red-token-tab",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fred-tab.png?v=1609829226737"
    );

    // hand
    this.load.image(
      "hand",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fhand.png?v=1609829226281"
    );

    //  Load the Google WebFont Loader script
    this.load.script(
      "webfont",
      "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js"
    );
  }
  // Game hud create
  create() {
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    // ====================== timer text =============================
    // load google font
    WebFont.load({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"],
      },
      active: () => {
        this.timer = this.add
          .text(game.config.width / 2, 50, "Time: " + this.countdownTime, {
            fontFamily: "Freckle Face",
            fontSize: 50,
            color: "#ffffff",
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.timer.setAlign("center");
        this.timer.setOrigin();
        // this.timer.setDepth(300)
        this.timer.setScrollFactor(0);

        this.time.addEvent({
          delay: 1000, // ms
          callback: this.loadTimer,
          //args: [],
          callbackScope: this,
          loop: true,
        });
      },
    });

    // ========== TOKEN METERS
    // GREEN token type
    // the token container. A simple sprite
    let tokenGreen = this.add
      .sprite(60, 50, "green-token-type")
      .setScrollFactor(0)
      .setScale(0.2)
      .setDepth(100);
    tokenGreenOverlay = this.add
      .sprite(60, 50, "green-token-overlay")
      .setScrollFactor(0)
      .setScale(0.2)
      .setDepth(150);
    // create a group for the gold tab
    tokenGreenTabGroup = this.add.group();
    const tokenGreenTab = this.add
      .sprite(110, 50, "green-token-tab")
      .setScrollFactor(0)
      .setScale(0.2)
      .setDepth(99);
    const tokenGreenHand = this.add
      .sprite(130, 50, "hand")
      .setScrollFactor(0)
      .setScale(0.12)
      .setDepth(99);
    tokenGreenTabGroup.addMultiple([tokenGreenTab, tokenGreenHand]);
    // hand animation
    this.tweens.add({
      targets: tokenGreenHand,
      x: 125,
      duration: 500,
      ease: "Back.easeIn ",
      yoyo: true,
      loop: -1,
    });
    tokenGreenTabGroup.children.each((entity) => (entity.flipX = true));
    // tokenGreenTabGroup.toggleVisible()

    // YELLOW token type
    let tokenYellow = this.add
      .sprite(60, 150, "yellow-token-type")
      .setScrollFactor(0)
      .setScale(0.2)
      .setDepth(100);
    tokenYellowOverlay = this.add
      .sprite(60, 150, "yellow-token-overlay")
      .setScrollFactor(0)
      .setScale(0.2)
      .setDepth(150);
    // create a group for the gold tab
    tokenYellowTabGroup = this.add.group();
    const tokenYellowTab = this.add
      .sprite(110, 150, "yellow-token-tab")
      .setScrollFactor(0)
      .setScale(0.2)
      .setDepth(99);
    const tokenYellowHand = this.add
      .sprite(130, 150, "hand")
      .setScrollFactor(0)
      .setScale(0.12)
      .setDepth(99);
    tokenYellowTabGroup.addMultiple([tokenYellowTab, tokenYellowHand]);
    // hand animation
    this.tweens.add({
      targets: tokenYellowHand,
      x: 125,
      duration: 500,
      ease: "Back.easeIn ",
      yoyo: true,
      loop: -1,
    });
    tokenYellowTabGroup.children.each((entity) => (entity.flipX = true));
    tokenYellowTabGroup.toggleVisible();

    // RED token type
    let tokenRed = this.add
      .sprite(60, 250, "red-token-type")
      .setScrollFactor(0)
      .setScale(0.2)
      .setDepth(100);
    tokenRedOverlay = this.add
      .sprite(60, 250, "red-token-overlay")
      .setScrollFactor(0)
      .setScale(0.2)
      .setDepth(150);
    // create a group for the red tab
    tokenRedTabGroup = this.add.group();
    const tokenRedTab = this.add
      .sprite(110, 250, "red-token-tab")
      .setScrollFactor(0)
      .setScale(0.2)
      .setDepth(99);
    const tokenRedHand = this.add
      .sprite(130, 250, "hand")
      .setScrollFactor(0)
      .setScale(0.12)
      .setDepth(99);
    tokenRedTabGroup.addMultiple([tokenRedTab, tokenRedHand]);
    // hand animation
    this.tweens.add({
      targets: tokenRedHand,
      x: 125,
      duration: 500,
      ease: "Back.easeIn ",
      yoyo: true,
      loop: -1,
    });
    tokenRedTabGroup.children.each((entity) => (entity.flipX = true));
    tokenRedTabGroup.toggleVisible();
  }

  // ================ timer function ========================
  loadTimer() {
    var add = this.add;
    var input = this.input;

    if (this.countdownTime === 0) {
      console.log("end");
      this.scene.start("game-over");
    } else {
      this.countdownTime -= 1;
      this.timer.setText("Time: " + this.countdownTime);
    }
  }

  // method to be executed at each frame
  update() {}
}

/* ======================
    GAME PLAY SCENE   <<---- THIS IS THE ACTUAL GAME
=========================*/
class GamePlay extends Phaser.Scene {
  constructor() {
    super("game-play");
  }
  init() {
    this.scene.launch("game-hud");
    this.gotKeyYellow = false;
    this.gotKeyGreen = false;
    this.gotKeyRed = false;
    completedGreenMission = false;
    completedYellowMission = false;
    completedRedMission = false;
    this.jumptimer = 0;
  }
  preload() {
    // ====================== tilesheets =============================
    this.load.image(
      "ground",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspritesheet_ground.png?v=1597798791918"
    );
    this.load.image(
      "tiles",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspritesheet_tiles.png?v=1597798793579"
    );

    // ====================== images =============================
    this.load.image(
      "clouds",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fbackground.png?v=1597805558340"
    );
    this.load.image(
      "spike",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fspikes.png?v=1599014843516"
    );
    this.load.image(
      "lavaSquare",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Flava.png?v=1599615845811"
    );
    this.load.image(
      "lavaWave",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2FlavaTop_high.png?v=1599615843450"
    );
    this.load.image(
      "bridge",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2FbridgeA.png?v=1600812709430"
    );
    this.load.image(
      "doorLower",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fdoor-lower.png?v=1609829220725"
    );
    this.load.image(
      "doorUpper",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fdoor-upper.png?v=1609829227016"
    );
    //this.load.image( "chain", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fchain.png?v=1599615831446");
    //this.load.image( "cloud", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fsnow.png?v=1599615818886");
    //this.load.image( "torch", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftorch1.png?v=1599615823447");
    //this.load.image( "rock", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Frock.png?v=1599014842634");
    this.load.image(
      "keyYellow",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2FkeyYellow.png?v=1609637921863"
    );
    this.load.image(
      "keyRed",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2FkeyRed.png?v=1609637922046"
    );
    this.load.image(
      "keyBlue",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2FkeyBlue.png?v=1609637921863"
    );
    this.load.image(
      "keyGreen",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2FkeyGreen.png?v=1609637921977"
    );
    this.load.image(
      "lockRed",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2FlockRed.png?v=1609637921955"
    );
    this.load.image(
      "lockBlue",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2FlockBlue.png?v=1609637921863"
    );
    this.load.image(
      "lockGreen",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2FlockGreen.png?v=1609637921863"
    );
    this.load.image("lockYellow",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2FlockYellow.png?v=1609637922248"
    );
    this.load.image(
      "kiwiCage",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/cage.png?v=1648393812074"
    );
    this.load.image(
      "kiwi",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/kiwi_idle.png?v=1648539380455"
    );

    this.load.image("tool", "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/silver-coin.png?v=1648872031322");

    this.load.image(
      "Layer 1",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/Layer%201.png?v=1648355031363"
    );
    this.load.image(
      "Layer 2",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/Layer%202.png?v=1648355106217"
    );
    this.load.image(
      "Layer 3",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/Layer%203.png?v=1648355112261"
    );
    this.load.image(
      "Layer 4",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/Layer%204.png?v=1648355125295"
    );

    // this.load.image(
    //   "kowhaiwhai",
    //   "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fkowhaiwhai.png?v=1609829230478"
    // );

    // ====================== player (atlas) =============================
    this.load.atlas(
      "player",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fkenney_player.png?v=1598396905743",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fkenney_player_atlas.json?v=1598396922994"
    );

    // TANE !!! (From Ariki Creative)
    this.load.spritesheet(
      "taneIdle",

      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftane-idle.png?v=1606611069685",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    this.load.spritesheet(
      "taneJump",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftane-jump.png?v=1606611070167",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    this.load.spritesheet(
      "taneRun",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftane-run.png?v=1606611070188",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );
    this.load.spritesheet(
      "taneAttack",
      "https://cdn.glitch.com/5095b2d7-4d22-4866-a3b8-5f744eb40eb0%2F128-Attack%20Sprite.png?v=1602576237547",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );
    this.load.spritesheet(
      "taneDeath",
      "https://cdn.glitch.com/5095b2d7-4d22-4866-a3b8-5f744eb40eb0%2F128-Death-Sprite.png?v=1602576237169",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    // ====================== Tiled JSON map ===========================
    // this.load.tilemapTiledJSON("map", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftest-map-2.4.json?v=1600219625072")
    // this.load.tilemapTiledJSON("map", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftest-map-2.5.json?v=1600815304381" );
    // this.load.tilemapTiledJSON("map", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fcage-map.json?v=1606610896966" );
    // this.load.tilemapTiledJSON("map", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fcage-map-latest.json?v=1609829241643");
    // this.load.tilemapTiledJSON("map", "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Ftest-map-2.5.json?v=1600815304381");

    // OLIONI'S MAP
    // this.load.tilemapTiledJSON("map", "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/olioni-map-1_2.json?v=1648551762192") // link to glitch asset
    this.load.tilemapTiledJSON(
      "map",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/olioni-map-1_3.json?v=1648871977923"
    ); // latest TILED map
    
    // pa ian test map
    this.load.tilemapTiledJSON(
      "map",
      "https://cdn.glitch.global/6ec21438-e8d9-4bed-8695-1a8695773d71/testmap.json?v=1649027537705"
    ); // latest TILED map
    

    // ====================== Sound effects ===========================
    // this.load.audio("jump", "assets/sfx/phaseJump1.wav");
    this.load.audio(
      "jump",
      // "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fquake-jump.ogg?v=1603606002409"
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fjump.ogg?v=1609829224208"
    );

    this.load.audio(
      "hurt",
      // "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fquake-hurt.ogg?v=1603606002105"
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fbad.ogg?v=1609829228399"
    );
    this.load.audio(
      "good",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fgood.ogg?v=1609829222070"
    );
    this.load.audio(
      "music",
      "https://cdn.glitch.com/cd67e3a9-81c5-485d-bf8a-852d63395343%2Fmusic-edited.ogg?v=1609829233382"
    );

    //  Load the Google WebFont Loader script
    this.load.script(
      "webfont",
      "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js"
    );
  }

  create() {
    // ====================== map =============================
    const map = this.make.tilemap({
      key: "map",
    });

    this.sound.stopAll();
    // load song
    const musicConfig = {
      volume: 0.5,
      loop: true,
      delay: 3000,
    };
    this.music = this.sound.add("music", musicConfig);
    // this.music.play();

    // ====================== PLAYER =============================

    const playerScale = 1.5;
    const playerYIndent = -930;

    const spawnIndent = 0.4;

    let spawnX = 0;
    let spawnY = 0;

    const spawn = map.findObject("Spawn", (obj) => {
      spawnX = obj.x;
      spawnY = obj.y;
      return obj;
    });

    // console.log(spawn)
    console.log(spawnX, spawnY);

    this.player = this.physics.add.sprite(spawnX, spawnY, "taneIdle");
    // this.player = this.physics.add.sprite(100, 0, "taneIdle");
    this.player.setBounce(0.01);
    this.player.setScale(playerScale, playerScale);
    this.player.setDepth(1000);
    this.player.body
      .setSize(this.player.width - 100, this.player.height - 50)
      .setOffset(50, 25);
    this.player.setFlipX(true);

    // ====================== background =============================
    const bgScale = 3;
    const treeScale = 1.3;

    const bgXIndent = 0;
    const bgYIndent = map.heightInPixels - 1200; // because layer height is 400px and scale is x3 (400x3=1200)

    
    // let bg_layer1 = this.add.image(bgXIndent, bgYIndent, "Layer 1") // BACKGROUND IMAGE LAYER
    // bg_layer1.setOrigin(0);
    // bg_layer1.setScale(3);
    // bg_layer1.setScrollFactor(0.5,1);
    
    // bg_layer1.displayHeight = map.heightInPixels  // -> stretchs image to full height. prob not a bad idea if we know the scale. recommend change height of tiled map to 1200pixels as our bg_layers are 400px height so we know scale is 3x
    
    // let bg_layer2 = this.add
    //   .image(bgXIndent, bgYIndent, "Layer 2")
    //   .setOrigin(0, 0); // BACK TREES LAYER
    // let bg_layer3 = this.add
    //   .image(bgXIndent, bgYIndent, "Layer 3")
    //   .setOrigin(0, 0); // DARK GREEN GRASS LAYER
    let bg_layer4 = this.add
      .image(bgXIndent, 0, "Layer 4")
      .setOrigin(0, 0); // TREE LAYER
      bg_layer4.displayHeight = map.heightInPixels
    bg_layer4.displayWidth = map.widthInPixels

    // bg_layer4.setScale(treeScale);
    // bg_layer3.setScale(bgScale);
    // bg_layer2.setScale(bgScale);
    

    // bg_layer4.setScrollFactor(1);
    // bg_layer3.setScrollFactor(0.3);
    // bg_layer2.setScrollFactor(0.2);
    // bg_layer1.setScrollFactor(0.1);
    // bg_layer4.setDepth(1000);

    // this.add.tileSprite(game.config.width/2, game.config.height/2, game.config.width, 3000, "kowhaiwhai").setScrollFactor(0.1, 0).setAlpha(0.2).setScale(1);

    // ====================== tilesets =============================
    const groundTileset = map.addTilesetImage("spritesheet_ground", "ground");
    const detailTiles = map.addTilesetImage("spritesheet_tiles", "tiles");
    const cageTiles = map.addTilesetImage("cage", "kiwiCage");

    // ====================== get the level rectangle =============================
    // -- NOT NEEDED --
    // const level1Rec = map.findObject("Platforms");
    // console.log('map asset:', map)
    // console.log('map width: ', map.width)
    // console.log('map height:', map.height)

    // ====================== world physics =============================
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    // this.player.setCollideWorldBounds(true)

    console.log(
      "world physics boundaries",
      this.physics.world.bounds.width,
      this.physics.world.bounds.height
    );

    // ====================== Camera ======================
    // this.cameras.main.setViewport(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(
      0,
      map.heightInPixels - 1200,
      map.widthInPixels,
      1200,
      true
    );
    console.log(map.widthInPixels, map.heightInPixels);
    // Set camera follow player
    this.cameras.main.startFollow(this.player);
    // Set camera fade in
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    // this.cameras.main.setZoom(1);
    this.cameras.main.setFollowOffset(0, 0.25);

    // ========= TANE ANIMATIONS ===========
    this.anims.create({
      key: "taneRun",
      frames: this.anims.generateFrameNumbers("taneRun", {
        frames: [16, 17, 18, 19, 20, 21, 22, 23],
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "taneIdle",
      frames: this.anims.generateFrameNumbers("taneIdle", {
        frames: [6, 7, 8],
      }),
      frameRate: 5,
    });

    this.anims.create({
      key: "taneJump",
      frames: this.anims.generateFrameNumbers("taneJump", {
        frames: [12, 13, 14, 15],
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: "taneAttack",
      frames: this.anims.generateFrameNumbers("taneAttack", {
        frames: [8, 9, 10, 11],
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: "taneDie",
      frames: this.anims.generateFrameNumbers("taneDeath", {
        frames: [1, 2, 3, 4, 5],
      }),
      frameRate: 10,
    });

    // ====================== Controls ======================
    this.cursors = this.input.keyboard.createCursorKeys();

    // ====================== MAP LAYERS =============================

    const mapScale = 0.5;
    const mapXOffset = 0;
    const mapYOffset = map.heightInPixels * mapScale;

    //----- platforms
    const platforms = map
      .createLayer("Platforms", groundTileset, 0, mapYOffset)
      .setOrigin(0, 0);
    const bridges = map
      .createLayer("Bridge", detailTiles, 0, mapYOffset)
      .setOrigin(0, 0);
    const crates = map
      .createLayer("Crates", detailTiles, 0, mapYOffset)
      .setOrigin(0, 0);

    platforms.setCollisionByExclusion(-1, true);
    platforms.setScale(mapScale, mapScale);
    bridges.setCollisionByExclusion(-1, true);
    bridges.setScale(mapScale, mapScale);
    crates.setCollisionByExclusion(-1, true);
    crates.setScale(mapScale, mapScale);

    //----- object layers

    // groups
    this.badStuff = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    this.levelObjects = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    this.cagesObjects = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    this.kiwisObjects = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    this.toolObjects = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    // detail
    // var detailObjs = map.getObjectLayer("Detail")["objects"];
    // detailObjs.forEach(detailObject => {
    //   switch(detailObject.gid) {
    //     case 228:
    //         detail = this.badStuff.create(detailObject.x * 0.25, detailObject.y  * 0.25, 'chain').setScale(0.25, 0.25)
    //       break;
    //     case 131:
    //         detail = this.badStuff.create(detailObject.x * 0.25, detailObject.y  * 0.25, 'cloud').setScale(0.25, 0.25)
    //       break;
    //     case 139:
    //       detail = this.badStuff.create(detailObject.x * 0.25, (detailObject.y  * 0.25) - (detailObject.height *0.25), 'rock').setOrigin(0,0).setScale(0.25, 0.25)
    //       break;
    //     case 228:
    //       detail = this.badStuff.create(detailObject.x * 0.25, detailObject.y  * 0.25, 'rock').setOrigin(0,0).setScale(0.25, 0.25)
    //       break;
    //     default:
    //   }

    // let detail = this.badStuff.create(lavaObject.x * 0.25, lavaObject.y  * 0.25, 'lavaSquare').setScale(0.25, 0.25)
    //   console.log(detailObject.gid)
    // });

    // objects from map
    // var spikesObjs = map.createFromObjects('Spikes', 250, {
    //   key: 'spike'
    // });
    // var bridgeObjs = map.createFromObjects('Bridge', 133, {
    //   key: 'spike'
    // });
    // var greenLockObjs = map.createFromObjects('greenDoor', 219, {
    //   key: 'lockGreen'
    // });
    var cagesObjs = map.createFromObjects("Cages", {
      key: "kiwiCage",
    });
    var kiwiObjs = map.createFromObjects("Birds", {
      key: "kiwi",
    });

    // gets multiple objects by type
    var toolObjs = map.filterObjects("Tools", (obj) => obj.type == "kiwi-tool");

    // gets individual objects by name
    const kiwiTool1Tile = map.findObject(
      "Tools",
      (obj) => obj.name == "kiwi1-tool1"
    );
    const kiwiTool2Tile = map.findObject(
      "Tools",
      (obj) => obj.name == "kiwi1-tool2"
    );
    const kiwiTool3Tile = map.findObject(
      "Tools",
      (obj) => obj.name == "kiwi1-tool3"
    );
    const kiwiTool4Tile = map.findObject(
      "Tools",
      (obj) => obj.name == "kiwi1-tool4"
    );

    const kiwiCage1Tile = map.findObject(
      "Cages",
      (obj) => obj.name == "kiwi1-cage"
    );

    let kiwiTool1 = this.toolObjects
      .create(
        kiwiTool1Tile.x - 640 * mapScale,
        kiwiTool1Tile.y + 256 * mapScale,
        "tool"
      )
      .setScale(mapScale, mapScale)
      .setOrigin(0, 0);

    let kiwiTool2 = this.toolObjects
      .create(
        kiwiTool2Tile.x - 640 * mapScale,
        kiwiTool2Tile.y + 256 * mapScale,
        "tool"
      )
      .setScale(mapScale, mapScale)
      .setOrigin(0, 0);

    let kiwiTool3 = this.toolObjects
      .create(
        kiwiTool3Tile.x - 640 * mapScale,
        kiwiTool3Tile.y + 256 * mapScale,
        "tool"
      )
      .setScale(mapScale, mapScale)
      .setOrigin(0, 0);

    let kiwiTool4 = this.toolObjects
      .create(
        kiwiTool4Tile.x - 640 * mapScale,
        kiwiTool4Tile.y + 256 * mapScale,
        "tool"
      )
      .setScale(mapScale, mapScale)
      .setOrigin(0, 0);

    kiwiTool1.name = kiwiTool1Tile.name;
    kiwiTool1.type = kiwiTool1Tile.type;
    kiwiTool2.name = kiwiTool2Tile.name;
    kiwiTool2.type = kiwiTool2Tile.type;
    kiwiTool3.name = kiwiTool3Tile.name;
    kiwiTool3.type = kiwiTool3Tile.type;
    kiwiTool4.name = kiwiTool4Tile.name;
    kiwiTool4.type = kiwiTool4Tile.type;

    let kiwiCage1 = this.cagesObjects
      .create(
        kiwiCage1Tile.x - 640 * mapScale,
        kiwiCage1Tile.y + 256 * mapScale,
        "tool"
      )
      .setScale(mapScale, mapScale);

    kiwiCage1.name = kiwiCage1Tile.name;
    kiwiCage1.type = kiwiCage1Tile.type;

    // const kiwiTool2 = this.toolObjects.create(kiwiTool2Tile.y, kiwiTool2Tile.y, 'tool').setScale(mapScale, mapScale)

    // console.log('lavaObjs',lavaObjs)
    // console.log('spikesObjs',spikesObjs)
    // console.log("Bridge")

    //----- Lavas
    // let normalLavas = [];
    // let waveLavas = [];
    // map.findObject("Lava", obj => {
    //   if (obj.gid == 148) {
    //     normalLavas.push(obj)
    //   } else if (obj.gid == 140) {
    //     waveLavas.push(obj)
    //   }
    // })
    // normalLavas.forEach(lavaObject => {
    //   let lava = this.badStuff.create(lavaObject.x * 0.25, lavaObject.y * 0.25, 'lavaSquare').setOrigin(0, 1).setScale(0.25, 0.25)
    //   this.physics.add.collider(this.player, lava, this.playerHit, null, this);
    // });
    // waveLavas.forEach(lavaWaveObject => {
    //   let lava = this.badStuff.create(lavaWaveObject.x * 0.25, lavaWaveObject.y * 0.25, 'lavaWave').setOrigin(0, 1).setScale(0.25, 0.25)
    //   lava.body.setSize(lava.width, lava.height - 50).setOffset(0, 50);
    //   this.physics.add.collider(this.player, lava, this.playerHit, null, this);
    // });

    //----- Bridges
    // bridgeObjs.forEach(bridgeObject => {
    //   let bridge = this.levelObjects.create(bridgeObject.x * 0.25, (bridgeObject.y * 0.25) - (bridgeObject.height * 0.25), 'bridge').setOrigin(0, 0).setScale(0.25, 0.25)
    //   console.log("bridge")
    //   this.physics.add.collider(this.player, bridge);
    //   // this.physics.world.enable(bridge, 1);
    //   bridge.setCollideWorldBounds()
    // });

    //----- Green lock
    // greenLockObjs.forEach(greenLockObject => {
    //   let greenLock = this.levelObjects.create(greenLockObject.x * 0.25, (greenLockObject.y * 0.25), 'lockGreen').setOrigin(0.5).setScale(0.25, 0.25)
    //   greenLock.name = "greenLock"
    //   this.physics.add.overlap(this.player, greenLock, this.tryOpenLock, null, this);
    // });

    // ----- Bird Cages
    cagesObjs.forEach((cageObj) => {
      // let cage = this.cagesObjects.create(cageObj.x * mapScale, (cageObj.y * mapScale) + mapYOffset, 'kiwiCage').setOrigin(0, 0).setScale(mapScale, mapScale)
      // cage.name = cageObj.name
      // cage.type = cageObj.type
      // cage.setDepth(201)
      // console.log(cage)
      // this.physics.add.overlap(this.player, cage, this.touchingCage, null, this)
    });
    // this.cagesObjects

    // ----- Kiwis
    // console.log(kiwiObjs)
    kiwiObjs.forEach((kiwiObj) => {
      // let kiwi = this.kiwisObjects.create(kiwiObj.x, (kiwiObj.y * mapYOffset), 'kiwi').setScale(mapScale, mapScale)
      // kiwi.name = kiwiObj.name
      // kiwi.type = kiwiObj.type
      // kiwi.setDepth(200)
      // console.log(kiwiObj.x, kiwiObj.y)
    });

    // ----- Tools
    toolObjs.forEach((toolObj) => {
      // let tool = this.levelObjects.create(toolObj.x * mapScale, toolObj.y, 'tool').setScale(mapScale, mapScale)
    });

    // other functions to get objects
    // let Bridge = map.getObjectLayer("Bridge")["objects"];
    // map.findObject("Bridge", obj => obj.name == "bridge");

    //----- Spikes
    // let normalSpikes = [];
    // let rotatedSpikes = [];
    // map.findObject("Spikes", obj => {
    //   if (obj.flippedVertical == true) {
    //     console.log('vertical spikes found')
    //   } else {
    //     normalSpikes.push(obj)
    //   }
    // })
    // normalSpikes.forEach(spikeObject => {
    //   let spike = this.badStuff.create(spikeObject.x * 0.25, spikeObject.y * 0.25, 'spike').setOrigin(0, 1).setScale(0.25, 0.25)
    //   spike.body.setSize(spike.width, spike.height - 60).setOffset(0, 60);
    //   this.physics.add.collider(this.player, spike, this.playerHit, null, this);
    // });
    // rotatedSpikes.forEach(spikeObject => {
    //   let spike = this.badStuff.create(spikeObject.x * 0.25, spikeObject.y * 0.25, 'spike').setOrigin(0, 1).setScale(0.25, 0.25).setFlipY(true)
    //   spike.body.setSize(spike.width, spike.height - 60).setOffset(0, -5);
    //   this.physics.add.collider(this.player, spike, this.playerHit, null, this);
    // });

    //----- Keys (Yellow, Green & Red)
    // const yellowKeyTile = map.findObject("Keys", obj => obj.name === "YellowKey");
    // const greenKeyTile = map.findObject("Keys", obj => obj.name === "GreenKey");
    // const redKeyTile = map.findObject("Keys", obj => obj.name === "RedKey");
    // // const blueKeyTile = map.findObject("Keys", obj => obj.name === "BlueKey");
    // const yellowKey = this.levelObjects.create(yellowKeyTile.x * 0.25, yellowKeyTile.y * 0.25, 'keyYellow').setOrigin(0, 1).setScale(0.25, 0.25);
    // const greenKey = this.levelObjects.create(greenKeyTile.x * 0.25, greenKeyTile.y * 0.25, 'keyGreen').setOrigin(0, 1).setScale(0.25, 0.25);
    // const redKey = this.levelObjects.create(redKeyTile.x * 0.25, redKeyTile.y * 0.25, 'keyRed').setOrigin(0, 1).setScale(0.25, 0.25);
    // yellowKey.name = "yellowKey"
    // greenKey.name = "greenKey"
    // redKey.name = "redKey"
    // this.levelObjects.create(blueKeyTile.x* 0.25, blueKeyTile.y* 0.25, 'keyBlue').setOrigin(0, 1).setScale(0.25, 0.25);

    //----- Locks (Yellow & Red)
    // const yellowLockTile = map.getObjectLayer("yellowDoor").objects;
    // const redLockTile = map.getObjectLayer("redDoor").objects;
    // yellowLockTile.forEach(yellowLockObject => {
    //   let yellowLock = this.levelObjects.create(yellowLockObject.x * 0.25, yellowLockObject.y * 0.25, 'lockYellow').setOrigin(0, 1).setScale(0.25, 0.25);
    //   yellowLock.name = "yellowLock"
    //   this.physics.add.overlap(this.player, yellowLock, this.tryOpenLock, null, this);
    // })
    // redLockTile.forEach(redLockObject => {
    //   let redLock = this.levelObjects.create(redLockObject.x * 0.25, redLockObject.y * 0.25, 'lockRed').setOrigin(0, 1).setScale(0.25, 0.25);
    //   redLock.name = "redLock"
    //   this.physics.add.overlap(this.player, redLock, this.tryOpenLock, null, this);
    // })

    //----- Exit door
    // const exitDoorUpperTile = map.findObject("Exit", obj => obj.name === "exitUpper");
    // const exitDoorLowerTile = map.findObject("Exit", obj => obj.name === "exitLower");
    // const exitDoorUpper = this.levelObjects.create(exitDoorUpperTile.x * 0.25, exitDoorUpperTile.y * 0.25, 'doorUpper').setOrigin(0, 1).setScale(0.25, 0.25);
    // const exitDoorLower = this.levelObjects.create(exitDoorLowerTile.x * 0.25, exitDoorLowerTile.y * 0.25, 'doorLower').setOrigin(0, 1).setScale(0.25, 0.25);
    // this.physics.add.overlap(this.player, exitDoorUpper, this.reachedExit, null, this);
    // this.physics.add.overlap(this.player, exitDoorLower, this.reachedExit, null, this);

    // ====================== Colliders ======================
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, bridges);
    this.physics.add.collider(this.player, crates);

    //----- Key colliders/actions
    // this.physics.add.overlap(this.player, yellowKey, this.handleGotKey, null, this);
    // this.physics.add.overlap(this.player, greenKey, this.handleGotKey, null, this);
    // this.physics.add.overlap(this.player, redKey, this.handleGotKey, null, this);
    // this.physics.add.collider(this.player, this.levelObjects);
    // this.physics.add.overlap(this.player, this.cagesObjects, this.touchingCage, null, this)
    // this.physics.add.overlap(this.player, this.kiwisObjects)
    this.physics.add.overlap(
      this.player,
      this.cages,
      this.touchingCage,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.toolObjects,
      this.touchingTool,
      null,
      this
    );
  }
  //   Game Play Update (this is updating all the time)
  update() {
    // console.log(this.player.x, this.player.y)

    const playerJump = -250;
    const playerVelocity = 400;

    // Control the player with left or right keys
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-playerVelocity);
      if (this.player.body.onFloor()) {
        this.player.play("taneRun", true);
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(playerVelocity);
      if (this.player.body.onFloor()) {
        this.player.play("taneRun", true);
      }
    } else {
      // If no keys are pressed, the player keeps still
      this.player.setVelocityX(0);
      // Only show the idle animation if the player is footed
      // If this is not included, the player would look idle while jumping
      if (this.player.body.onFloor()) {
        this.player.play("taneIdle", true);
      }
    }

    // Player can jump while walking any direction by pressing the space bar
    // or the 'UP' arrow
    // === JUMP
    // if ((this.cursors.space.isDown || this.cursors.up.isDown ) && this.player.body.onFloor() ) {
    //   this.player.setVelocityY(-350);
    //   this.player.play('jump', true);
    // }
    if (this.cursors.space.isDown && this.player.body.onFloor()) {
      //player is on the ground, so he is allowed to start a jump
      this.jumptimer = 1;
      this.player.body.velocity.y = playerJump;
      this.player.play("taneJump", false);
      this.sound.play("jump");
    } else if (this.cursors.space.isDown && this.jumptimer != 0) {
      //player is no longer on the ground, but is still holding the jump key
      if (this.jumptimer > 30) {
        // player has been holding jump for over 30 frames, it's time to stop him
        this.jumptimer = 0;
        // this.player.play('taneJump', false);
      } else {
        // player is allowed to jump higher (not yet 30 frames of jumping)
        this.jumptimer++;
        this.player.body.velocity.y = playerJump;
        // this.player.play('taneJump', false);
      }
    } else if (this.jumptimer != 0) {
      //reset this.jumptimer since the player is no longer holding the jump key
      this.jumptimer = 0;
      // this.player.play('taneJump', false);
    }

    // flip player
    if (this.player.body.velocity.x > 0) {
      this.player.setFlipX(true);
    } else if (this.player.body.velocity.x < 0) {
      // otherwise, make them face the other side
      this.player.setFlipX(false);
    }
    // log player x y location
    // console.log(Math.round(this.player.x), Math.round(this.player.y))
  }

  // Other custom game functions
  // ================ death function ========================
  playerHit(player, spike) {
    console.log("player was hit");
    // player.setVelocity(0, 0);
    // player.setX(50);
    // player.setY(300);
    // player.play('idle', true);
    // player.setAlpha(0);
    let tw = this.tweens.add({
      targets: player,
      alpha: 1,
      duration: 100,
      ease: "Linear",
      repeat: 5,
    });
    console.log("player died");
    // this.scene.start("game-over")
  }
  // ================ got key function ========================
  handleGotKey(player, key) {
    console.log("player got ", key.name, " key");
    this.sound.play("good");
    key.destroy();
    switch (key.name) {
      case "greenKey":
        this.gotKeyGreen = true;
        break;
      case "yellowKey":
        this.gotKeyYellow = true;
        break;
      case "redKey":
        this.gotKeyRed = true;
        break;
      default:
        break;
    }
  }
  // ================ open lock function ========================
  tryOpenLock(player, lock) {
    // if they have the key then destroy this lock
    switch (lock.name) {
      case "greenLock":
        if (this.gotKeyGreen == true) {
          this.sound.play("good");
          lock.destroy();
          if (completedGreenMission == false) {
            completedGreenMission = true;
            tokenGreenOverlay.destroy();
            tokenGreenTabGroup.toggleVisible();
            tokenYellowTabGroup.toggleVisible();
          }
        }
        break;
      case "yellowLock":
        if (this.gotKeyYellow == true) {
          this.sound.play("good");
          lock.destroy();
          if (completedYellowMission == false) {
            completedYellowMission = true;
            tokenYellowOverlay.destroy();
            tokenYellowTabGroup.toggleVisible();
            tokenRedTabGroup.toggleVisible();
          }
        }
        break;
      case "redLock":
        if (this.gotKeyRed == true) {
          this.sound.play("good");
          lock.destroy();
          if (completedRedMission == false) {
            completedRedMission = true;
            tokenRedOverlay.destroy();
            tokenRedTabGroup.toggleVisible();
          }
        }
        break;
      default:
        break;
    }
  }

  // ================ open lock function ========================
  reachedExit(player, exit) {
    this.scene.start("game-win");
  }

  // ===== CHECK CAGE FUNCTION =====
  touchingCage(player, cage) {
    if (kiwiTool1Count == 4) {
      console.log("all tools collected!");
      cage.destroy();
    }
  }

  touchingTool(player, tool) {
    tool.destroy();
    kiwiTool1Count += 1;
    console.log(kiwiTool1Count);
  }
}
