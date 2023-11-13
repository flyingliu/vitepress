# 备份文件用法

JS数据结构之---双向链表

链接：https://juejin.cn/post/7231842222781071421
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


```js

class DoublelinkList {
  constructor() {
    this.head = null; //头指针，指向第一个链表节点
    this.tail = null; //尾指针，指向最后一个链表节点
    this.length = 0; //链表的长度
  }
    
  //创建双向链表节点的方法
  createNode(data) {
    return {
      data,
      next: null,
      tail: null
    }
  }
  
  //方便查看链表的结构，forwardString、reverseString、toString 方法
  forwardString() {
    // 1.定义两个变量
    let current = this.head
    let res = ""

    // 2.循环获取链表中所有的元素
    while (current) {
        res += "," + current.data
        current = current.next
    }

    // 3.返回最终结果
    return res.slice(1)
  }

  reverseString() {
    let current = this.tail
    let res = ""
    
    while (current) {
        res += "," + current.data
        current = current.prev
    }
    
    return res.slice(1)
  }

  toString() {
    return this.forwardString()
  }

  append(data) {
    // 1.根据元素创建节点
    const newNode = this.createNode(data)

    // 2.判断列表是否为空列表
    if (this.head == null) {
        this.head = newNode
        this.tail = newNode
    } else {
        this.tail.next = newNode
        newNode.prev = this.tail
        this.tail = newNode
    }
    
    // 3.length+1
    this.length++
  }

  insert(position, data) {
     // 1.判断越界的问题
     if (position < 0 || position > this.length) return false

     // 2.创建新的节点
     const newNode = this.createNode(data)
 
     // 3.判断插入的位置
     if (position === 0) { // 在第一个位置插入数据
         // 判断链表是否为空
         if (this.head == null) {
             this.head = newNode
             this.tail = newNode
         } else {
             this.head.prev = newNode
             newNode.next = this.head
             this.head = newNode
         }
     } else if (position === this.length) { // 插入到最后的情况
         this.tail.next = newNode
         newNode.prev = this.tail
         this.tail = newNode
     } else { // 在中间位置插入数据
         // 定义属性
         let index = 0
         let current = this.head
         let previous = null
         
         // 查找正确的位置
         while (index++ < position) {
             previous = current
             current = current.next
         }
         
         // 交换节点的指向顺序
         newNode.next = current
         newNode.prev = previous
         current.prev = newNode
         previous.next = newNode
     }
     
     // 4.length+1
     this.length++
     
     return true
  }

  removeAt(position) {
    // 1.判断越界的问题
    if (position < 0 || position >= this.length) return null

    // 2.判断移除的位置
    let current = this.head
    if (position === 0) {
        if (this.length == 1) {
            this.head = null
            this.tail = null
        } else {
            this.head = this.head.next
            this.head.prev = null
        }
    } else if (position === this.length -1) {
        current = this.tail
        this.tail = this.tail.prev
        this.tail.next = null
    } else {
        let index = 0
        let previous = null

        while (index++ < position) {
            previous = current
            current = current.next
        }

        previous.next = current.next
        current.next.prev = previous
    }

    // 3.length-1
    this.length--

    return current.data
  }

  indexOf(data) {
     let current = this.head
     let index = 0
 
     while (current) {
         if (current.data === data) {
             return index
         }
         index++
         current = current.next
     }
 
     // 没有找到, 则返回-1
     return -1
  }

  remove(data) {
    let index = this.indexOf(data)
    return this.removeAt(index)
  }

  isEmpty() {
    return this.length === 0
  }

  size() {
    return this.length
  }
}


const nodes = new DoublelinkList()

nodes.append('no1')
nodes.append('no2')
nodes.append('no3')
nodes.append('no4')
nodes.append('no5')
nodes.append('end')

window.nodes = nodes

```


<script>

class DoublelinkList {
  constructor() {
    this.head = null; //头指针，指向第一个链表节点
    this.tail = null; //尾指针，指向最后一个链表节点
    this.length = 0; //链表的长度
  }
    
  //创建双向链表节点的方法
  createNode(data) {
    return {
      data,
      next: null,
      tail: null
    }
  }
  
  //方便查看链表的结构，forwardString、reverseString、toString 方法
  forwardString() {
    // 1.定义两个变量
    let current = this.head
    let res = ""

    // 2.循环获取链表中所有的元素
    while (current) {
        res += "," + current.data
        current = current.next
    }

    // 3.返回最终结果
    return res.slice(1)
  }

  reverseString() {
    let current = this.tail
    let res = ""
    
    while (current) {
        res += "," + current.data
        current = current.prev
    }
    
    return res.slice(1)
  }

  toString() {
    return this.forwardString()
  }

  append(data) {
    // 1.根据元素创建节点
    const newNode = this.createNode(data)

    // 2.判断列表是否为空列表
    if (this.head == null) {
        this.head = newNode
        this.tail = newNode
    } else {
        this.tail.next = newNode
        newNode.prev = this.tail
        this.tail = newNode
    }
    
    // 3.length+1
    this.length++
  }

  insert(position, data) {
     // 1.判断越界的问题
     if (position < 0 || position > this.length) return false

     // 2.创建新的节点
     const newNode = this.createNode(data)
 
     // 3.判断插入的位置
     if (position === 0) { // 在第一个位置插入数据
         // 判断链表是否为空
         if (this.head == null) {
             this.head = newNode
             this.tail = newNode
         } else {
             this.head.prev = newNode
             newNode.next = this.head
             this.head = newNode
         }
     } else if (position === this.length) { // 插入到最后的情况
         this.tail.next = newNode
         newNode.prev = this.tail
         this.tail = newNode
     } else { // 在中间位置插入数据
         // 定义属性
         let index = 0
         let current = this.head
         let previous = null
         
         // 查找正确的位置
         while (index++ < position) {
             previous = current
             current = current.next
         }
         
         // 交换节点的指向顺序
         newNode.next = current
         newNode.prev = previous
         current.prev = newNode
         previous.next = newNode
     }
     
     // 4.length+1
     this.length++
     
     return true
  }

  removeAt(position) {
    // 1.判断越界的问题
    if (position < 0 || position >= this.length) return null

    // 2.判断移除的位置
    let current = this.head
    if (position === 0) {
        if (this.length == 1) {
            this.head = null
            this.tail = null
        } else {
            this.head = this.head.next
            this.head.prev = null
        }
    } else if (position === this.length -1) {
        current = this.tail
        this.tail = this.tail.prev
        this.tail.next = null
    } else {
        let index = 0
        let previous = null

        while (index++ < position) {
            previous = current
            current = current.next
        }

        previous.next = current.next
        current.next.prev = previous
    }

    // 3.length-1
    this.length--

    return current.data
  }

  indexOf(data) {
     let current = this.head
     let index = 0
 
     while (current) {
         if (current.data === data) {
             return index
         }
         index++
         current = current.next
     }
 
     // 没有找到, 则返回-1
     return -1
  }

  remove(data) {
    let index = this.indexOf(data)
    return this.removeAt(index)
  }

  isEmpty() {
    return this.length === 0
  }

  size() {
    return this.length
  }
}


const nodes = new DoublelinkList()

nodes.append('no1')
nodes.append('no2')
nodes.append('no3')
nodes.append('no4')
nodes.append('no5')
nodes.append('end')

window.nodes = nodes

// 作者：Jolyne_
// 链接：https://juejin.cn/post/7231842222781071421
// 来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


</script>
