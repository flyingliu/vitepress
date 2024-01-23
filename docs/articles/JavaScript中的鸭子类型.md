# JavaScript中的鸭子类型

  When I see a bird that walks like a duck and swims like a duck and quacks like a duck, I call that bird a duck.
  如果一只鸟走起路来像鸭子，游泳像鸭子，叫起来也像鸭子，那它就可以叫做鸭子 —— James Whitcomb Riley,1849-1916

免责声明：本文仅供娱乐参考，其中部分代码具有相当的迷惑性，不建议在生产环境中使用

## 什么是鸭子类型

搜索引擎搜索，可以得出找到如下文字：

在程序设计中，鸭子类型（英语：Duck typing）是动态类型和某些静态语言的一种对象推断风格。在鸭子类型中，关注的不是对象的类型本身，而是它是如何使用的。支持"鸭子类型"的语言的解释器/编译器将会在解析(Parse)或编译时，推断对象的类型。

简单来说，判断一个对象是不是 X 类型，只要检查它是否具有 X 的特定属性或者方法，即可把它当中 X 类型的对象。
在 JavaScript 中存在不少鸭子类型，下面举几个典型例子：

## ArrayLike 类数组对象

如果一个 JavaScript Object， 他的元素下标是数字，length 也是数字，如字符串、 arguments 等，我们统称这种对象为 类数组对象 (Array-like Object)， typing 表示为：

``` js
interfact ArrayLike<T> {
    [key: string | number]?: T,
    readonly length: number
}
```

判断方法
``` js
const isArrayLike = array => array && typeof array.length === 'number'
```

我们都知道，数组上有 map 、 reduce 等方法，有趣的是：这些方法并不是跟数组严格绑定的。利用 JavaScript 鸭子类型特性，我们可以对数组原型方法以 call 、 apply 调用，使数组原型方法能处理这些数据：

``` js
const arrLike = { 
    '0': 1, 
    '1': 2, 
    '2': 3, 
    length: 3 
}

// [].slice === Array.prototype.slice ，下同
[].slice.call(arrLike) // [1, 2, 3]

[].map.call(arrLike, item => item + 1) // [2, 3, 4]

[].filter.call(arrLike, item => item !== 2) // [1, 3]

[].reduce.call(arrLike, (prev, curr) => prev + curr, 0) // 6

[].map.call('123', Number) // [1, 2, 3]
```

## Iterable 可迭代对象

如果一个对象或者他的原型上具有 Symbol.iterator 方法：
``` js
const iterable = {
    *[Symbol.iterator] () {
        yield 1;
        yield 2;
        yield 3;
    }
};

[...iterable] // [1, 2, 3]
```
其中这个函数叫做迭代器函数。对象通过调用迭代器函数，就能实现拓展运算符 ... 拓展或者 for...of 迭代，我们称这个对象实现了 迭代协议，这个对象为 可迭代对象。

在 ES6 中，Array, String, arguments, Set, Map, FormData 等构造函数的原型上都具有自己的 Symbol.iterator 迭代器函数。上面的 arrLike 可以当作数组处理，但不能被迭代，原因是它没有实现迭代协议，需要对 arrLike 添加迭代器函数：
``` js
arrLike[Symbol.iterator] = function* () {
    let i = 0;
    while (i < this.length) {
        yield this[i];
        i++;
    }
}

[...arrLike] // [1, 2, 3]
```

再比如，有一道面试题，要求你对一个对象使用 for ... of 迭代，其实就是考察你对于迭代协议的理解，你可以把下面的代码甩给面试官：
``` js
const obj = { a: 1, b: 2, c: 3 };
/**** 迭代器实现 ****/
obj[Symbol.iterator] = function* () {
    for (let key in this) {
        if (this.hasOwnProperty(key)) {
                const value = this[key];
                yield [key, value];
        }
    }
}
/*******/
for (let [key, value] of obj) {
    console.log(key, value)
}
```
当然，你可以使用普通函数实现，函数返回的迭代器对象符合下文的 Iterator 类型即可，但是对比上面的代码过于繁琐，不再展示，请移步 迭代协议

可迭代对象 typing 表示：
``` js
interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
}
```
其中，迭代器 Iterator 需要提供 next, return, throw 方法，跟调用生成器函数的返回值相同：
``` js
interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}
```
判断是否为可迭代对象

``` js
const iterable = data => 
    typeof Symbol !== 'undefined' 
    && typeof data[Symbol.iterator] === 'function'
```
## Thenable 对象

我们调用 new Promise(()=>{})时，会返回一个对象，包含 then, catch, finally 等方法。我们把带有 then 函数的方法称作 Thenable 对象，或者 类 Promise 对象 (PromiseLike) 。
这个对象有什么意义？参考如下代码：
``` js
const thenable = {
    then(res) {
        setTimeout(res, 1000)
    }
}

// 1
Promise.resolve()
    .then(()=>thenable)
    .then(()=>console.log('一秒过去'));

// 2
!async function() {
    const sleep = () => thenable

    await sleep();
    console.log('一秒过去');
}();
```
两段语句都能按照预期执行（等待一秒后打印），证明 Promise 判断一个对象是否需要等待其 resolved，仅仅判断它是否有 then 函数即可。是不是非常简单粗暴？

