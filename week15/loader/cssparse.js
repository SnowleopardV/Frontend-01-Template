const css = require("css");
let rules = [];

module.exports = {
    computeCSS,
    addRules
}

// 一 当解析到style标签时,使用css模块的parse解析CSS文本
// 1. 使用css的parse将css文本转换成ast树
// 2. 将ast树的rules规则添加到全局变量rules中
function addRules(element) {
    let ast = css.parse(element.textNode);
    rules.push(...ast.stylesheet.rules);
}

// 二 当解析完一个标签时, 就开始计算CSS规则
// 1. 将rules中的选择器对标签进行匹配
//   1. 如果没有匹配上,则进入下一个规则的匹配
//   2. 匹配上, 则进行父级标签和父级选择器的匹配
function computeCSS (element, stack) {
    let elements = stack.slice().reverse();
    for (let rule of rules) {
        let selectors = rule.selectors[0].split(" ").reverse();
        if (!match(selectors[0], elements[0])) {
           // 1. 没匹配上,直接跳过
            continue;
        }
        //  2. 匹配上了, 如body div #myid, 匹配上了<img id="myid"/>
        //    1. 用body div #myid中的div去匹配<img id="myid"/>的父级标签
        //      1. 匹配上则各自继续往上一级 
        //      2. 没有匹配上,则div将匹配<img id="myid"/>的父级的父级标签
        let matched = 1;
        let elementIndex = 1;
        for (let i = matched; i < selectors.length; i++) {
            for (let j = elementIndex; j < elements.length; j++) {
                if (match(selectors[i], elements[j])) {
                    matched ++;
                    elementIndex = j + 1;
                    j = elements.length;
                }
            }
        }
        if (matched == selectors.length) {
            matched = true;
            computeStyle(rule, element)
        }
    }
}

// 三 标签和选择器的匹配规则
// 1. id选择器
// 2. 类选择器
// 3. tag选择器
function match (selector, element) {
    if (selector.charAt(0) == "#") {
        return element.id?("#" + element.id == selector?true:false):false;
    }
    else if (selector.charAt(0) == ".") {
        return element.class?("." + element.class == selector?true:false):false;
    }
    else {
        return element.tagName == selector?true:false
    }
}

// 四 将匹配上的选择器中每一条规则添加到元素的属性上
// 
function computeStyle(rule, element) {
    if (!element.computedStyle) {
        element.computedStyle = {}
    } 
    for (let declaration of rule.declarations) {
        if (!element.computedStyle[declaration.property]) {
            element.computedStyle[declaration.property] = {};
            element.computedStyle[declaration.property].value = declaration.value;
            element.computedStyle[declaration.property].specifity = specifity (rule.selectors[0].split(" "));
        }
        else {
            let sp1 = specifity(rule.selectors[0].split(" "));
            if (compare(sp1, element.computedStyle[declaration.property].specifity) >= 0) {
                element.computedStyle[declaration.property].value = declaration.value;
                element.computedStyle[declaration.property].specifity = sp1;
            }
        }
    }   
    console.log(element)
}

// 五 计算匹配上的选择器的的优先级
//   1. 用一个四元组表示选择器的优先级, [0, 0, 0, 0] 分别表示内联样式, id选择器, class选择器, 其他选择器

function specifity (selectors) {
    let sp = [0, 0, 0, 0];
    for (let selector of selectors) {
        if (selector.charAt(0) == "#") {
            sp[1] += 1;
        }
        else if (selector.charAt(0) == ".") {
            sp[2] += 1;
        }
        else {
            sp[3] += 1;
        }
    }
    return sp
}

// 六 比较选择器的优先级
// 1. 当多个选择器指定同一个属性时, 会进行选择器优先级的计算, 判断具体使用哪个选择器指定的属性生效

function compare (sp1, sp) {
    for (let i = 0; i < sp1.length; i++) {
        if (sp1[0] - sp[0]) 
            return sp1[0] - sp[0];
        if (sp1[1] - sp[1]) 
            return sp1[1] - sp[1]
        if (sp1[2] - sp[2]) 
            return sp1[2] - sp[2]
        if (sp1[3] - sp[3]) 
            return sp1[3] - sp[3]
    }
}