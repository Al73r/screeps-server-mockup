type TerrainTypes = 'plain'|'wall'|'swamp';
const TYPES: TerrainTypes[] = ['plain', 'wall', 'swamp'];

export default class Matrix {
    private data: {[coords: string]: TerrainTypes};

    /**
        Constructor
    */
    constructor() {
        this.data = {};
    }

    /**
        Getters
    */
    get(x: number, y: number): TerrainTypes {
        return this.data[`${x}:${y}`] ?? 'plain';
    }

    /**
        Setters
    */
    set(x: number, y: number, value: TerrainTypes): this {
        if (TYPES.includes(value)) {
            this.data[`${x}:${y}`] = value;
        } else {
            throw new Error(`invalid value ${value}`);
        }
        return this;
    }

    /**
        Serialize the terrain for database storage
    */
    serialize(): string {
        let str = '';
        for (let y = 0; y < 50; y += 1) {
            for (let x = 0; x < 50; x += 1) {
                const terrain = this.get(x, y);
                const mask = TYPES.indexOf(terrain);
                if (mask !== -1) {
                    str += mask;
                } else {
                    throw new Error(`invalid terrain type: ${terrain}`);
                }
            }
        }
        return str;
    }

    /**
        Return a string representation of the matrix
    */
    static unserialize(str: string): Matrix {
        const matrix = new Matrix();
        str.split('').forEach((mask, idx) => {
            const x = idx % 50;
            const y = Math.floor(idx / 50);
            const terrain = TYPES[Number(mask)];
            if (terrain == null) {
                throw new Error(`invalid terrain mask: ${mask}`);
            } else if (terrain !== 'plain') {
                matrix.set(x, y, terrain);
            }
        });
        return matrix;
    }
}
