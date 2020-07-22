
export class Animation {
    constructor(config) {
        this.object = config.object;
        this.property = config.property;
        this.start = config.start;
        this.end = config.end;
        this.duration = config.duration;
        this.timingFunction = config.timingFunction;
        this.delay = config.delay;
        this.template = config.template;
    }

    valueFromProgression(progression) {
        return this.start + progression * (this.end - this.start);
    }
}

export class ColorAnimation {
    constructor(config) {
        this.object = config.object;
        this.property = config.property;
        this.start = config.start;
        this.end = config.end;
        this.duration = config.duration;
        this.timingFunction = config.timingFunction;
        this.delay = config.delay;
        this.template = config.template;
    }

    valueFromProgression(progression) {
        let r = this.start.r + (this.end.r - this.start.r) * progression;
        let g = this.start.g + (this.end.g - this.start.g) * progression;
        let b = this.start.b + (this.end.b - this.start.b) * progression;
        let a = this.start.a + (this.end.a - this.start.a) * progression;

        return {r, g, b, a}
    }
}