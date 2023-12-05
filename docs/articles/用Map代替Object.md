# 只会用Object？我想推荐你试试Map

> 在JavaScript中，我们经常使用Object对象来实现键值对存储的功能，但是Object有一些缺点和局限性。为了解决这些问题，ES6引入了一个新的数据结构：Map。Map是一个有序的键值对集合，它可以存储任意类型的键和值，并且提供了许多便捷的方法。

> 本文将介绍Map和Object的基本用法和区别，并且说明为什么更推荐大家使用Map。


## 关于性能

> 对于Object来说，增删键值对的性能比较差。而在MDN中，特别提到Map对象对增删键值对的操作进行了优化.

这与JavaScript虚拟机优化对象的方式有关，虚拟机通过假定对象的结构来优化代码执行效率。而Map是专门用于哈希映射的，其中键值是动态且不断变化的。那么至于为什么没有对Object对象增删键进行优化的原因感兴趣的小伙伴可以阅读[这篇文章](https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html)。

## 可迭代性

> 首先，Object没有实现迭代协议，所以for…of语句并不能直接迭代对象。这一点在MDN中也有说明：

## 对象

### 对象的遍历

由于对象不能使用使用for...of，所以我们只能使用for...in来遍历，但是使用for...in的话，会有如下问题：

> 会遍历对象所有的可枚举属性，包括原型链上的属性
> 遍历顺序不一定按照对象属性定义的顺序
> 遍历的索引为字符串类型的数字，并不能直接进行计算

下面就举例说明一下这些问题

1. 会遍历对象所有的可枚举属性，包括原型链上的属性，例如
``` js
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log("Hello, I'm " + this.name);
};

var obj = new Person("Tom");

for (const prop in obj) {
    console.log(prop) // name, sayHello
}
```

可以看到obj除了自身属性name之外，还会遍历到原型链上的属性sayHello。这是因为sayHello是可枚举的。

所以，通常我们需要这样这样写：

``` js
// 方法一：使用hasOwnProperty()
for (var prop in obj) {
  if (obj.hasOwnProperty(prop)) {
    console.log(prop); // name
  }
}

// 方法二：使用Object.keys()
var keys = Object.keys(obj);
for (var i = 0; i < keys.length; i++) {
  console.log(keys[i]); // name
}

```

2. 遍历顺序不一定按照对象属性定义的顺序，例如：
``` js
const obj = {
  a: 1,
  b: 2,
  c: 3,
  "1": "one",
  "2": "two",
  "3": "three"
};

for (var key in obj) {
  console.log(key + ": " + obj[key]);
}
```
这个在谷歌浏览器中会先遍历数字类型的属性，如图：

3. 遍历的索引为字符串类型的数字，并不能直接进行计算，例如
``` js
const obj = {
  1: "one",
  2: "two",
  3: "three"
};

for (const key in obj) {
  console.log(key, typeof key); // 1 string; 2 string; 3 string
}

const arr = [4, 5, 6]
for (const index in arr) {
 console.log(index, typeof index); // 0 string; 1 string; 2 string;
}
```

如果是Map,你可以使用标准的for循环、标准的迭代器和使用解构来获取key和value，例如：

```js
const map1 = new Map();

map1.set('a', 1);
map1.set('b', 2);
map1.set('c', 3);

for (const [key, value] of map1) {
 console.log(key, value) // a 1; b 2; c 3
}
``` 

对于对象，我们还有一个Object.entries() 来做类似的事情，尽管它看起来不是那么流行，但确实可以

```js
const myObject = {a: 1, b: 2, c: 3}

for (const [key, value] of Object.entries(myObject)) {
 console.log(key, value) // // a 1; b 2; c 3
}
```

对于Map，你有更简单的办法直接内置迭代：

```js
// 你可以只便利values，keys

for (const value of myMap.values()) {
 console.log(value)
}

for (const key of myMap.keys()) {
 console.log(key)
}
```

## key

内置key

当我们这样创建一个对象时:

```js
const myMap = {}

myMap.valueOf // => [Function: valueOf]
myMap.toString // => [Function: toString]
myMap.hasOwnProperty // => [Function: hasOwnProperty]
myMap.isPrototypeOf // => [Function: isPrototypeOf]
myMap.propertyIsEnumerable // => [Function: propertyIsEnumerable]
myMap.toLocaleString // => [Function: toLocaleString]
myMap.constructor // => [Function: Object]

```
尽管对象看起来是个空的，你也可以访问这些属性，在MDN中也提到了这个问题：

