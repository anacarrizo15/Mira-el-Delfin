/*
===========================================================
MIRA EL DELFÍN
Name: Ana Lucía Carrizo
Email: carrizo.a@northeastern.edu

Instructions:
- Click the dolphin while it jumps out of the water to feed it
  and earn a point.
- Dolphins jump out of the water at random locations and move
  across the screen before returning to the ocean.
- You have 3 lives. Missing a dolphin costs one life.
- The game becomes faster as your score increases.
- Click the heart power-up to gain an extra life.
- Click the clock power-up to temporarily slow down the game.
- DO NOT click the lionfish. Clicking one costs you a life.
- The orange fish follows your mouse and acts as the cursor.

Power-Ups:
- Heart = Gain an extra life
- Clock = Temporarily slow down the game's speed

Obstacles:
- Lionfish = Lose a life if clicked

Scoring:
- Each dolphin successfully clicked adds one point.
- Every 5 points, the game speed increases.
- Your best score is saved while the game is running.

Game Over:
- The game ends when all 3 lives are lost.
- Players can choose to try again or quit and return to
  the introduction screen.

The game is inspired by fishing and dolphin-watching activities
in Panama, especially the waters of Bocas del Toro. The ocean,
boat, and wildlife are designed to create a fun first-person
experience.

The lionfish is included as part of the game's connection to the
local marine environment and the presence of this invasive and
venomous species in Panama. Instead of being something to collect,
the lionfish acts as an obstacle that players must avoid.

The game combines reaction time, increasing difficulty, random
events, and simple power-ups to create a game that is easy to
understand but becomes more challenging as the player continues.
===========================================================
*/

//Variables
let gameState = "intro";
let gameScore = 0;
let livesLeft = 3;
let fullHearts;
let twoHearts;
let oneHeart;
let zeroHearts;
let gifIntro;
let gifPlay;
let dolphin;
let pinkHeart;
let livesLeftImg;
let orangeFish;
let lionfish;
let powerUpHeart;
let jumpObjectX;
let jumpObjectY;
let jumpObjectJump;
let pinkHeartX;
let pinkHeartY;
let clock;
let xMark;
let jumpObjectState;
let jumpObjectTimer;
let emergencePatch;
let landingPatch;
let jumpObjectStartX;
let jumpObjectStartY;
let jumpObjectEndX;
let jumpObjectEndY;
let bestScore = 0;
let currSpeed = 1;
let isSlowMo = false;
let slowMoTimer = 0;
let tempSpeed = 1;
let fishBlink = false;
let fishBlinkTimer = 0;
let feedbackType = "";
let feedbackX = 0;
let feedbackY = 0;
let feedbackAlpha = 0;
let feedbackTimer = 0;
let splashDrops = [];
let gameFont;
let dolphinSound;
let heartPUSound;
let lionfishSound;
let clockSound;
let gameOverSound;
let clickSound;
let splashSound;
let oceanSound;
let backgroundMusic;

//intro screen
let playButtonX = 300;
let playButtonY = 300;
let howToButtonX = 600;
let howToButtonY = 300;
let playHovered = false;
let howToHovered = false;
let introExiting = false;
let introExitTimer = 0;
let introTitleY = 110;
let introPlayX = 300;
let introHowToX = 600;
let howToPlayOpen = false;
let scrollY = 650;
let scrollTargetY = 0;
let scrollClosing = false;
let backButtonX = 450;
let backButtonY = 520;
let introTransitionDuration = 45;

//game over screen
let tryAgainButtonX = 300;
let tryAgainButtonY = 300;
let quitButtonX = 600;
let quitButtonY = 300;

let tryAgainHovered = false;
let quitHovered = false;

