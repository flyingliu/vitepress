# 删除对象中值为 null 或者 undefined 的属性



```js
const removeNullUndefined = (obj) => 
  Object.entries(obj).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
```

```js
const removeNullUndefined = (obj) =>
  Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
```

```js
const removeNullUndefined = (obj) => 
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
```