export default class Timeline {
    constructor() {
        this.animations = [];
        this.activeAnimations = [];
        this.runTime = null;
        this.animationID = null;
        this.pauseTime = null;
        this.state = 'inited',
        this.speed = 1;
    }

    tick () {
        this.runTime = Date.now() - this.startTime;
        this.activeAnimations = this.animations.filter(animation => !animation.finished);
        for (let animation of this.activeAnimations) {
            let {
                object,
                property,
                start, 
                end,
                timingFunction,
                template,
                delay,
                duration,
                startTime
            } = animation;
            duration = duration/this.speed;
            let progression = timingFunction( (this.runTime - delay - startTime) / duration);
            if (this.runTime > duration + delay) {
                animation.finished = true;
                progression = 1;
            }
            let value = animation.valueFromProgression(progression);
            if (object instanceof Array) {
                for (let i = 0; i < object.length; i++) {
                    let o = object[i];
                    let k = property[i];
                    o[k] = template(value);
                }
            } else {
                object[property] = template(value);
            }   
        }
        if (this.activeAnimations.length) {
           this.animationID = requestAnimationFrame(() => {this.tick()});
        }
    }

    start() {
        if (this.state != 'inited') 
            return;
        this.startTime = Date.now();
        this.state = 'playing';
        this.tick();
    }

    add(animation, startTime) {
        this.animations.push(animation);
        animation.finished = false;
        if (this.state == 'playing')
            animation.startTime = startTime || Date.now() - this.startTime
        else 
            animation.startTime = startTime || 0;

        console.log(animation.startTime)
    }

    pause() {
        if (this.animationID && this.state == "playing") {
            this.pauseTime = Date.now();
            this.state = 'paused'
            cancelAnimationFrame(this.animationID)
        }
    }
    resume() {
        if (this.state != 'paused') 
            return;
        this.state = 'playing';
        this.startTime = Date.now() - (this.pauseTime - this.startTime);
        this.tick();
    }

    restart() {
        this.pause();
        this.startTime = Date.now();
        this.state = 'playing';
        for (let animation of this.animations) {
            animation.finished = false;
        }
    }

    fastforward() {
        this.speed = (this.speed) % 3 + 1
    }
}

