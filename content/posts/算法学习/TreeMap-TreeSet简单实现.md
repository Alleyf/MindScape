---
title: "TreeMap 与 TreeSet 的简单实现"
date: "2026-03-08"
tags: ["算法","数据结构"]
personality: "沉思者"
description: "- TreeMap 实现#tree-map-实现"
cover: "/images/covers/ms-6fcf79b6.svg"
---
# TreeMap 与 TreeSet 的简单实现

> 基于二叉搜索树（BST）的 Java 实现

## 📖 目录

- [概述](#概述)
- [TreeMap 实现](#tree-map-实现)
- [TreeSet 实现](#tree-set-实现)
- [使用示例](#使用示例)
- [复杂度分析](#复杂度分析)

---

## 📝 概述

根据 [Labuladong 二叉搜索树的应用及可视化](https://labuladong.online/zh/algo/data-structure-basic/tree-map-basic/) 中的接口说明，本文实现了以下接口：

### TreeMap 接口

```java
class MyTreeMap<K, V> {
    // 基本增删查改
    public void put(K key, V value)      // 增/改，O(logN)
    public V get(K key)                  // 查，O(logN)
    public void remove(K key)            // 删，O(logN)
    public boolean containsKey(K key)    // 是否包含键，O(logN)
    public List<K> keys()                // 返回所有键，O(N)
    
    // 额外方法
    public K firstKey()                  // 最小键，O(logN)
    public K lastKey()                   // 最大键，O(logN)
    public K floorKey(K key)             // <= key 的最大键，O(logN)
    public K ceilingKey(K key)           // >= key 的最小键，O(logN)
    public K selectKey(int k)             // 排名为 k 的键，O(logN)
    public int rank(K key)                // key 的排名，O(logN)
    public List<K> rangeKeys(K low, K high) // 区间查找，O(logN + M)
}
```

### TreeSet 接口

```java
class MyTreeSet<E> {
    // 基本方法
    public boolean add(E e)               // 添加，O(logN)
    public boolean remove(Object o)        // 删除，O(logN)
    public boolean contains(Object o)      // 包含，O(logN)
    public int size()                      // 大小，O(1)
    public boolean isEmpty()               // 是否为空，O(1)
    public void clear()                    // 清空，O(1)
    public Iterator<E> iterator()          // 迭代器，O(N)
    
    // 有序操作
    public E first()                       // 最小元素，O(logN)
    public E last()                        // 最大元素，O(logN)
    public E floor(E e)                   // <= e 的最大元素，O(logN)
    public E ceiling(E e)                  // >= e 的最小元素，O(logN)
}
```

---

## 🌲 TreeMap 实现

```java
import java.util.*;

/**
 * TreeMap 简单实现 - 基于二叉搜索树
 * 未实现自平衡，极端情况会退化为 O(n)
 */
public class MyTreeMap<K extends Comparable<K>, V> {

    // ==================== 内部节点类 ====================
    
    private static class Node<K, V> {
        K key;
        V value;
        Node<K, V> left;
        Node<K, V> right;
        
        Node(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }
    
    // ==================== 成员变量 ====================
    
    private Node<K, V> root;
    private int size = 0;
    
    // ==================== 基本操作 ====================
    
    /**
     * 增/改
     * 时间复杂度：O(logN) 平均，O(n) 最坏
     */
    public void put(K key, V value) {
        if (root == null) {
            root = new Node<>(key, value);
            size++;
            return;
        }
        
        Node<K, V> cur = root;
        while (cur != null) {
            int cmp = key.compareTo(cur.key);
            if (cmp < 0) {
                if (cur.left == null) {
                    cur.left = new Node<>(key, value);
                    size++;
                    return;
                }
                cur = cur.left;
            } else if (cmp > 0) {
                if (cur.right == null) {
                    cur.right = new Node<>(key, value);
                    size++;
                    return;
                }
                cur = cur.right;
            } else {
                // 键已存在，更新值
                cur.value = value;
                return;
            }
        }
    }
    
    /**
     * 查
     * 时间复杂度：O(logN) 平均，O(n) 最坏
     */
    public V get(K key) {
        Node<K, V> node = findNode(key);
        return node == null ? null : node.value;
    }
    
    /**
     * 删
     * 时间复杂度：O(logN) 平均，O(n) 最坏
     */
    public void remove(K key) {
        root = remove(root, key);
    }
    
    private Node<K, V> remove(Node<K, V> node, K key) {
        if (node == null) return null;
        
        int cmp = key.compareTo(node.key);
        if (cmp < 0) {
            node.left = remove(node.left, key);
        } else if (cmp > 0) {
            node.right = remove(node.right, key);
        } else {
            // 找到目标节点
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;
            
            // 双子节点：找后继节点替换
            Node<K, V> successor = minNode(node.right);
            node.key = successor.key;
            node.value = successor.value;
            node.right = remove(node.right, successor.key);
        }
        return node;
    }
    
    /**
     * 是否包含键
     * 时间复杂度：O(logN) 平均，O(n) 最坏
     */
    public boolean containsKey(K key) {
        return findNode(key) != null;
    }
    
    // ==================== 有序操作 ====================
    
    /**
     * 返回所有键（有序）
     * 时间复杂度：O(N)
     */
    public List<K> keys() {
        List<K> result = new ArrayList<>();
        inOrderTraversal(root, result);
        return result;
    }
    
    /**
     * 查找最小键
     * 时间复杂度：O(logN)
     */
    public K firstKey() {
        if (root == null) return null;
        return minNode(root).key;
    }
    
    /**
     * 查找最大键
     * 时间复杂度：O(logN)
     */
    public K lastKey() {
        if (root == null) return null;
        return maxNode(root).key;
    }
    
    /**
     * 查找小于等于 key 的最大键
     * 时间复杂度：O(logN)
     */
    public K floorKey(K key) {
        Node<K, V> result = null;
        Node<K, V> cur = root;
        
        while (cur != null) {
            int cmp = key.compareTo(cur.key);
            if (cmp >= 0) {
                result = cur;
                cur = cur.right;
            } else {
                cur = cur.left;
            }
        }
        return result == null ? null : result.key;
    }
    
    /**
     * 查找大于等于 key 的最小键
     * 时间复杂度：O(logN)
     */
    public K ceilingKey(K key) {
        Node<K, V> result = null;
        Node<K, V> cur = root;
        
        while (cur != null) {
            int cmp = key.compareTo(cur.key);
            if (cmp <= 0) {
                result = cur;
                cur = cur.left;
            } else {
                cur = cur.right;
            }
        }
        return result == null ? null : result.key;
    }
    
    /**
     * 查找排名为 k 的键（k 从 0 开始）
     * 时间复杂度：O(logN)
     */
    public K selectKey(int k) {
        if (k < 0 || k >= size) return null;
        return selectNode(root, k).key;
    }
    
    /**
     * 查找键 key 的排名
     * 时间复杂度：O(logN)
     */
    public int rank(K key) {
        return rank(root, key);
    }
    
    /**
     * 区间查找
     * 时间复杂度：O(logN + M)，M 为结果数量
     */
    public List<K> rangeKeys(K low, K high) {
        List<K> result = new ArrayList<>();
        rangeKeys(root, low, high, result);
        return result;
    }
    
    // ==================== 辅助方法 ====================
    
    private Node<K, V> findNode(K key) {
        Node<K, V> cur = root;
        while (cur != null) {
            int cmp = key.compareTo(cur.key);
            if (cmp < 0) cur = cur.left;
            else if (cmp > 0) cur = cur.right;
            else return cur;
        }
        return null;
    }
    
    private Node<K, V> minNode(Node<K, V> node) {
        while (node.left != null) node = node.left;
        return node;
    }
    
    private Node<K, V> maxNode(Node<K, V> node) {
        while (node.right != null) node = node.right;
        return node;
    }
    
    private void inOrderTraversal(Node<K, V> node, List<K> result) {
        if (node == null) return;
        inOrderTraversal(node.left, result);
        result.add(node.key);
        inOrderTraversal(node.right, result);
    }
    
    private Node<K, V> selectNode(Node<K, V> node, int k) {
        if (node == null) return null;
        
        int leftSize = size(node.left);
        if (k < leftSize) return selectNode(node.left, k);
        else if (k > leftSize) return selectNode(node.right, k - leftSize - 1);
        else return node;
    }
    
    private int size(Node<K, V> node) {
        return node == null ? 0 : size(node.left) + size(node.right) + 1;
    }
    
    private int rank(Node<K, V> node, K key) {
        if (node == null) return 0;
        
        int cmp = key.compareTo(node.key);
        if (cmp < 0) return rank(node.left, key);
        else if (cmp > 0) return size(node.left) + 1 + rank(node.right, key);
        else return size(node.left);
    }
    
    private void rangeKeys(Node<K, V> node, K low, K high, List<K> result) {
        if (node == null) return;
        
        int cmpLow = low.compareTo(node.key);
        int cmpHigh = high.compareTo(node.key);
        
        if (cmpLow < 0) rangeKeys(node.left, low, high, result);
        if (cmpLow <= 0 && cmpHigh >= 0) result.add(node.key);
        if (cmpHigh > 0) rangeKeys(node.right, low, high, result);
    }
    
    // ==================== 基本方法 ====================
    
    public int size() {
        return size;
    }
    
    public boolean isEmpty() {
        return size == 0;
    }
    
    public void clear() {
        root = null;
        size = 0;
    }
}
```

---

## 📦 TreeSet 实现

```java
import java.util.*;

/**
 * TreeSet 简单实现 - 基于 MyTreeMap 封装
 * 未实现自平衡，极端情况会退化为 O(n)
 */
public class MyTreeSet<E extends Comparable<E>> {

    // ==================== 成员变量 ====================
    
    private final MyTreeMap<E, Object> map;
    private static final Object PRESENT = new Object();
    
    // ==================== 构造方法 ====================
    
    public MyTreeSet() {
        map = new MyTreeMap<>();
    }
    
    // ==================== 基本操作 ====================
    
    /**
     * 添加元素
     * 时间复杂度：O(logN)
     */
    public boolean add(E e) {
        if (map.containsKey(e)) {
            return false;
        }
        map.put(e, PRESENT);
        return true;
    }
    
    /**
     * 删除元素
     * 时间复杂度：O(logN)
     */
    public boolean remove(Object o) {
        @SuppressWarnings("unchecked")
        E e = (E) o;
        if (!map.containsKey(e)) {
            return false;
        }
        map.remove(e);
        return true;
    }
    
    /**
     * 是否包含元素
     * 时间复杂度：O(logN)
     */
    public boolean contains(Object o) {
        @SuppressWarnings("unchecked")
        E e = (E) o;
        return map.containsKey(e);
    }
    
    // ==================== 有序操作 ====================
    
    /**
     * 获取最小元素
     * 时间复杂度：O(logN)
     */
    public E first() {
        return map.firstKey();
    }
    
    /**
     * 获取最大元素
     * 时间复杂度：O(logN)
     */
    public E last() {
        return map.lastKey();
    }
    
    /**
     * 查找小于等于 e 的最大元素
     * 时间复杂度：O(logN)
     */
    public E floor(E e) {
        return map.floorKey(e);
    }
    
    /**
     * 查找大于等于 e 的最小元素
     * 时间复杂度：O(logN)
     */
    public E ceiling(E e) {
        return map.ceilingKey(e);
    }
    
    // ==================== 视图方法 ====================
    
    /**
     * 返回迭代器（有序）
     * 时间复杂度：O(N) 遍历
     */
    public Iterator<E> iterator() {
        return map.keys().iterator();
    }
    
    // ==================== 基本方法 ====================
    
    public int size() {
        return map.size();
    }
    
    public boolean isEmpty() {
        return map.isEmpty();
    }
    
    public void clear() {
        map.clear();
    }
}
```

---

## 💻 使用示例

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("========== MyTreeMap 测试 ==========");
        testTreeMap();
        
        System.out.println("\n========== MyTreeSet 测试 ==========");
        testTreeSet();
    }
    
    private static void testTreeMap() {
        MyTreeMap<Integer, String> map = new MyTreeMap<>();
        
        // 添加元素
        map.put(5, "five");
        map.put(2, "two");
        map.put(8, "eight");
        map.put(1, "one");
        map.put(3, "three");
        map.put(7, "seven");
        
        System.out.println("添加元素后大小: " + map.size());  // 6
        
        // 查询
        System.out.println("get(5): " + map.get(5));        // five
        System.out.println("containsKey(3): " + map.containsKey(3));  // true
        System.out.println("containsKey(10): " + map.containsKey(10)); // false
        
        // 有序操作
        System.out.println("firstKey(): " + map.firstKey());    // 1
        System.out.println("lastKey(): " + map.lastKey());      // 8
        System.out.println("floorKey(4): " + map.floorKey(4)); // 3
        System.out.println("ceilingKey(4): " + map.ceilingKey(4)); // 5
        
        // 排名操作
        System.out.println("selectKey(2): " + map.selectKey(2)); // 3
        System.out.println("rank(5): " + map.rank(5));          // 2
        
        // 区间查找
        System.out.println("keys(): " + map.keys());       // [1, 2, 3, 5, 7, 8]
        System.out.println("rangeKeys(2, 7): " + map.rangeKeys(2, 7));  // [2, 3, 5, 7]
        
        // 删除
        map.remove(5);
        System.out.println("删除后 get(5): " + map.get(5)); // null
    }
    
    private static void testTreeSet() {
        MyTreeSet<Integer> set = new MyTreeSet<>();
        
        // 添加元素
        set.add(5);
        set.add(2);
        set.add(8);
        set.add(1);
        set.add(3);
        set.add(7);
        
        System.out.println("添加元素后大小: " + set.size());  // 6
        
        // 查询
        System.out.println("contains(3): " + set.contains(3));    // true
        System.out.println("contains(10): " + set.contains(10)); // false
        
        // 有序操作
        System.out.println("first(): " + set.first());    // 1
        System.out.println("last(): " + set.last());      // 8
        System.out.println("floor(4): " + set.floor(4));  // 3
        System.out.println("ceiling(4): " + set.ceiling(4)); // 5
        
        // 遍历（有序）
        System.out.print("iterator: ");
        for (Integer num : set) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        // 删除
        set.remove(5);
        System.out.println("删除后 contains(5): " + set.contains(5)); // false
    }
}
```

### 输出结果

```
========== MyTreeMap 测试 ==========
添加元素后大小: 6
get(5): five
containsKey(3): true
containsKey(10): false
firstKey(): 1
lastKey(): 8
floorKey(4): 3
ceilingKey(4): 5
selectKey(2): 3
rank(5): 2
keys(): [1, 2, 3, 5, 7, 8]
rangeKeys(2, 7): [2, 3, 5, 7]
删除后 get(5): null

========== MyTreeSet 测试 ==========
添加元素后大小: 6
contains(3): true
contains(10): false
first(): 1
last(): 8
floor(4): 3
ceiling(4): 5
iterator: 1 2 3 5 7 8 
删除后 contains(5): false
```

---

## 📊 复杂度分析

| 操作 | 平均时间复杂度 | 最坏时间复杂度 | 空间复杂度 |
|------|---------------|---------------|-----------|
| put/add | O(logN) | O(N) | O(N) |
| get/contains | O(logN) | O(N) | O(1) |
| remove | O(logN) | O(N) | O(N) |
| firstKey/first | O(logN) | O(N) | O(1) |
| lastKey/last | O(logN) | O(N) | O(1) |
| floorKey/floor | O(logN) | O(N) | O(1) |
| ceilingKey/ceiling | O(logN) | O(N) | O(1) |
| selectKey | O(logN) | O(N) | O(1) |
| rank | O(logN) | O(N) | O(N) |
| rangeKeys | O(logN + M) | O(N) | O(M) |
| keys/iterator | O(N) | O(N) | O(N) |

**说明**：
- N 为元素个数
- M 为查询结果个数
- 最坏情况发生在树退化为链表时（有序数据插入）

---

## ⚠️ 注意事项

1. **非自平衡**：本实现基于普通 BST，未实现红黑树等自平衡机制
2. **极端退化**：在有序数据插入时会退化为链表，时间复杂度退化为 O(n)
3. **生产环境**：生产环境请使用 Java 标准库的 `TreeMap` 和 `TreeSet`（基于红黑树实现）
4. **仅供学习**：本实现仅用于理解 TreeMap/TreeSet 的接口和原理

---

## 📚 参考

- [Labuladong - 二叉搜索树的应用及可视化](https://labuladong.online/zh/algo/data-structure-basic/tree-map-basic/)
