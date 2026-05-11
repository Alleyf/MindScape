---
title: "ArrayList-LinkedList-HashSet-TreeSet"
date: "2026-03-17"
tags: ["Java", "数据结构", "集合"]
personality: "guide"
description: "Java 集合框架学习：ArrayList、LinkedList、HashSet、TreeSet"
---

# 1 数组

为什么数组索引1从0开始呢？假如从1开始不行吗？

1. 在根据数组索引获取元素的时候，会用索引和寻址公式来计算内存所对应的元素数据，寻址公式是：`数组的首地址+索引乘以存储数据的类型大小`
2. 如果数组的索引从1开始，寻址公式中，就需要增加一次减法操作，对于CPU来说就多了一次指令，性能不高。

# 2 ArrayList

## 2.1 添加和扩容机制

1. 默认初始容量0，第一次添加数据时初始化容量为10，每次扩容1.5倍，每次扩容拷贝数组（浅拷贝，仅拷贝原元素的地址）；
2. 初始化时根据元素数量决定是否扩容，后续满了后继续新增才扩容。

## 2.2 底层实现原理

1. ArrayList底层是用动态的数组实现的。
2. ArrayList初始容量为0，当第一次添加数据的时候才会初始化容量为10
3. ArrayList在进行扩容的时候是原来容量的1.5倍，每次扩容都需要拷贝数组
4. ArrayList在添加数据的时候，计算长度➕1后是否可以存下数据，无法存下则调用grow方法进行扩容，否则添加新元素到size的位置并size自增。

## 2.3 如何实现数组和List之间的转换

```java
//array到list是引用拷贝，修改数组会改变list
Arrays.asList(array)；
//list到array是数据拷贝，修改list不改变array
list.toArray(new T[list.size()]）
```

# 3 LinkedList

## 3.1 ArrayList和LinkedList的区别是什么

1. 底层数据结构：动态数组和双链表
2. 效率：增删改查时间复杂度不同
3. 空间：数组节省空间，链表多两个指针更占内存
4. 线程是否安全：都不是线程安全的
在方法内使用，局部变量则是线程安全的
使用线程安全的ArrayList和LinkedList

```java
List<Object> syncArrayList = Collections.synchronizedList(new ArrayList<>());
List<Object> syncLinkedList = Collections.synchronizedList(new LinkedList<>());
```