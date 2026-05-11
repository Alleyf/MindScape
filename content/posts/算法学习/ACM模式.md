---
title: ACM模式
date: 2026-04-04 12:11:50
tags: 
sticky: 80
excerpt: 
author: fcs
index_img: https://picsum.photos/800/300.webp?random=202604041211
lang: zh-CN
number headings: auto, first-level 1, max 5, start-at 1, 1.1
personality: "沉思者"
description: "import java.util.;"
---
> 1. in.nextLine(); // 注意消耗换行符
> 2. 一键导入常用包：
> 3.  Character.getNumericValue(char c) // 获取字符的整型值

```java
import java.util.*;

import java.lang.*;

import java.util.stream.Collectors;
```

## 0.1 数组列表互相转换

### 0.1.1 数组转列表

```java
String[] arr = {"a", "b", "c"};
List<String> list = new ArrayList<>();
Collections.addAll(list, arr);


String[] arr = {"a", "b", "c"};
List<String> list = new ArrayList<>(Arrays.asList(arr));
list.add("d"); // ✅ 可以添加元素
```

### 0.1.2 列表转数组

```java
List<String> list = Arrays.asList("a", "b", "c");

// 转换为Object数组
Object[] arr1 = list.toArray();

// 转换为指定类型数组（推荐）
String[] arr2 = list.toArray(new String[0]);
String[] arr3 = list.toArray(new String[list.size()]);




List<String> list = Arrays.asList("a", "b", "c");
String[] arr = list.stream().toArray(String[]::new);

```

### 0.1.3 字符串数组转整形

```java
Scanner in = new Scanner(System.in);
String[] split = in.nextLine().split("\\s+");

// 转为 int 数组
int[] arr = Arrays.stream(split)
                  .mapToInt(Integer::parseInt)
                  .toArray();
                  
                  
Scanner in = new Scanner(System.in);
String[] split = in.nextLine().split("\\s+");

// 方法A：使用 map()
List<Integer> list = Arrays.stream(split)
                           .map(Integer::parseInt)
                           .collect(Collectors.toList());

// 方法B：使用 mapToInt() 然后 boxed()
List<Integer> list2 = Arrays.stream(split)
                            .mapToInt(Integer::parseInt)
                            .boxed()
                            .collect(Collectors.toList());
```

## 0.2 构建二叉树

### 0.2.1 DFS 前序遍历法

```java
public Node buildTree(int index, List<Integer> list) {  
    int length = list.size(); 
if (length == 0 || list.get(0) == -1) return null;
	// 索引合法且是否为空值（节点是否存在）
    if (index >= length || list.get(index) == null || list.get(index) == -1) {  
        return null;  
    }  
    // 创建当前节点  
    Node root = new Node(list.get(index));  
    // 构建左子树  
    root.left = buildTree(2 * index + 1, list);  
    // 构建右子树  
    root.right = buildTree(2 * index + 2, list);  
  
    return root;  
}
```

### 0.2.2 迭代递推法

```java
// 构造：仅当父存在且当前值非 -1 时创建并链接
    static Node buildTree(int[] nums) {
        int n = nums.length;
        if (n == 0 || nums[0] == -1) return null;
        // 定义节点数组
        Node[] nodes = new Node[n];
        // 初始化头节点
        nodes[0] = new Node(nums[0]);
        for (int i = 1; i < n; i++) {
            if (nums[i] == -1) continue;
            // 获取父节点索引
            int p = (i - 1) / 2;
            // 判断索引合法且父节点存在
            if (p >= 0 && nodes[p] != null) {
            	// 构建当前节点
                nodes[i] = new Node(nums[i]);
                // 根据当前节点索引关系链接父节点
                if (i == 2 * p + 1) nodes[p].left = nodes[i];
                else nodes[p].right = nodes[i];
            }
        }
        return nodes[0];
    }
```

### 0.2.3 BFS 层序遍历法

```java
// 根据层次遍历序列构建二叉树
public static Node buildFromLevelOrder(String[] tokens) {
    if (tokens.length == 0 || tokens[0].equals("null")) return null;
    Node root = new Node(Integer.parseInt(tokens[0]));
    Queue<Node> queue = new LinkedList<>();
    queue.offer(root);
    int i = 1;
    while (!queue.isEmpty() && i < tokens.length) {
        Node curr = queue.poll();
        // 处理左孩子
        if (!tokens[i].equals("null")) {
            curr.left = new Node(Integer.parseInt(tokens[i]));
            queue.offer(curr.left);
        }
        i++;
        if (i >= tokens.length) break;
        // 处理右孩子
        if (!tokens[i].equals("null")) {
            curr.right = new Node(Integer.parseInt(tokens[i]));
            queue.offer(curr.right);
        }
        i++;
    }
    return root;
}
```

## 0.3 数学原理

### 0.3.1 快速判断是否为质数

```java
public static boolean isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;  // 2, 3 是质数
    if (n % 2 == 0 || n % 3 == 0) return false;
    
    // 只需检查到 √n，且跳过 2、3 的倍数
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}
```