//Helper Functions
function topStats() {
  //score
  push();
  textAlign(LEFT, TOP);
  textSize(30);
  textFont(gameFont);
  text("Dolphins fed: " + gameScore, width - 275, 0);
  pop();

  //best score
  push();
  textAlign(LEFT, TOP);
  textSize(30);
  textFont(gameFont);
  text("Best score: " + bestScore, 50, 0);
  pop();

  //lives left
  push();
  imageMode(CORNER);

  if (livesLeft == 3) {
    livesLeftImg = fullHearts;
  } else if (livesLeft == 2) {
    livesLeftImg = twoHearts;
  } else if (livesLeft == 1) {
    livesLeftImg = oneHeart;
  } else if (livesLeft == 0) {
    livesLeftImg = zeroHearts;
  }

  image(livesLeftImg, height - 80, -2);
  pop();
}

function chooseJumpObject() {
  let chance = random();

  // full lives, game score above 5
  if (livesLeft == 3 && gameScore >= 5) {
    if (chance < 0.05) {
      jumpObject = clock;
    } else if (chance < 0.15) {
      jumpObject = lionfish;
    } else {
      jumpObject = dolphin;
    }
  }

  // full lives, game score below 5
  else if (livesLeft == 3 && gameScore < 5) {
    if (chance < 0.25) {
      jumpObject = lionfish;
    } else {
      jumpObject = dolphin;
    }
  }

  // no full lives, game score above 5
  else if (livesLeft < 3 && gameScore >= 5) {
    if (chance < 0.05) {
      jumpObject = clock;
    } else if (chance < 0.1) {
      jumpObject = powerUpHeart;
    } else if (chance < 0.15) {
      jumpObject = lionfish;
    } else {
      jumpObject = dolphin;
    }
  }

  // no full lives, game score below 5
  else if (livesLeft < 3 && gameScore < 5) {
    if (chance < 0.125) {
      jumpObject = powerUpHeart;
    } else if (chance < 0.175) {
      jumpObject = lionfish;
    } else {
      jumpObject = dolphin;
    }
  }
}

function checkLives() {
  if (livesLeft <= 0) {
    gameState = "game over";
    gameOverSound.play();
    oceanSound.stop();
  }
}

function createSplash(x, y) {
  for (let i = 0; i < 8; i++) {
    let drop = {
      x: x,
      y: y,
      vx: random(-2, 2),
      vy: random(-4, -1),
      size: random(3, 7),
      alpha: 255,
    };

    splashDrops.push(drop);
  }
}

function updateSplash() {
  for (let i = splashDrops.length - 1; i >= 0; i--) {
    let drop = splashDrops[i];
    drop.x += drop.vx;
    drop.y += drop.vy;
    drop.vy += 0.15;
    drop.alpha -= 8;
    if (drop.alpha <= 0) {
      splashDrops.splice(i, 1);
    }
  }
}

function drawSplash() {
  push();
  noStroke();
  fill(255, 255, 255, 180);
  for (let drop of splashDrops) {
    fill(255, 255, 255, drop.alpha);
    ellipse(drop.x, drop.y, drop.size);
  }
  pop();
}

function sunsetTint() {
  if (gameScore >= 5) {
    // how strong the sunset is
    let sunsetAmount = map(gameScore, 5, 20, 0, 1);
    sunsetAmount = constrain(sunsetAmount, 0, 1);

    // upper sky
    push();
    noStroke();
    fill(255, 140, 80, 80 * sunsetAmount);
    rect(0, 0, width, 150);
    pop();

    // lower ocean
    push();
    noStroke();
    fill(255, 100, 70, 35 * sunsetAmount);
    rect(0, 150, width, height - 150);
    pop();
  }
}

function pointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
  let area = abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);

  let area1 = abs((px * (y2 - y3) + x2 * (y3 - py) + x3 * (py - y2)) / 2);

  let area2 = abs((x1 * (py - y3) + px * (y3 - y1) + x3 * (y1 - py)) / 2);

  let area3 = abs((x1 * (y2 - py) + x2 * (py - y1) + px * (y1 - y2)) / 2);

  return abs(area - (area1 + area2 + area3)) < 0.5;
}