key的顺序

Map保留了键的顺序，我们可以根据它明确的顺序，直接结构出键值：

```js
const [[firstKey, firstValue]] = myMap
```

实现LRU缓存

用此特性，我们可以实现一个O(1)的LRU缓存：

什么是LRU缓存？

LRU缓存是一种缓存淘汰策略，它的全称是Least Recently Used，意思是最近最少使用。它的原理是认为最近使用过的数据应该是有用的，而很久没用过的数据应该是无用的，所以当缓存满了时，就优先删除那些很久没用过的数据，给新数据腾出空间。
那么我们用Map实现一下LRU缓存。


```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity; // 缓存容量
    this.map = new Map(); // 使用Map存储键值对
  }

  // 获取键对应的值，如果不存在则返回 -1
  get(key) {
    if (this.map.has(key)) {
      let value = this.map.get(key);
      this.map.delete(key); // 删除该键值对
      this.map.set(key, value); // 将该键值对重新插入到Map末尾，表示最近使用过
      return value;
    } else {
      return -1;
    }
  }

  // 设置或更新键和值，如果超过缓存容量，则删除最久未使用的键值对
  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) { // 如果Map中没有该键，且已达到缓存容量上限
      let oldestKey = this.map.keys().next().value; // 获取Map中第一个（最久未使用）的键
      this.map.delete(oldestKey);
    }
    this.map.set(key, value); // 将新的或更新的键值对插入到Map末尾，表示最近使用过 
  }
}
```
key的类型

Map甚至可以做一些对象实现不了的事情：

```js
myMap.set({}, value)
myMap.set([], value)
myMap.set(document.body, value)
myMap.set(function() {}, value)
myMap.set(myDog, value)
```
在Object中，key必须是字符串、数字或者Symbol类型，而在Map中则可以是任何类型，包括函数、对象或者任何原始值。这意味着，在Map中，我们可以用一个Object来作为一个元素的key。
复制与转换

### 复制

你可能会觉得对象更容易复制，比如：

```js
const copied = {...myObject}
const copied = Object.assign({}, myObject)
```
但，实际上Map也容易复制：

```js
const copied = new Map(myMap)
```
同样，你还可以使用structuredClone 深拷贝：

```js
const deepCopy = structuredClone(myMap)
```
### 转换

```js
// Map转对象
const myObj = Object.fromEntries(myMap)
```
// 对象转Map
const myMap = new Map(Object.entries(myObj))

因此，我们可以不使用元组构造映射，可以将它们构造成对象，这样看起来更加美观：

```js
const myMap = new Map([['key', 'value'], ['keyTwo', 'valueTwo']])

// 可以写成
const myMao = new Map(Object.entries({
    key: 'value',
    keyTwo: 'valueTwo'
}))
```
### 序列化与反序列化

现在您可能会说普通对象和数组相对于映射和集合还有最后一个优势 — 序列化：JSON.stringify() 和 JSON.parse()。

但是，当我们使用时，有个第二个参数传null: JSON.stringify(obj, null, 2) ,为什么呢？
它被称为替换器，它允许我们定义任何自定义类型应该如何序列化。所以，我们可以轻松的将Map进行序列化：

```js
JSON.stringify(obj, (key, value) => {
  // Convert maps to plain objects
  if (value instanceof Map) {
    return Object.fromEntries(value)
  }
  return value
})
```

我们还可以用相反的方式将对象转回Map:

```js
JSON.parse(string, (key, value) => {
  if (value && typeof value === 'object') {
    return new Map(Object.entries(value))
  }
  return value
})
```

## 总结

前面我们介绍了JavaScript中Object和Map的区别，包括性能、遍历顺序、key的类型等方面。最后，总结一下什么时候应该用什么：

对于明确定义key的结构化对象，你需要创建一个对象，它们针对快速读写进行了优化
当你需要有任意数量的key，并且经常删除添加key时，你需要使用Map

作者：liangyue
链接：https://juejin.cn/post/7212101192746713144