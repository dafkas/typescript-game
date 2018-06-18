class Nuke {

    public nuke: HTMLElement;
    public itemPosX: number;
    private itemPosY: number = -400;
    private itemSpeedY: number = 2;
    private itemWidth: number = 40;

    public tank: Tank;

    constructor(parent: HTMLElement) {
        this.nuke = document.createElement('nuke');
        parent.appendChild(this.nuke)

        this.itemPosX = window.innerWidth / 2;
    }

    public move() {
        this.itemPosY += this.itemSpeedY;
        this.nuke.style.transform = `translate(${this.itemPosX}px, ${this.itemPosY}px)`;
    }

    public hitsGround(height: number): boolean {
        if (this.itemPosY > height - 400) {
            this.remove();
            return true;
        }
        return false;
    }

    public remove() {
        this.nuke.remove();
    }
}