function isMouseOverPlayButton(x, y) {
  let side = 150;
  let height = (side * sqrt(3)) / 2;

  let x1 = x - side / 2;
  let y1 = y + height / 2;

  let x2 = x - side / 2;
  let y2 = y - height / 2;

  let x3 = x + side / 2;
  let y3 = y;

  return pointInTriangle(mouseX, mouseY, x1, y1, x2, y2, x3, y3);
}

function isMouseOverHowToButton(x, y) {
  let buttonWidth = 200;
  let buttonHeight = 80;

  return (
    mouseX > x - buttonWidth / 2 &&
    mouseX < x + buttonWidth / 2 &&
    mouseY > y - buttonHeight / 2 &&
    mouseY < y + buttonHeight / 2
  );
}

function drawPlayButton(x, y, hovered) {
  let side = 150;
  let height = (side * sqrt(3)) / 2;

  let triangleOffset = hovered ? -8 : 0;

  // triangle-shaped halo
  if (hovered) {
    push();
    noStroke();

    fill(255, 255, 255, 35);

    triangle(
      x - side / 2 - 12,
      y + height / 2 + 12 + triangleOffset,
      x - side / 2 - 12,
      y - height / 2 - 12 + triangleOffset,
      x + side / 2 + 15,
      y + triangleOffset
    );

    fill(255, 255, 255, 25);

    triangle(
      x - side / 2 - 20,
      y + height / 2 + 20 + triangleOffset,
      x - side / 2 - 20,
      y - height / 2 - 20 + triangleOffset,
      x + side / 2 + 25,
      y + triangleOffset
    );

    pop();
  }

  // actual button
  push();
  strokeWeight(6);
  stroke(55, 110, 65);

  if (hovered) {
    fill(150, 220, 140);
  } else {
    fill(185, 235, 170);
  }

  triangle(
    x - side / 2,
    y + height / 2 + triangleOffset,
    x - side / 2,
    y - height / 2 + triangleOffset,
    x + side / 2,
    y + triangleOffset
  );

  pop();

  // Start text
  push();
  textFont(gameFont);
  textAlign(CENTER, CENTER);
  textSize(25);

  // darker green
  fill(55, 130, 65);

  text("Start", x - 20, y + triangleOffset - 2);

  pop();
}

function drawHowToButton(x, y, hovered) {
  let buttonWidth = 200;
  let buttonHeight = 80;

  let buttonOffset = hovered ? -8 : 0;

  // rectangle-shaped halo
  if (hovered) {
    push();
    rectMode(CENTER);
    noStroke();

    fill(255, 255, 255, 35);
    rect(x, y + buttonOffset, buttonWidth + 20, buttonHeight + 20, 22);

    fill(255, 255, 255, 25);

    rect(x, y + buttonOffset, buttonWidth + 35, buttonHeight + 35, 27);

    pop();
  }

  // actual button
  push();
  rectMode(CENTER);
  strokeWeight(6);
  stroke(190, 95, 30);

  if (hovered) {
    fill(245, 170, 75);
  } else {
    fill(255, 195, 105);
  }

  rect(x, y + buttonOffset, buttonWidth, buttonHeight, 18);

  pop();

  // text
  push();
  textFont(gameFont);
  textAlign(CENTER, CENTER);
  textSize(25);

  // darker orange
  fill(190, 95, 30);

  text("How to play?", x, y + buttonOffset - 3);

  pop();
}

function updateScroll() {
  if (howToPlayOpen) {
    if (scrollY > scrollTargetY) {
      scrollY -= 15;

      if (scrollY < scrollTargetY) {
        scrollY = scrollTargetY;
      }
    }
  } else {
    if (scrollY < 650) {
      scrollY += 15;

      if (scrollY > 650) {
        scrollY = 650;
      }
    }
  }
}

