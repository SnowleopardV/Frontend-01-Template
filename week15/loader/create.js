export function create(Cls, attributes, ...children) {
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
  
  export  class Text {
    constructor(text) {
      this.root = document.createTextNode(text);
    }
    mountTo(parent) {
      parent.appendChild(this.root)
    }
  }
  
  
  export  class Element {
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
        let visit = children => {
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