Thenable tying:
``` js
interface Thenable<T> {
    then<T, N = never> (
        resolve: (value: T) => T | Thenable<T> | void,
        reject: (reason: any) => N | Thenable<N> | void
    ): Thenable<T | N>
}
```
判断方法：
``` js
const thenable = fn => fn.then && typeof fn.then === 'function'
```
Entries 对象
对于一个对象 { a: 1, b: 2, c: 3 }，使用 [key, value] 作为元素的二维数组：
``` js
[
    ['a', 1],
    ['b', 2],
    ['c', 3]
]
```
称为 Entries ，Entries 属于上文中的可迭代对象，需要实现可迭代协议，并且不能是原始类型数据（如字符串）
``` js
interface Entries<K,V> {
    [key: number]: [K, V],
    [Symbol.iterator](): Iterator<T>;
}
```
判断方法：
``` js
const isEntries = data => {
    if (typeof data[Symbol.iterator] !== 'function') {
        return false;
    }
    return Object.values(data).every(d => Array.isArray(d) && d.length >= 2)
}
```
## Object.entries 转化

调用 Object.entries 可以将有键值对的对象转化成 Entries
``` js
const entry = Object.entries({ a: 1, b: 2, c: 3 }) // [['a', 1], ['b', 2], ['c', 3]]

const map = new Map()
map.set('a', 1)
map.set('b', 2)
map.set('c', 3)

Object.entries(map) // [['a', 1], ['b', 2], ['c', 3]]

const fd = new FormData()
fd.set('a', 1)
fd.set('b', 2)
fd.set('c', 3)

Object.entries(fd) // [['a', 1], ['b', 2], ['c', 3]]

Object.entries('abc') // [['0','a'],['1','b'],['2','c']]
```
其中，数组、 Map、 Set、 FormData 等引用类型的的原型 prototype 上自带 entries 方法，调用后返回一个 生成器对象 ， 可以使用拓展运算符 ... 展开：
``` js
const arrIterator = ['a', 'b', 'c'].entries();
[...arrIterator] // [['0','a'],['1','b'],['2','c']]

const setIterator = new Set(['a', 'b', 'c']).entries();

[...setIterator] // [['a', 'a'], ['b', 'b'], ['c', 'c']]

const map = new Map();
map.set('a', 1)
map.set('b', 2)
map.set('c', 3)

const mapIterator = map.entries();
[...mapIterator] // [['a', 1], ['b', 2], ['c', 3]]

const fd = new FormData();
fd.set('a', 1)
fd.set('b', 2)
fd.set('c', 3)

const fdIterator = fd.entries(fd);
[...fdIterator] // [['a', 1], ['b', 2], ['c', 3]]
```
注意，因为是生成器对象，一旦迭代完毕，再次调用 next 方法或者拓展运算也不会吐出任何 value 了。

Object.fromEntries 和 Map 构造函数
Object.fromEntries 是 ECMAScript 2019 定义的语法（低版本浏览器不兼容），与 Object.entries 相反，它将 Entries 对象变为 Object
``` js
Object.fromEntries( [['a', 1], ['b', 2], ['c', 3]] ) // { a:1, b:2, c: 3 }
```
对于 FormData 或者 Map 对象，会隐式转化为 Entries
``` js
const fd = new FormData()
fd.set('a', 1)
fd.set('b', 2)
fd.set('c', 3)

Object.fromEntries(fd) // [['a', 1], ['b', 2], ['c', 3]]

const map = new Map()
map.set('a', 1)
map.set('b', 2)
map.set('c', 3)

Object.fromEntries(map) // [['a', 1], ['b', 2], ['c', 3]]
```
注意，如果 key 是 number 类型，转化以后 key 会变为 string，如果 Map 对象中有引用类型（即 Object 不接受的 key 类型），则这个键值对会被忽略。

对于数组，因为会在参数类型推导上产生歧义，所以变成 Entries 或者 Entries 生成器对象才能传入
``` js
Object.fromEntries([1,2,3]) // 报错：元素类型不是以 [key, value] 形式存在

// 只有 [['0', 1], ['1', 2], ['2', 3]] 才符合 Entries 性质
Object.fromEntries([1,2,3].entries()) // [['a', 1], ['b', 2], ['c', 3]]
Object.fromEntries([...[1,2,3].entries()]) // [['a', 1], ['b', 2], ['c', 3]]
```
不少人有这个疑惑：既然 Map 是键值对存储，为什么 Map 构造函数不接受 Object 作为参数？
事实上 Map 构造参数接受的是 Entries 对象，与 Object.fromEntries 参数类型相同：
``` js
const entries = [['a', 1], ['b', 2], ['c', 3]];

new Map(entries) // Map(3) {"a" => 1, "b" => 2, "c" => 3}

const fd = new FormData()
fd.set('a', 1)
fd.set('b', 2)
fd.set('c', 3)

new Map(fd) // Map(3) {"a" => 1, "b" => 2, "c" => 3}

new Map([1,2,3].entries()) // Map(3) {0 => 1, 1 => 2, 2 => 3}
new Map([...[1,2,3].entries()]) // Map(3) {0 => 1, 1 => 2, 2 => 3}
```
看到这里你就会发现 Entries 其实是 Map 的低配版，Entries 经过 Map 封装，就能优地雅遍历、查询、获取元素数量或者删除等操作。

Entries 起到一个中间人的作用，许多以键值对存在的对象，利用 Entries 可以实现键值对对象之间的相互转化。

## 小结
1. 鸭子类型是根据对象行为推导出来的类型，JavaScript 在处理对象时只会判断其对象行为，并不会真正检查他的确切类型。
1. 判断 ArrayLike，只需检查对象中有 length 属性，并且 length 值为数字即可
1. 判断 Iterable，需要检查对象上 Symbol.iterator 属性值是否为一个函数
1. 判断 Thenable，需要检查对象上 then 属性值是否为一个函数
1. Entries 是以 [key, value] 作为元素的二位数组，利用 Entries 的特性，可以使对象 、 Map 、 FormData 等数据结构相互转化。

