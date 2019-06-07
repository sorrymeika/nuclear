const KEYWORDS = {
    'new': true,
    'this': true,
    'function': true,
    'Function': true,
    'return': true,
    'if': true,
    'else': true,
    '$': true,
    '$data': true,
    'instanceof': true,
    'typeof': true,
    'Object': true,
    'Array': true,
    'Number': true,
    'JSON': true,
    'Math': true,
    'Date': true,
    'parseInt': true,
    'parseFloat': true,
    'encodeURIComponent': true,
    'decodeURIComponent': true,
    'window': true,
    'document': true
};

var RE_MATCH_EXPRESSION = codeRegExp("{...}", 'g');
var RE_EXPRESSION = /'(?:(?:\\{2})+|\\'|[^'])*'|"(?:(?:\\{2})+|\\"|[^"])*"|\/(?:(?:\\{2})+|\\\/|[^/])*\/[img]*|function\s*\((.*?)\)|\bvar\s+('(?:(?:\\{2})+|\\'|[^'])*'|[^;]+);|(?:\{|,)\s*[\w$]+\s*:\s*|([\w$]+)\(|([\w$]+(?:\.[\w$]+|\[[\w$']+\])*)(\()?/g;
var RE_VARS = /([\w$]+)\s*(?:=(?:'(?:\\'|[^'])*'|[^;,]+))?/g;
var RE_VALUE = /^(-?\d+(\.\d+)?|true|false|undefined|null|'(?:\\'|[^'])*')$/;

// var regExpRE = "\/(?:(?:\\{2})+|\\\/|[^\/\r\n])+\/[img]*(?=[\)|\.|,])"
// var RE_STRING = "'(?:(?:\\\\{2})+|\\\\'|[^'])*'|\"(?:(?:\\\\{2})+|\\\\\"|[^\"])*\"";
export const RE_STRING = "'(?:(?:\\\\{2})+|\\\\'|[^'])*'";

export function testRegExp(regExp, val) {
    return (regExp.lastIndex != 0 && (regExp.lastIndex = 0)) || regExp.test(val);
}

export function codeRegExp(exp, flags, deep) {
    if (typeof flags === 'number') {
        deep = flags;
        flags = undefined;
    } else if (!deep) deep = 6;

    var expArr = exp.split('...');
    if (expArr.length < 2) return new RegExp(exp, flags);

    var result = "";
    var lastIndex = expArr.length - 1;
    for (var i = 0; i <= lastIndex; i++) {
        if (i == lastIndex) {
            result += expArr[i].substr(1);
        } else {
            var pre = expArr[i].slice(-1);
            var suf = expArr[i + 1].charAt(0);
            var parenthesisREStart = '\\' + pre + '(?:' + RE_STRING + '|';
            var parenthesisREEnd = '[^\\' + suf + '])*\\' + suf;

            var before = "";
            var after = "";
            for (var j = 0; j <= deep; j++) {
                before += '(?:' + parenthesisREStart;
                after += parenthesisREEnd + ')|';
            }

            result += expArr[i].slice(0, -1) + parenthesisREStart + before + after + parenthesisREEnd;
        }
    }
    return new RegExp(result, flags);
}


/**
 * 将字符串表达式转为function code
 *
 * @example
 * compileExpression('name and age: {user.name+user.age}')
 * compileExpression('user.name+user.age', false)
 * compileExpression('{var a=2,c=2,b;b=name+tt,t$y_p0e=type_$==1?2:1}')
 *
 * @param {string} expression 转化为function的表达式，如：
 * @param {boolean} withBraces 语句中是否包含大括号
 */
export default function compileExpression(expression, withBraces = true) {
    var variables = [];
    var content;

    if (withBraces && !testRegExp(RE_MATCH_EXPRESSION, expression)) {
        content = 'return ' + JSON.stringify(expression);
    } else {
        content = 'try{return ';

        if (withBraces) {
            var exp;
            var start = 0;
            var m;
            var str;
            var firstLoop = true;

            RE_MATCH_EXPRESSION.lastIndex = 0;

            while ((m = RE_MATCH_EXPRESSION.exec(expression))) {
                if (!firstLoop) content += '+';
                else firstLoop = false;

                exp = m[0].slice(1, -1);
                str = compileToString(expression.substr(start, m.index - start));
                str && (content += str + '+');
                content += '('
                    + parseExpression(exp, variables)
                    + ')';
                start = m.index + m[0].length;
            }
            str = compileToString(expression.substr(start));
            str && (content += '+' + str);
        } else {
            content += parseExpression(expression, variables);
        }

        content += ';}catch(e){console.error(e);return \'\';}';

        if (variables.length) {
            content = 'var ' + variables.join(',') + ';' + content;
        }
    }

    return {
        code: content,
        variables: variables
    };
}

function parseExpression(expression, variables) {
    var functionInputs = {};
    var lastPoint;

    return expression.replace(RE_EXPRESSION, function (match, inputs, vars, fn, name, bracket, index) {
        if (inputs) {
            inputs.split(',').forEach(function (param) {
                functionInputs[param.trim()] = true;
            });
        } else if (vars) {
            var mVar;
            while ((mVar = RE_VARS.exec(vars))) {
                variables.push(mVar[1]);
            }
            return vars + ',';
        } else if (expression[index - 1] == '.') {
            return match;
        } else if (fn) {
            return (KEYWORDS[fn] ? fn : '$data.' + fn) + '(';
        } else if (name) {
            return bracket
                ? valueExpression(name.substr(0, lastPoint = name.lastIndexOf('.')), variables, functionInputs) + name.substr(lastPoint) + "("
                : valueExpression(name, variables, functionInputs);
        }
        return match;
    });
}

function compileToString(str) {
    return str ? '\'' + str.replace(/\\/g, '\\\\').replace(/'/g, '\\\'') + '\'' : str;
}

function valueExpression(str, variables, functionInputs) {
    if (RE_VALUE.test(str)) return str;

    var arr = str.split('.');
    var alias = arr[0];
    var code = '';
    var gb = '$data';

    if (!alias || KEYWORDS[alias] || (functionInputs && functionInputs[alias]) || (variables.length && variables.indexOf(alias) !== -1)) {
        return str;
    } else {
        switch (alias) {
            case 'delegate':
                return 'this.' + str;
            case 'util':
                return gb + '.' + str;
            default:
        }
    }

    str = gb + '.' + str;

    var result = [];
    var i;
    for (i = 0; i < arr.length; i++) {
        result[i] = (i == 0 ? gb : result[i - 1]) + '.' + arr[i];
    }
    for (i = 0; i < result.length; i++) {
        code += (i ? '&&' : '') + result[i] + '!=null';
    }
    return '((' + code + ')?' + str + ':"")';
}
