const EOF = Symbol("EOF"); //EOF end of file 文件结束标识
const CSSParse = require('./cssparse.js');
const layout = require('./layout')

let currentToken = null;
let currentAttribute = null;
let currentText = null;
let stack = [{type: "document", children: []}];


module.exports.parserHTML = function parserHTML(html) {
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF)
}

// 待解析标签 状态
// 1. 解析到<, 表示进入 确定解析标签状态
function data (c) {
    if (c == "<") {
        return tagOpen
    }
    else if (c == EOF) {
        emit ({
            type: "EOF"
        })
    }
    else {
        return data
    }
}

// 解析到 < 后, 进入到确定解析标签名称的状态
//   1. 解析到[a-zA-Z]字符表示已经解析到标签名, 进入tagName 状态
//   2. 解析到空格, 则仍处于tagOpen状态, 如< div>
//   3. 解析到/表示已经解析到了结束标签, 如</进入确定解析标签状态>
function tagOpen (c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "startTag",
            tagName: "",
            textNode: ""
        }
        return tagName(c)
    }
    else if (c.match(/[\t\r\n\f ]/)) {
        return tagOpen
    }
    else if (c == "/") {
        return endTagOpen
    }
    
}

// 解析到 < , 并且后面有[a-zA-Z]的字符, 如<div id="name">my name is jack</div>, 正式进入解析标签状态
//   1. 遇到英文字符, 解析标签名, 仍将处于tagName状态<div>
//   2. 遇到空格进入待解析属性名状态, 即将进入beforeAttributeName状态<div id="name"></div>
//   3. 遇到/, 表示标签是一个自封闭标签, 即将进入selfClosingStartTag状态
//   4. 遇到>, 表示标签名解析结束, 进入data状态
function tagName(c) {
   if (c.match(/^[a-zA-Z]$/)) {
       currentToken.tagName += c.toLowerCase();
       return tagName
   }
   else if (c.match(/[\t\r\n\f ]/)) {
       currentAttribute = {
           attrName: "",
           attrValue: ""
       }
       currentToken.attributes = {};
       return beforeAttributeName
   }
   else if (c == "/") {
       return selfClosingStartTag
   }
   else if (c == ">") {
       return tagEnd;
   }
}

// 进入解析 </ 后面的字符, 如</div>
//   1. 解析到a-zA-Z字符时, 表示组成标签的字符, 进入到tagName状态, 表示处于解析元素标签名称的状态
//   2. 解析到空格时, 如</ div>, 表示仍处于解析结束标签状态endTagOpen, 等待解析字符
function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: "",
            textNode: ""
        }
        return tagName(c)
    }
    else if (c.match(/[\t\r\n\f ]/)) {
        return endTagOpen
    }
}

// 等到解析属性名
//   1. 解析到[a-zA-Z]的字符表示, 进入解析到属性名状态, attributeName
//   2. 解析到空格时, 仍将处于待解析属性名的状态, beforeAttributeName
//   3. 解析到/时, 表示属性解析结束, <img id = "name" /> endTagOpen
function beforeAttributeName(c) {
     if (c.match(/^[a-zA-Z0-9]$/)) {
        return attributeName(c)
    }
    else if (c.match(/[\t\r\n\f ]/)) {
        return beforeAttributeName
    } 
    else if (c == ">") {
        return tagEnd;
    }
    else if (c == "/") {
        return selfClosingStartTag
    }
}

// 解析属性名
function attributeName (c) {
   if (c.match(/^[a-zA-Z0-9]$/)) {
        currentAttribute.attrName += c;
        return attributeName
    }
    else if (c == "=") {
        return beforeAttributeValue
    }
}

