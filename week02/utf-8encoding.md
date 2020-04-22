# UTF-8 Encoding
## ASCII字符的UTF-8编码
- 使用codePointAt()获取ASCII字符的码点
- 使用toString(16)转换成16进制的UTF-8编码

## 非ASCII字符的UTF-8编码
- 使用codePointAt()获取非ASCII字符的码点
- 使用toString()将码点转换成2进制(此时为15位), 并在2进制前补0
- 因为UTF-8使用3个字符表示非ASCII码的字符
  1.第一个字符的二进制为控制位1110 + 补0后的二进制前4位
  2.第二个字符的二进制为控制位10+补0后的二进制的第5位-第10位
  2.第二个字符的二进制为控制位10+补0后的二进制的第11位-第16位
  4.将这3个二进制的结果转为16进制

function UTF8_Encoding(string) {
    var array = new Array();
    for (var i = 0; i < string.length; i++) {
        if(string.codePointAt(i) < 128) {
            array.push(string.codePointAt(i).toString(16));
        }
        else {
            var codePointBinary = "0" + string.codePointAt(i).toString(2);
            array.push(
                parseInt(
                    "1110" + codePointBinary.substr(0, 4),2
                ).toString(16)
            );
            array.push(
                parseInt(
                    "10" + codePointBinary.substr(4, 6),2
                ).toString(16)
            );
            array.push(
                parseInt(
                    "10" + codePointBinary.substr(10, 6),2
                ).toString(16)
            );
        }
    }
    return array;
}