function drawScroll() {
  // LIGHT YELLOW BACKGROUND
  push();
  noStroke();
  fill(255, 248, 225);

  rect(0, scrollY, width, 600, 0);

  pop();

  // Title
  push();

  textFont(gameFont);
  textAlign(CENTER, CENTER);
  textSize(48);
  fill(114, 47, 55);

  text("HOW TO PLAY", 450, scrollY + 48);

  pop();

  // Introduction
  push();

  textFont(gameFont);
  textAlign(LEFT, CENTER);
  textSize(18);
  fill(70, 70, 70);

  text(
    "You’re aboard a fishing boat exploring the beautiful waters",
    115,
    scrollY + 95
  );

  text(
    "of Bocas del Toro, Panama. Your mission is to feed as many",
    115,
    scrollY + 120
  );

  text("dolphins as you can!", 115, scrollY + 145);

  pop();

  // DOLPHIN
  push();

  imageMode(CENTER);

  let howToDolphin = dolphin.get();
  howToDolphin.resize(55, 0);

  image(howToDolphin, 125, scrollY + 185);

  pop();

  // Dolphin instructions
  push();

  textFont(gameFont);
  textAlign(LEFT, CENTER);
  textSize(18);
  fill(70, 70, 70);

  text("Click the dolphin while it jumps out of", 170, scrollY + 178);

  text("the water to feed it and earn a point.", 170, scrollY + 202);

  pop();

  // HEART
  push();

  imageMode(CENTER);

  image(powerUpHeart, 125, scrollY + 245);

  pop();

  push();

  textFont(gameFont);
  textAlign(LEFT, CENTER);
  textSize(18);
  fill(70, 70, 70);

  text("Click the heart to gain an extra life.", 170, scrollY + 245);

  pop();

  // CLOCK
  push();

  imageMode(CENTER);

  image(clock, 125, scrollY + 300);

  pop();

  push();

  textFont(gameFont);
  textAlign(LEFT, CENTER);
  textSize(18);
  fill(70, 70, 70);

  text("Click the clock to temporarily slow down", 170, scrollY + 293);

  text("the game.", 170, scrollY + 317);

  pop();

  // LIONFISH
  push();

  imageMode(CENTER);

  image(lionfish, 125, scrollY + 370);

  pop();

  push();

  textFont(gameFont);
  textAlign(LEFT, CENTER);
  textSize(18);
  fill(70, 70, 70);

  text("BE CAREFUL! Lionfish are an invasive", 170, scrollY + 355);

  text("and venomous species. Do not click them! Clicking", 170, scrollY + 379);

  text("one will cost you a life.", 170, scrollY + 403);

  pop();

  // Bottom instructions
  push();

  textFont(gameFont);
  textAlign(CENTER, CENTER);
  textSize(17);
  fill(70, 70, 70);

  text(
    "You have 3 lives. Miss a dolphin and you’ll lose a life.",
    450,
    scrollY + 440
  );

  text("Lose all your lives and the game is over.", 450, scrollY + 463);

  textSize(21);
  fill(114, 47, 55);

  text("How many dolphins can you feed?", 450, scrollY + 495);

  pop();

  // GOT IT BUTTON
  push();

  rectMode(CENTER);

  fill(255, 195, 105);

  strokeWeight(5);
  stroke(190, 95, 30);

  rect(450, scrollY + 545, 170, 60, 18);

  pop();

  // Got it text
  push();

  textFont(gameFont);
  textAlign(CENTER, CENTER);
  textSize(23);
  fill(190, 95, 30);

  text("Got it!", 450, scrollY + 542);

  pop();
}

function drawTryAgainButton(x, y, hovered) {
  let buttonWidth = 230;
  let buttonHeight = 80;

  let buttonOffset = hovered ? -8 : 0;

  // button halo
  if (hovered) {
    push();
    rectMode(CENTER);
    noStroke();

    fill(255, 255, 255, 35);
    rect(x, y + buttonOffset, buttonWidth + 20, buttonHeight + 20, 22);

    fill(255, 255, 255, 25);
    rect(x, y + buttonOffset, buttonWidth + 35, buttonHeight + 35, 27);

    pop();
  }

  // actual button
  push();
  rectMode(CENTER);
  strokeWeight(6);
  stroke(65, 95, 160);

  if (hovered) {
    fill(145, 175, 245);
  } else {
    fill(170, 195, 250);
  }

  rect(x, y + buttonOffset, buttonWidth, buttonHeight, 18);

  pop();

  // text
  push();
  textFont(gameFont);
  textAlign(CENTER, CENTER);
  textSize(25);
  fill(65, 95, 160);

  text("Try again", x - 20, y + buttonOffset - 3);
  pop();

  push();
  textFont("Arial");
  textSize(55);
  fill(65, 95, 160);
  text("↻", x + 50, y + buttonOffset + 12);
  pop();
}

