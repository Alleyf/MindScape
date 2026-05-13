---
title: "ACM模式"
date: "2026-04-04"
tags: ["算法", "ACM", "Java", "ACM模式"]
personality: "沉思者"
description: "ACM竞赛模式的Java代码模板与常用技巧总结"
cover: "https://picsum.photos/seed/acm-pattern/1200/630"
---

![ACM竞赛](https://picsum.photos/seed/acm-contest/800/400)

> 1. in.nextLine(); // 注意消耗换行符
> 2. 一键导入常用包：
> 3. Character.getNumericValue(char c) // 获取字符的整型值

```java
import java.util.*;
import java.lang.*;
import java.util.stream.Collectors;
```

![Java常用操作](https://picsum.photos/seed/java-utils/800/400)

## 0.1 数组列表互相转换

### 0.1.1 数组转列表

```java
String[] arr = {"a", "b", "c"};
List<String> list = new ArrayList<>();
Collections.addAll(list, arr);

String[] arr = {"a", "b", "c"};
List<String> list = new ArrayList<>(Arrays.asList(arr));
list.add("d"); // 可以添加元素
```

### 0.1.2 列表转数组

```java
List<String> list = Arrays.asList("a", "b", "c");
Object[] arr1 = list.toArray();
String[] arr2 = list.toArray(new String[0]);
String[] arr3 = list.toArray(new String[list.size()]);
List<String> list = Arrays.asList("a", "b", "c");
String[] arr = list.stream().toArray(String[]::new);
```

### 0.1.3 字符串数组转整形

```java
Scanner in = new Scanner(System.in);
String[] split = in.nextLine().split("\s+");
int[] arr = Arrays.stream(split).mapToInt(Integer::parseInt).toArray();

Scanner in = new Scanner(System.in);
String[] split = in.nextLine().split("\s+");
List<Integer> list = Arrays.stream(split).map(Integer::parseInt).collect(Collectors.toList());
```

![数组转换](https://picsum.photos/seed/array-convert/800/400)

## 0.2 构建二叉树

### 0.2.1 DFS 前序遍历法

```java
public Node buildTree(int index, List<Integer> list) {
    int length = list.size();
    if (length == 0 || list.get(0) == -1) return null;
    if (index >= length || list.get(index) == null || list.get(index) == -1) return null;
    Node root = new Node(list.get(index));
    root.left = buildTree(2 * index + 1, list);
    root.right = buildTree(2 * index + 2, list);
    return root;
}
```

### 0.2.2 迭代递推法

```java
static Node buildTree(int[] nums) {
    int n = nums.length;
    if (n == 0 || nums[0] == -1) return null;
    Node[] nodes = new Node[n];
    nodes[0] = new Node(nums[0]);
    for (int i = 1; i < n; i++) {
        if (nums[i] == -1) continue;
        int p = (i - 1) / 2;
        if (p >= 0 && nodes[p] != null) {
            nodes[i] = new Node(nums[i]);
            if (i == 2 * p + 1) nodes[p].left = nodes[i];
            else nodes[p].right = nodes[i];
        }
    }
    return nodes[0];
}
```

### 0.2.3 BFS 层序遍历法

```java
public static Node buildFromLevelOrder(String[] tokens) {
    if (tokens.length == 0 || tokens[0].equals("null")) return null;
    Node root = new Node(Integer.parseInt(tokens[0]));
    Queue<Node> queue = new LinkedList<>();
    queue.offer(root);
    int i = 1;
    while (!queue.isEmpty() && i < tokens.length) {
        Node curr = queue.poll();
        if (!tokens[i].equals("null")) {
            curr.left = new Node(Integer.parseInt(tokens[i]));
            queue.offer(curr.left);
        }
        i++;
        if (i >= tokens.length) break;
        if (!tokens[i].equals("null")) {
            curr.right = new Node(Integer.parseInt(tokens[i]));
            queue.offer(curr.right);
        }
        i++;
    }
    return root;
}
```

![二叉树构建](https://picsum.photos/seed/binary-tree/800/400)

## 0.3 数学原理

### 0.3.1 快速判断是否为质数

```java
public static boolean isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}
```
