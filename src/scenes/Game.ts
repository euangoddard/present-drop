import { Scene } from "phaser";

export class Game extends Scene {
  private chimneyGroup!: Phaser.GameObjects.Group;
  private presentGroup!: Phaser.Physics.Arcade.Group;
  private arrow!: Phaser.GameObjects.Image;

  constructor() {
    super("Game");
  }

  preload() {
    this.load.setPath("assets");

    this.load.image("background", "bg.jpg");

    this.load.image("down-arrow", "down-arrow.png");
    this.load.image("present", "present.png");
    this.load.image("chimney", "chimney.png");
    this.load.image("square", "square.png");
  }

  create() {
    this.add.image(200, 300, "background");
    this.setupArrow();
    this.setupChimneys();
    this.setupPresents();
  }

  private setupArrow(): void {
    this.arrow = this.add.image(20, 40, "down-arrow");
    this.add.tween({
      targets: this.arrow,
      x: 380,
      duration: 2000,
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
      key: "chimney",
      frame: 0,
      repeat: 7,
      setXY: { x: 25, y: 575, stepX: 50 },
      setScale: { x: 0.1, y: 0.1 },
    });
  }

  private setupPresents(): void {
    this.presentGroup = this.physics.add.group({
      defaultKey: "present",
      maxSize: 7,
      collideWorldBounds: true,
    });

    const dividers = this.physics.add.staticGroup({});
    dividers.createMultiple({
      key: "square",
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
      (present, chimney) => {
        present.setVelocity(0, 0);
        present.setImmovable(true);
        present.setCollideWorldBounds(false);
        present.setOrigin(0.5, 0.5);
        this.add.tween({
          targets: present,
          scaleX: 0.5,
          scaleY: 0.5,
          duration: 200,
          alpha: 0,
          onComplete: () => {
            present.destroy();
          },
        });
        // TODO: Mark chimney as hit
      }
    );
  }

  private dropPresent(): void {
    const present = this.presentGroup.create(this.arrow.x, this.arrow.y);
    present.setScale(0.05);
    present.setCollideWorldBounds(true);
    present.setBounce(0.5, 0.5);
    present.setCircle(256);
  }
}
