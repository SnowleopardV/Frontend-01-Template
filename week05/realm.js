var globalObject1 = [
    "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI",
    "encodeURIComponent", "Array", "Date", "RegExp", "Promise", "Proxy", "Map", "WeakMap", "Set", "WeakSet",
    "Function", "Boolean", "String", "Number", "Symbol", "Object", "Error", "EvalError", "RangeError",
    "ReferenceError", "SyntaxError", "TypeError", "URIError", "ArrayBuffer", "SharedArrayBuffer",
    "DataView",
    "Float32Array", "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint16Array",
    "Uint32Array", "Uint8ClampedArray", "Atomics", "JSON", "Math", "Reflect"
];
let globaObjectArray = [];
let data = {
    id: 'globalObject',
    children: []
};

for (p of globalObject1) {
    globaObjectArray.push({
        path: [p],
        object: this[p]
    })
    data.children.push(this[p]);
}

let set1 = new Set();
let current1;
while (globaObjectArray.length) {
    current1 = globaObjectArray.shift();
    console.log(current1.path.join('.'))
    if (set1.has(current1.object)) {
        continue;
    }
    set1.add(current1.object);
    //console.log(current1, current1.object);
    for (let c of Object.getOwnPropertyNames(current1.object)) {
        var propertyDes = Object.getOwnPropertyDescriptor(current1.object, c);
        //console.log(propertyDes);
        if (propertyDes.hasOwnProperty('value') &&
            ((propertyDes.value != null && typeof propertyDes.value == 'object') &&
                propertyDes.value instanceof Object)) {
            globaObjectArray.push({
                path: current1.path.concat(c),
                object: propertyDes.value
            })
        }
        if (propertyDes.hasOwnProperty('get') && typeof propertyDes.get == 'function') {
            globaObjectArray.push({
                path: current1.path.concat(c),
                object: propertyDes.get
            })
        }
        if (propertyDes.hasOwnProperty('set') && typeof propertyDes.set == 'function') {
            globaObjectArray.push({
                path: current1.path.concat(c),
                object: propertyDes.set
            })
        }
    }
}