function drawQuitButton(x, y, hovered) {
  let buttonWidth = 200;
  let buttonHeight = 80;

  let buttonOffset = hovered ? -8 : 0;

  // button halo
  if (hovered) {
    push();
    rectMode(CENTER);
    noStroke();

    fill(255, 255, 255, 35);
    rect(x, y + buttonOffset, buttonWidth + 20, buttonHeight + 20, 22);

    fill(255, 255, 255, 25);
    rect(x, y + buttonOffset, buttonWidth + 35, buttonHeight + 35, 27);

    pop();
  }

  // actual button
  push();
  rectMode(CENTER);
  strokeWeight(6);
  stroke(165, 55, 55);

  if (hovered) {
    fill(245, 125, 125);
  } else {
    fill(245, 150, 150);
  }

  rect(x, y + buttonOffset, buttonWidth, buttonHeight, 18);

  pop();

  // text
  push();
  textFont(gameFont);
  textAlign(CENTER, CENTER);
  textSize(25);
  fill(165, 55, 55);

  text("Quit", x - 20, y + buttonOffset - 3);

  pop();

  // X icon
  push();
  imageMode(CENTER);

  tint(165, 55, 55);

  image(xMark, x + 55, y + buttonOffset - 2);

  noTint();
  pop();
}

function preload() {
  gifIntro = loadImage("assets/ocean_boat_anchored_900x600 (1).gif");
  gifPlay = loadImage("assets/ocean_boat_seagull_900x600 (1).gif");
  dolphin = loadImage("assets/Dolphin.png");
  pinkHeart = loadImage("assets/pink heart.png");
  fullHearts = loadImage("assets/full hearts.png");
  twoHearts = loadImage("assets/two hearts.png");
  oneHeart = loadImage("assets/one heart.png");
  zeroHearts = loadImage("assets/game over hearts.png");
  orangeFish = loadImage("assets/orange fish.png");
  powerUpHeart = loadImage("assets/single heart.png");
  lionfish = loadImage("assets/lionfish.png");
  clock = loadImage("assets/clock.png");
  xMark = loadImage("assets/x.png");

  gameFont = loadFont("assets/DynaPuff-VariableFont_wdth,wght.ttf");

  dolphinSound = loadSound("assets/dolphin sound.mp3");
  heartPUSound = loadSound("assets/heart power up sound.mp3");
  lionfishSound = loadSound("assets/lionfish sound.mp3");
  clockSound = loadSound("assets/clock pu sound.mp3");
  gameOverSound = loadSound("assets/game over sound.mp3");
  splashSound = loadSound("assets/splash sound effect.mp3");
  clickSound = loadSound("assets/click sound.mp3");
  oceanSound = loadSound("assets/ocean sound.mp3");
  backgroundMusic = loadSound("assets/reggae music background.mp3");
}

//Setting variables
function setup() {
  createCanvas(900, 600);

  fullHearts.resize(100, 0);
  twoHearts.resize(100, 0);
  oneHeart.resize(100, 0);
  zeroHearts.resize(100, 0);

  livesLeftImg = fullHearts;

  dolphin.resize(90, 0);
  orangeFish.resize(45, 0);
  powerUpHeart.resize(50, 0);
  pinkHeart.resize(35, 0);
  clock.resize(70, 0);
  lionfish.resize(80, 0);
  xMark.resize(35, 0);

  jumpObjectX = random(100, 650);
  jumpObjectY = random(170, 400);

  jumpObjectStartX = jumpObjectX;
  jumpObjectStartY = jumpObjectY;

  jumpObjectEndX = jumpObjectX + 150;
  jumpObjectEndY = jumpObjectStartY;

  jumpObjectJump = 0;
  jumpObjectState = "waiting";
  jumpObjectTimer = 0;

  jumpObject = dolphin;
  jumpObjectDir = 1;
}

