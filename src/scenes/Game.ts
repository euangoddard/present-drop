import { Scene } from "phaser";

const enum ImageKeys {
  Background = "background",
  DownArrow = "down-arrow",
  Present = "present",
  Chimney = "chimney",
  Square = "square",
}

const enum TextKeys {
  Remaining = "remaining",
  Score = "score",
}

interface Texts {
  [TextKeys.Remaining]: Phaser.GameObjects.Text;
  [TextKeys.Score]: Phaser.GameObjects.Text;
}

const chimneyConfig = { x: 25, y: 575, stepX: 50 } as const;

const defaultConfig = {
  presents: 8,
  fontFamily: "Rubik Mono One",
} as const;

export class Game extends Scene {
  private chimneyGroup!: Phaser.GameObjects.Group;
  private presentGroup!: Phaser.Physics.Arcade.Group;
  private arrow!: Phaser.GameObjects.Image;
  private texts!: Texts;
  private isRestarting = false;

  private readonly chimneyHits = [0, 0, 0, 0, 0, 0, 0, 0];
  private remainingPresents: number = defaultConfig.presents;

  private get score(): number {
    return this.chimneyHits.filter((hits) => !!hits).length;
  }

  private get collidedPresents(): number {
    return this.chimneyHits.reduce((acc, hits) => acc + hits, 0);
  }

  constructor() {
    super("Game");
  }

  preload() {
    this.load.setPath("assets");

    this.load.image(ImageKeys.Background, "bg.jpg");

    this.load.image(ImageKeys.DownArrow, "down-arrow.png");
    this.load.image(ImageKeys.Present, "present.png");
    this.load.image(ImageKeys.Chimney, "chimney.png");
    this.load.image(ImageKeys.Square, "square.png");
  }

  create() {
    this.add.image(200, 300, ImageKeys.Background);
    this.setupArrow();
    this.setupChimneys();
    this.setupPresents();
    this.createInfoElements();
  }

  private setupArrow(): void {
    this.arrow = this.add.image(20, 40, ImageKeys.DownArrow);
    this.add.tween({
      targets: this.arrow,
      x: 380,
      duration: 1600,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
    });
    const handler = this.dropPresent.bind(this);
    this.input.on("pointerdown", handler);
    const spaceBar = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    spaceBar.on("down", handler);
  }

  private setupChimneys(): void {
    this.chimneyGroup = this.physics.add.staticGroup({
      key: ImageKeys.Chimney,
      frame: 0,
      repeat: 7,
      setXY: chimneyConfig,
      setScale: { x: 0.1, y: 0.1 },
    });
  }

  private setupPresents(): void {
    this.presentGroup = this.physics.add.group({
      defaultKey: ImageKeys.Present,
      maxSize: defaultConfig.presents,
      collideWorldBounds: true,
    });

    const dividers = this.physics.add.staticGroup({});
    dividers.createMultiple({
      key: ImageKeys.Square,
      frame: 0,
      repeat: 6,
      setXY: { x: 50, y: 550, stepX: 50 },
    });

    for (const divider of dividers.getChildren()) {
      divider.setCircle(8);
    }

    this.physics.add.collider(this.presentGroup, dividers);
    this.physics.add.collider(
      this.presentGroup,
      this.chimneyGroup,
      (present) => {
        this.handlePresentCollision(present);
      }
    );
  }

  private handlePresentCollision(
    present:
      | Phaser.Physics.Arcade.Body
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile
  ): void {
    const { centerX } = present.getBounds();
    const chimneyIndex = Math.floor(centerX / chimneyConfig.stepX);

    present.destroy();

    this.chimneyHits[chimneyIndex] += 1;
    this.setText(TextKeys.Score, `${this.score}`);

    const indicator = this.add
      .image(
        chimneyConfig.x + chimneyIndex * chimneyConfig.stepX,
        chimneyConfig.y - chimneyConfig.stepX,
        ImageKeys.Present
      )
      .setAlpha(0.1)
      .setScale(0.05)
      .setOrigin(0.5, 0.5);

    this.add.tween({
      targets: indicator,
      duration: 250,
      y: chimneyConfig.y,
      alpha: 1,
    });

    if (this.collidedPresents === this.chimneyHits.length) {
      this.showGameOver();
    }
  }

  private dropPresent(): void {
    if (this.remainingPresents === 0 || this.isRestarting) {
      return;
    }
    this.remainingPresents -= 1;
    const present = this.presentGroup.create(this.arrow.x, this.arrow.y);
    present.setScale(0.05);
    present.setCollideWorldBounds(true);
    present.setBounce(0.5, 0.5);
    present.setCircle(256);

    this.setText(TextKeys.Remaining, `${this.remainingPresents}`);
  }

  private createInfoElements(): void {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: "16px",
      color: "#fff",
      fontFamily: defaultConfig.fontFamily,
    };

    this.texts = {
      remaining: this.add.text(30, 13, `${this.remainingPresents}`, style),
      score: this.add.text(380, 13, `${this.score}`, style),
    };

    this.add.image(10, 20, ImageKeys.Present).setScale(0.04);
    this.add.image(362, 20, ImageKeys.Chimney).setScale(0.04);
  }

  private showGameOver(): void {
    this.isRestarting = true;
    this.add
      .text(200, 300, `Game Over\nYou scored ${this.score}`, {
        fontSize: "32px",
        color: "#fff",
        fontFamily: defaultConfig.fontFamily,
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    const playAgain = this.add
      .text(200, 400, "Play again", {
        fontSize: "24px",
        color: "#fff",
        fontFamily: defaultConfig.fontFamily,
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    playAgain.setInteractive();
    playAgain.on("pointerdown", () => {
      for (let i = 0; i < this.chimneyHits.length; i++) {
        this.chimneyHits[i] = 0;
      }
      this.remainingPresents = defaultConfig.presents;

      this.scene.restart();

      setTimeout(() => {
        this.isRestarting = false;
      }, 100);
    });

    this.add.tween({
      targets: playAgain,
      duration: 250,
      scale: 1.1,
      yoyo: true,
      repeat: -1,
    });
  }

  private setText(key: keyof Texts, value: string): void {
    this.texts[key].setText(value);
  }
}
