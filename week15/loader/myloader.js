let parserHTML = require("./htmlparse.js");
module.exports = function (source) {
    let tree = parserHTML(source);
    console.log(tree, tree.children[0]);
    let template = null;
    let script = null;
    let style = null;
    let createCode = "";
    for (let node of tree.children) {
        if (node.tagName == "template") {
            template = node.children[0]
        }
        else if (node.tagName == "script") {
            script = node
        }
        else if (node.tagName == "style") {
            style = node
        }
    }

    let visit = node => {
        if (node.type == 'text') 
            return JSON.stringify(node.textNode);
        let children = node.children.map(node => visit(node))
        return `create("${node.tagName}", ${JSON.stringify(node.attributes)}, ${children})`
    }
    

    let r =  `
        import {create, Element, Text}  from "./create.js";
        class Carousel {
            render() {
                return ${visit(template)}
            }
            mountTo(parent) {
                this.render().mountTo(parent)
            }
        }
        let c = new Carousel;
        c.mountTo(document.body)
    `
    console.log(r)
    return r
}