function draw() {
  if (gameState == "intro") {
    image(gifIntro, 0, 0);

    // Update hover states
    if (!introExiting && !howToPlayOpen) {
      playHovered = isMouseOverPlayButton(introPlayX, playButtonY);

      howToHovered = isMouseOverHowToButton(introHowToX, howToButtonY);
    }

    // Intro exit animation
    if (introExiting) {
      introExitTimer++;

      // Title slides upward
      introTitleY -= 8;

      // Start slides LEFT
      introPlayX -= 12;

      // How To Play slides RIGHT
      introHowToX += 12;

      // End transition
      if (introExitTimer >= introTransitionDuration) {
        gameState = "playing";

        introExiting = false;
        introExitTimer = 0;

        // Reset intro positions for next time
        introTitleY = 110;
        introPlayX = 300;
        introHowToX = 600;
      }
    }

    // Title
    push();
    textFont(gameFont);
    textSize(100);
    fill(255, 204, 0);
    textAlign(CENTER);
    text("Mira el Delfín", 450, introTitleY);
    pop();

    // Buttons
    drawPlayButton(introPlayX, playButtonY, playHovered);

    drawHowToButton(introHowToX, howToButtonY, howToHovered);

    // How-to-play scroll
    if (howToPlayOpen) {
      updateScroll();
      drawScroll();
    }
  }

  if (gameState == "playing") {
    //background
    image(gifPlay, 0, 0);

    sunsetTint();

    topStats();

    updateSplash();
    drawSplash();

    if (isSlowMo) {
      slowMoTimer++;
      if (slowMoTimer >= 300) {
        isSlowMo = false;
        slowMoTimer = 0;
        tempSpeed = currSpeed;
      } else {
        push();
        textSize(30);
        textAlign(LEFT, TOP);
        textFont(gameFont);
        fill(4, 55, 242);
        text("Slow mode 0:0" + ceil((300 - slowMoTimer) / 60), 271, 0);
        pop();
      }
    } else {
      tempSpeed = currSpeed;
    }

    //jump object behavior
    if (jumpObjectState == "waiting") {
      jumpObjectTimer = jumpObjectTimer + 1;

      if (jumpObjectTimer >= 180 / currSpeed) {
        chooseJumpObject();

        //initalize jumping
        jumpObjectState = "jumping";
        jumpObjectJump = 0;

        if (random() >= 0.5) {
          jumpObjectDir = 1;
        } else {
          jumpObjectDir = -1;
        }

        if (jumpObjectDir == -1) {
          jumpObjectX = random(250, 500);
        }
        jumpObjectStartX = jumpObjectX;
        jumpObjectStartY = jumpObjectY;

        jumpObjectEndX = jumpObjectStartX + 150 * jumpObjectDir;
        jumpObjectEndY = jumpObjectStartY;

        createSplash(jumpObjectStartX, jumpObjectStartY);
        splashSound.play();
      }
    }

    if (jumpObjectState == "jumping") {
      jumpObjectJump = jumpObjectJump + 0.01 * tempSpeed;

      if (jumpObjectJump >= 1) {
        jumpObjectJump = 1;

        let landingX = lerp(jumpObjectStartX, jumpObjectEndX, jumpObjectJump);

        let landingY = jumpObjectStartY;

        createSplash(landingX, landingY);
        splashSound.play();

        if (jumpObject == dolphin) {
          livesLeft--;
        }

        checkLives();

        jumpObjectState = "waiting";
        jumpObjectTimer = 0;

        jumpObjectX = random(100, 600);
        jumpObjectY = random(170, 400);
      }
    }

    //jump object appearance
    if (jumpObjectState == "jumping") {
      let jumpX = lerp(jumpObjectStartX, jumpObjectEndX, jumpObjectJump);
      let jumpHeight = sin(jumpObjectJump * PI) * 150;
      let jumpY = jumpObjectStartY - jumpHeight;

      push();
      imageMode(CENTER);
      angleMode(DEGREES);
      translate(jumpX, jumpY);
      if (jumpObject == lionfish || jumpObject == powerUpHeart) {
        rotate(
          map(jumpObjectJump, 0, 1, -25 * jumpObjectDir, 5 * jumpObjectDir)
        );
      } else {
        rotate(
          map(jumpObjectJump, 0, 1, -25 * jumpObjectDir, 70 * jumpObjectDir)
        );
      }
      if (jumpObjectDir == -1) {
        scale(-1, 1);
      }
      image(jumpObject, 0, 0);
      pop();
    }

    //feedback animation
    if (feedbackType != "") {
      feedbackTimer++;

      feedbackAlpha = map(feedbackTimer, 0, 30, 255, 0);

      if (feedbackType == "heart") {
        feedbackY -= 0.5;
      }

      push();
      imageMode(CENTER);
      tint(255, feedbackAlpha);

      if (feedbackType == "heart") {
        image(pinkHeart, feedbackX, feedbackY);
      } else if (feedbackType == "xMark") {
        image(xMark, feedbackX, feedbackY);
      }

      pop();

      if (feedbackTimer >= 30) {
        feedbackType = "";
        feedbackTimer = 0;
        feedbackAlpha = 0;
      }
    }

    //cursor
    if (fishBlink) {
      fishBlinkTimer++;
      if (fishBlinkTimer >= 5) {
        fishBlink = false;
        fishBlinkTimer = 0;
      }
    }
    push();
    imageMode(CENTER);
    if (fishBlink == false) {
      image(orangeFish, mouseX, mouseY);
    }
    pop();
  }

  if (gameState == "game over") {
    image(gifIntro, 0, 0);

    // Update hover states
    tryAgainHovered = isMouseOverHowToButton(tryAgainButtonX, tryAgainButtonY);

    quitHovered = isMouseOverHowToButton(quitButtonX, quitButtonY);

    // Stats
    topStats();

    // Game Over title
    push();
    textFont(gameFont);
    textSize(100);
    fill(114, 47, 55);
    textAlign(CENTER);
    text("Game Over!", 450, introTitleY + 5);
    pop();

    // Buttons
    drawTryAgainButton(tryAgainButtonX, tryAgainButtonY, tryAgainHovered);

    drawQuitButton(quitButtonX, quitButtonY, quitHovered);
  }
}