// 等待解析属性值
function beforeAttributeValue (c) {
    if (c.match(/[\t\r\n\f ]/)) {
        return beforeAttributeValue
    }
    else if (c.match(/[\"\']/)) {
        return AttributeValue
    }
    else if (c.match(/^[a-zA-Z0-9]$/)) {
        return AttributeValue(c)
    }
}

function AttributeValue (c) {
    if (c.match(/[\"\']/)) {
        return AttributeValue
    }
    else if (c.match(/^[a-zA-Z0-9]$/)) {
        currentAttribute.attrValue += c;
        return AttributeValue
    }
    else if (c.match(/[\t\r\n\f ]/)) {
        if (currentAttribute.attrName == "id" || currentAttribute.attrName == "class") {
            currentToken[currentAttribute.attrName] = currentAttribute.attrValue;
        } else {    
            currentToken.attributes[currentAttribute.attrName] = currentAttribute.attrValue;
        }
        currentAttribute = {
            attrName: "",
            attrValue: ""
        }
        return beforeAttributeName
    }
    // 解析属性时遇到 > 表示属性计算结束, 如<div id="name"></div>
    else if (c == ">") {
        if (currentAttribute.attrName == "id" || currentAttribute.attrName == "class") {
            currentToken[currentAttribute.attrName] = currentAttribute.attrValue;
        } else {    
            currentToken.attributes[currentAttribute.attrName] = currentAttribute.attrValue;
        }
        currentAttribute = {
            attrName: "",
            attrValue: ""
        }
        return tagEnd;
    }
    // 解析属性时遇到/ 表示是自封闭标签, 进入endTagOpen如<img id="name"/>
    else if (c == "/") {
        if (currentAttribute.attrName == "id" || currentAttribute.attrName == "class") {
            currentToken[currentAttribute.attrName] = currentAttribute.attrValue;
        } else {    
            currentToken.attributes[currentAttribute.attrName] = currentAttribute.attrValue;
        }
        currentAttribute = {
            attrName: "",
            attrValue: ""
        }
        return selfClosingStartTag 
    }
}

// 自封闭标签
// 1. 如果解析到 > 表示自封闭标签解析完成, 进入tagEnd状态
function selfClosingStartTag(c) {
    if (c == ">") {
        currentToken.isSelfClosing = true;
        emit(currentToken)
        return tagEnd;
    }
}

// 标签结束状态
// 1. 如果当前为自封闭标签, 则进入data状态, 等待解析下一个标签
// 2. 如果当前为文档结束标签, 表示文档已经解析完成,进入data状态
// 3. 其他情况则开始解析标签内的文本信息textNode
function tagEnd(c) {
    if (currentToken.isSelfClosing) {
        return data
    }
    else if (c == EOF) {
        emit(currentToken);
        return data
    }
    return textNode;
}

// 1. 解析标签内 内容文本
//    1. 如果遇到 < ,表示textNode解析结束, 进入下一个标签解析状态tagOpen
//    2. 如果当前为起始标签, 会记录当前解析到的文本, 作为currentToken的属性,添加到currentToken中
function textNode(c) {
    if (c == "<") {
        emit(currentToken);
        currentToken.textNode = ""
        return tagOpen
    }
    if (currentToken.type == "startTag") {
        currentToken.textNode += c;
    }
    return textNode
}

// emit 
// 1. 从栈stack中, 获取到最后一个元素, 并记录为top
// 2. 判断传进来的token是起始标签还是结束标签
//    1 token为起始标签
//        1. 将创建一个element, element保存type, children, attributes, tagNmae, textNode等信息
//        2. 将elemtn添加到top的chilredn中
//        3. 如果是非自闭合标签,那需要将这个element push到stack中, 用来匹配后面的结束标签
//        4. 如果是style标签,需要解析CSS规则
//        5. 计算标签的CSS规则
//    2.token为结束标签
//        1. 判断标签名是否和top的标签相同
//            1. 不相同, 抛出错误
//            2. 相同, 表示结束标签能和起始标签匹配上, 然后从stack中移除top
function emit (token) {
    let top = stack[stack.length - 1];
    // 起始标签
    if (token.type == "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: token.attributes?token.attributes:{},
            tagName: token.tagName,
            textNode: token.textNode,
            isSelfClosing: token.isSelfClosing?token.isSelfClosing:false
        }
        if (token.id) {
            element.id = token.id
        }
        if (token.class) {
            element.class = token.class
        }
        // style标签
        if (element.tagName == "style") {
            // 使用css.parse解析CSS文本
            CSSParse.addRules(element)
        }
        // 计算标签的CSS规则
        stack.push(element);
        CSSParse.computeCSS(element, stack);
        top.children.push(element);
        if (element.isSelfClosing) {
            stack.pop();
        }
    }
    // 结束标签
    else if (token.type == "endTag") {
        if (token.tagName != top.tagName) {
            throw new Error("结束标签和起始标签不匹配");
            return;
        }
        Layout.layout(top);
        stack.pop();
    }
}


// 解析后的结果
// { 
//     type: 'startTag',
//     tagName: 'html',
//     textNode: '  ',
//     attributes: { width: '100' } 
// }
// { 
//     type: 'startTag',
//     tagName: 'head',
//     textNode: '      ',
//     attributes: { height: '"300"', width: '"600"' } 
// }
// { 
//     type: 'startTag',
//     tagName: 'style',
//     textNode:
//    '  body div #myid{\n      width:100px;\n      background-color: #ff5000;\n  }\n  body div img{\n      width:30px;\n      background-color: #ff1111;\n  }\n      ' 
// }
// {  
//     type: 'endTag', 
//     tagName: 'style', 
//     textNode: '' }
// { 
//     type: 'endTag', 
//     tagName: 'head', 
//     textNode: '' 
// }
// { 
//     type: 'startTag', 
//     tagName: 'body', 
//     textNode: '      ' }
// { 
//     type: 'startTag', 
//     tagName: 'div', 
//     textNode: '          ' 
// }
// { 
//     type: 'endTag', 
//     tagName: 'div', 
//     textNode: '' 
// }
// { 
//     type: 'endTag', 
//     tagName: 'body', 
//     textNode: '' 
// }
//{ 
//     type: 'endTag', 
//     tagName: 'html', 
//     textNode: '' 
// }