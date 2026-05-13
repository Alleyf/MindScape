---
title: "MyBatis"
date: "2026-03-08"
tags: ["MyBatis","后端"]
personality: "引路人"
description: "MyBatis 框架学习笔记"
cover: "/images/covers/ms-40f90e2f.svg"
---

## 0.1 执行流程

1. 读取 MyBatis 配置文件：`mybatis-config.xml` 加载运行环境和映射文件
2. 构造会话工厂 `SqISessionFactory`
3. 会话工厂创建 `SqISession` 对象(包含了执行 SQL 语句的所有方法)
4. 操作数据库的接口，`Executor` 执行器，同时负责查询缓存的维护
5. Executor 接口的执行方法中有一个 `MappedStatement` 类型的参数，封装了*映射信息*
6. 输入参数映射
7. 输出结果映射

![image.png](http://img.fcs.cloudns.ch/pics/20260309004228807.png)

## 0.2 延迟加载

> Mybatis 支持延迟记载，但默认没有开启，在 Mybatis 配置文件中，可以配置是否启用延迟加载 `lazyLoadingEnabled=true|false`。

**原理**
1. 使用 CGLIB 创建目标对象的代理对象
2. 当调用目标方法 user.getOrderList()时，进入拦截器 invoke 方法，发现 user.getOrderList()是 null 值，执行 sql 查询 order 列表
3. 把 order 查询上来，然后调用 `user.setOrderList(List<Order>orderList）`，接着完成 user.getOrderList()方法的调用

![image.png](http://img.fcs.cloudns.ch/pics/20260309010446755.png)

## 0.3 一级二级缓存

本地缓存，基于 PerpetualCache，本质是一个 HashMap

- 一级缓存：作用域是 session 级别
- 二级缓存：作用域是 namespace 和 mapper 的作用域，不依赖于 session

1. 对于缓存数据更新机制，当某一个作用域（一级缓存Session/二级缓存Namespaces）的进行了**新增、修改、删除**操作后，默认该作用域下所有select中的缓存将被clear
2. 二级缓存需要缓存的数据实现Serializable接口
3. 只有**会话提交或者关闭**以后，一级缓存中的数据才会转移到二级缓存中

### 0.3.1 一级缓存

> 基于 PerpetualCache 的 HashMap 本地缓存，其存储作用域为 Session，当 Session 进行 flush 或 close 之后，该 Session 中的所有 Cache 就将清空，默认打开一级缓存

```java
//2.获取SqlSession对象，用它来执行sql
SqlSession sqISession = sqlSessionFactory.openSession();
//3.执行sql
//3.1获取UserMapper接口的代理对象
UserMapper userMapper1 = sqlSession.getMapper(UserMapper.class);UserMapper userMapper2 = sqISession.getMapper(UserMapper.class);
User user = userMapper1.selectByld(6);
System.out.println(user);
只会执行一次sql查询
System.out.println("------------------");
User user1 = userMapper2.selectByld(6);
System.out.println(user1);
```

### 0.3.2 二级缓存

二级缓存是基于 namespace 和 mapper 的作用域起作用的，不是依赖于 SQLsession，默认也是采用 PerpetualCache，HashMap 存储

二级缓存默认是关闭的开启方式，两步：
1. 全局配置文件

```java
<settings>
	<setting name="cacheEnabled"value="true" />
</settings>
```

1. 映射文件
使用 `<cache/>` 标签让当前 mapper 生效二级缓存

