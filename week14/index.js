class Carousel {
    constructor () {
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
    }

    get data () {
        return this.attributes.get('data')
    }
    render () {
        let children = this.data.map((url) => {
            let e = <img src = {url} />
            e.addEventListener('dragstart', e => {e.preventDefault()});
            this.children.push(e);
            return e;
        })
        
        let lastposition = 0;
        let position = 0;
        let nextposition;

        let last = null;
        let current = null;
        let next = null;

        let nextPic = () => {
            nextposition = (position + 1) % this.data.length;
            current = children[position];
            next = children[nextposition];
            
            current.style.transform = `translateX(${-536 * position}px)`;
            next.style.transform = `translateX(${536 -536 * nextposition}px)`;
            
            current.style.transition = 'ease 0s';
            next.style.transition = 'ease 0s';
            
            
            setTimeout(function () {
                current.style.transition = '';
                next.style.transition = '';
                current.style.transform = `translateX(${-536 -536 * position}px)`;
                next.style.transform = `translateX(${-536 * nextposition}px)`;
                position = nextposition;
            }, 16);

            setTimeout(nextPic, 2000)
        }
        let container = <div class="carousel">{children}</ div>;
        container.addEventListener('mousedown', (e) => {
            console.log('mousedown')
            let startX = e.clientX;
            lastposition = (position - 1 + this.data.length) % this.data.length;
            nextposition = (position + 1) % this.data.length;

            last = children[lastposition];
            current = children[position];
            next = children[nextposition];

            last.style.transition = "none";
            current.style.transition = "none";
            next.style.transition = "none";

            last.style.transform = `translateX(${-536 -536 * lastposition}px)`;
            current.style.transform = `translateX(${-536 * position}px)`;
            next.style.transform = `translateX(${536 -536 * nextposition}px)`;



            let move = (e) => {
                last.style.transform = `translateX(${e.clientX - startX -536 -536 * lastposition}px)`;
                current.style.transform = `translateX(${e.clientX - startX - 536 * position}px)`;
                next.style.transform = `translateX(${e.clientX - startX + 536 -536 * nextposition}px)`;
            }

            let up = (e) => {
                let offset = 0;
                if (e.clientX - startX > 268) 
                    offset = 1;
                else if (e.clientX - startX < -268)
                    offset = -1;
                
                last.style.transition = "";
                current.style.transition = "";
                next.style.transition = "";

                last.style.transform = `translateX(${536 * offset -536 -536 * lastposition}px)`;
                current.style.transform = `translateX(${536 * offset - 536 * position}px)`;
                next.style.transform = `translateX(${536 * offset + 536 -536 * nextposition}px)`;

                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);

                position = (position - offset + this.data.length) % this.data.length;
            }

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up)
        })

        nextPic();
        return  container;
    }

    setAttribute () {
        this.attributes.set(...arguments)
    }

    mountTo(parent) {
        this.render().mountTo(parent)
    }

    addEventListener() {
        this.root.addEventListener(...arguments)
    }


}

function sleep (time) {
   return new Promise((res) => {setTimeout(() => {res()}, time)})
} 


function create(Cls, attributes, ...children) {
    // console.log(arguments[0], arguments[1]);
    let e;
    if (typeof Cls == "string") {
      e = new Element(Cls);
    } else {
      e = new Cls;
    }
    for (let attr in attributes) {
        // 下面这个两句决定了组件对property和atribute的处理方式
        e.setAttribute(attr, attributes[attr]);
        // e[attr] = attributes[attr]
    }
    for (let child of children) {
      if (typeof child === 'string') {
        let text = new Text(child);
        e.appendChild(text)
      }
      else {
        e.appendChild(child);
      }
    }
    return e;
  }
  
  class Text {
    constructor(text) {
      this.root = document.createTextNode(text);
    }
    mountTo(parent) {
      parent.appendChild(this.root)
    }
  }
  
  
  class Element {
    constructor(type) {
      this.root = document.createElement(type);
      this.children = [];
    }
    // Porperties
    set id (v) {
      this.root.id = v;
    }
    // Attributes
    setAttribute (attr, value) {
      this.root.setAttribute (attr, value);
    }
    //Children
    appendChild (child) {
      this.children.push(child);
    }

    addEventListener() {
        this.root.addEventListener(...arguments)
    }

    get style() {
        return this.root.style;
    }
  
    // lifecycle Moute
    mountTo(parent) {
        console.log(this);
        visit = children => {
            for (let child of children) {
                if (typeof child === 'object' && child instanceof Array) {
                    visit (child);
                    continue;
                }
                child.mountTo(this.root)
            }
        }
        visit(this.children)
        parent.appendChild(this.root);
      
    }
  }
  
let carousel = <Carousel data={[
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
]}></Carousel>

carousel.mountTo(document.body)