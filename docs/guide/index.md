# home

[[toc]]

::: danger
Danger zone, do not proceed
:::

## 表达式

<ol><li v-for="i in 3">-- {{ i }} --</li></ol>

---

![An image](/images/javascript_prototype.jpeg)


```md
![An image](/images/javascript_prototype.jpeg)
```


---

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |


[articles - 张猛龙碑释文](../articles/张猛龙碑释文.md)

## js

```js{1,4,6-7}
export default { // Highlighted
  data () {
    return {
      msg: `Highlighted!
      This line isn't highlighted,
      but this and the next 2 are.`,
      motd: 'VitePress is awesome',
      lorem: 'ipsum',
    }
  }
}
```
## html

```html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

## css

```css
div {
	background: url(http://csssecrets.io/images/code-pirate.svg)
	            no-repeat bottom right #58a;
	background-origin: content-box;
	
	/* Styling */
	max-width: 10em;
	min-height: 5em;
	padding: 10px;
	color: white;
	font: 100%/1 sans-serif;
}
