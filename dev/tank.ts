class Tank {
    private sprite: HTMLElement;
    private gasBar: HTMLElement;

    public gasBarWidth: number = 80;

    public positionX: number;
    public positionY: number;
    public side: number;
    private velocityX: number = 0;
    private velocityY: number = 0;
    private maxVelocityYUp: number = -20;
    private maxVelocityYDown: number = 15;

    private minWidth: number = 0;

    private isMovingHorizontal: boolean = false;

    private frictionFactorX: number = 0.95;
    private gravity: number = 1;

    private forceX: number = 3;
    //    private ammo: Ammo;
    private activeWeaponStrategy: WeaponStrategy

    private rifle: Rifle;
    private rocketLauncher: RocketLauncher;

    public bullets: Array<Bullet> = [];

    public parent: HTMLElement;
    private levelWidth: number;

    public showAmmo: boolean = false;

    constructor(parent: HTMLElement, levelWidth: number) {
        this.sprite = document.createElement("tank");
        this.gasBar = document.createElement("gasBar")
        // Set default position.
        this.levelWidth = levelWidth;
        this.positionX = levelWidth / 2;
        this.positionY = 200;
        this.side = 1;
        this.parent = parent;
        // Place sprites at position.
        this.sprite.style.transform = "translate(" + this.positionX + "px, " + this.positionY + "px)";
        parent.appendChild(this.sprite);
        this.sprite.appendChild(this.gasBar);
        this.sprite.classList.add('tank')
        setInterval(() => {
            if (this.gasBarWidth > 1) {
                console.log('mined')
                this.gasBarWidth--;
                this.gasBar.style.width = this.gasBarWidth + 'px';
            }
        }, 1000);

        this.rifle = new Rifle(this, this.parent, this.side);
        this.rocketLauncher = new RocketLauncher(this, this.parent, this.side);
        this.activeWeaponStrategy = this.rifle;

        // Add key listeners to drive and brake.
        document.addEventListener("keydown", (e) => {
            switch (e.keyCode) {
                case 37:
                    this.isMovingHorizontal = true;
                    this.velocityX = -this.forceX;
                    this.side = -1
                    break;
                case 39:
                    this.isMovingHorizontal = true;
                    this.velocityX = this.forceX;
                    this.side = 1
                    break;

            }
        });

        document.addEventListener("keyup", (e) => {
            switch (e.keyCode) {
                case 37:
                    this.isMovingHorizontal = false;
                    break;
                case 32:
                    if (this.bullets.length > 0) {
                        console.log('cant fire');
                    } else {
                        this.activeWeaponStrategy.fire(this.side);
                    }
                    this.addNewGas();
                    //this.ammo = new Bullet(this.positionX, this.positionY, this.parent, this.side, this);
                    //this.bullets.push(new Bullet(this.positionX, this.positionY, this.parent, this.side, this));
                    break;
                case 39:
                    this.isMovingHorizontal = false;
                    break;
                case 79:
                    this.activeWeaponStrategy = this.rifle;

                    break;
                case 80:
                    this.activeWeaponStrategy = this.rocketLauncher;
                    break;
            }
        });
    }

    public addVelocityX(amount: number) {
        this.velocityX += amount;
    }

    public addVelocityY(amount: number) {
        this.velocityY += amount;
    }

    public update(maxWidth: number) {

        if (this.positionX > maxWidth) {
            this.positionX = this.minWidth;
        } else if (this.positionX < this.minWidth) {
            this.positionX = maxWidth;
        }
        // When player doesn't give gas x velocity must zero out.
        if (!this.isMovingHorizontal) {
            this.velocityX *= this.frictionFactorX;
        }

        // Apply gravity so car gets pulled down.
        this.velocityY += this.gravity;

        this.capVelocityY();

        // Apply velocity to position, then translate car by position so it moves.
        this.positionX += this.velocityX;
        this.positionY += this.velocityY;

        // Hardcoded border. This is the floor on which the car drives.
        if (this.positionY > 0) {
            this.positionY = 0;
        }

        this.sprite.style.transform = "translate(" + this.positionX + "px, " + this.positionY + "px) scaleX(" + this.side + ") ";
    }

    // Make sure y velocity doesn't get too big.
    private capVelocityY(): void {
        if (this.velocityY < this.maxVelocityYUp) {
            this.velocityY = this.maxVelocityYUp;
        } else if (this.velocityY > this.maxVelocityYDown) {
            this.velocityY = this.maxVelocityYDown;
        }
    }



}