function mouseClicked() {
  if (gameState == "intro") {
    // START BUTTON
    if (!howToPlayOpen && playHovered && !introExiting) {
      clickSound.play();

      backgroundMusic.setVolume(0.15);

      if (!backgroundMusic.isPlaying()) {
        backgroundMusic.loop();
      }

      if (!oceanSound.isPlaying()) {
        oceanSound.loop();
      }
      introExiting = true;
      introExitTimer = 0;
    }

    // HOW TO PLAY BUTTON
    else if (!howToPlayOpen && howToHovered && !introExiting) {
      clickSound.play();
      howToPlayOpen = true;
    }

    // CLOSE HOW TO PLAY
    // GOT IT BUTTON
    else if (howToPlayOpen) {
      if (
        mouseX > 365 &&
        mouseX < 535 &&
        mouseY > scrollY + 515 &&
        mouseY < scrollY + 575
      ) {
        clickSound.play();
        howToPlayOpen = false;
        scrollY = 650;
      }
    }

    return;
  } else if (gameState == "playing" && jumpObjectState == "jumping") {
    let jumpX = lerp(jumpObjectStartX, jumpObjectEndX, jumpObjectJump);

    let jumpHeight = sin(jumpObjectJump * PI) * 150;

    let jumpY = jumpObjectStartY - jumpHeight;

    let distToJumpObject = dist(mouseX, mouseY, jumpX, jumpY);

    let clickRadius;

    if (jumpObject == dolphin) {
      clickRadius = 60;
    } else if (jumpObject == lionfish) {
      clickRadius = 50;
    } else if (jumpObject == powerUpHeart) {
      clickRadius = 40;
    } else if (jumpObject == clock) {
      clickRadius = 45;
    }

    if (distToJumpObject < clickRadius) {
      if (jumpObject == dolphin) {
        dolphinSound.play();
        fishBlink = true;
        fishBlinkTimer = 0;

        feedbackType = "heart";
        feedbackX = jumpX;
        feedbackY = jumpY - 60;
        feedbackTimer = 0;
        feedbackAlpha = 255;

        if (gameScore == bestScore) {
          gameScore++;
          bestScore++;
        } else if (gameScore < bestScore) {
          gameScore++;
        }

        if (gameScore % 5 == 0) {
          currSpeed = currSpeed * 1.25;
        }
      } else if (jumpObject == lionfish) {
        lionfishSound.play();

        fishBlink = true;
        fishBlinkTimer = 0;

        livesLeft--;

        // Only show the X if the player is still alive
        if (livesLeft > 0) {
          feedbackType = "xMark";

          feedbackX = jumpX;
          feedbackY = jumpY - 60;
          feedbackTimer = 0;
          feedbackAlpha = 255;
        } else {
          // Make sure no old X appears on the game over screen
          feedbackType = "";
          feedbackTimer = 0;
          feedbackAlpha = 0;
        }

        checkLives();
      } else if (jumpObject == powerUpHeart) {
        heartPUSound.play();

        if (livesLeft < 3) {
          livesLeft++;
        }
      } else if (jumpObject == clock) {
        clockSound.play();

        slowMoTimer = 0;
        isSlowMo = true;
        tempSpeed = currSpeed * 0.5;
      }

      jumpObjectState = "waiting";
      jumpObjectTimer = 0;

      jumpObjectX = random(100, 600);
      jumpObjectY = random(170, 400);
    }
  } else if (gameState == "game over") {
    // TRY AGAIN
    if (tryAgainHovered) {
      clickSound.play();

      gameState = "playing";

      if (!oceanSound.isPlaying()) {
        oceanSound.loop();
      }

      livesLeft = 3;
      gameScore = 0;
      currSpeed = 1;

      jumpObjectState = "waiting";
      jumpObjectTimer = 0;
      jumpObjectJump = 0;

      jumpObject = dolphin;

      jumpObjectDir = 1;

      feedbackType = "";
      feedbackTimer = 0;
      feedbackAlpha = 0;

      fishBlink = false;
      fishBlinkTimer = 0;

      isSlowMo = false;
      slowMoTimer = 0;
      tempSpeed = 1;

      jumpObjectX = random(100, 600);
      jumpObjectY = random(170, 400);

      splashDrops = [];
    }

    // QUIT
    else if (quitHovered) {
      clickSound.play();
      oceanSound.stop();

      gameState = "intro";

      // Reset intro screen positions
      introExiting = false;
      introExitTimer = 0;

      introTitleY = 110;
      introPlayX = 300;
      introHowToX = 600;

      howToPlayOpen = false;
      scrollY = 650;

      // Reset game
      livesLeft = 3;
      gameScore = 0;
      currSpeed = 1;

      jumpObjectState = "waiting";
      jumpObjectTimer = 0;
      jumpObjectJump = 0;

      jumpObject = dolphin;

      jumpObjectDir = 1;

      feedbackType = "";
      feedbackTimer = 0;
      feedbackAlpha = 0;

      fishBlink = false;
      fishBlinkTimer = 0;

      isSlowMo = false;
      slowMoTimer = 0;
      tempSpeed = 1;

      splashDrops = [];
    }
  }
}
